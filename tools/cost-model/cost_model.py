#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T-05 · Công cụ ước tính chi phí và độ trễ một buổi học (gia sư AI).

Đọc MỌI con số từ file cấu hình TOML (mặc định: config.toml cùng thư mục).
Giá dịch vụ lấy từ docs/nghien-cuu/giong-noi.md (T-01), không viết cứng trong code.

Không gọi API thật, không dùng thư viện ngoài — chỉ dùng thư viện chuẩn Python.

Cách dùng:
    python3 cost_model.py                     # in bảng Markdown
    python3 cost_model.py --dinh-dang csv     # in bảng CSV
    python3 cost_model.py --cau-hinh config.toml --dinh-dang md
"""

import argparse
import csv
import io
import sys
import tomllib
from pathlib import Path

# Buổi chuẩn mà các kịch bản trong config mô tả (phút).
# Buổi 15/30 phút co giãn tuyến tính theo tỉ lệ so với buổi chuẩn.
BUOI_CHUAN_PHUT = 25


def tai_cau_hinh(duong_dan: Path) -> dict:
    """Đọc file TOML. Báo lỗi rõ ràng nếu thiếu file hoặc thiếu khóa."""
    try:
        with open(duong_dan, "rb") as f:
            cfg = tomllib.load(f)
    except FileNotFoundError:
        sys.exit(f"Lỗi: không tìm thấy file cấu hình: {duong_dan}")
    except tomllib.TOMLDecodeError as e:
        sys.exit(f"Lỗi: file cấu hình không đúng định dạng TOML: {e}")

    for khoa in ("tham_so", "gia", "do_tre", "kich_ban", "phuong_an"):
        if khoa not in cfg:
            sys.exit(f"Lỗi: file cấu hình thiếu mục [{khoa}].")
    kiem_tra_khoa(cfg)
    return cfg


KHOA_BAT_BUOC = {
    "tham_so": ("ty_gia_usd_vnd", "buoi_moi_tuan", "thoi_luong_phut"),
    "gia.llm": ("tien_te", "gia_1m_token_vao", "gia_1m_token_ra"),
    "gia.khac": ("ha_tang_vnd_moi_buoi",),
    "do_tre": ("stt_giay", "llm_giay", "tts_giay"),
}
KHOA_KICH_BAN = (
    "phut_tre_noi", "ky_tu_ai_noi", "luot_hoi_thoai",
    "token_vao_moi_luot", "token_ra_moi_luot",
)


def kiem_tra_khoa(cfg: dict) -> None:
    """Báo lỗi dễ hiểu (không traceback) khi config thiếu khóa cần dùng."""

    def lay(duong_dan: str):
        muc = cfg
        for phan in duong_dan.split("."):
            if not isinstance(muc, dict) or phan not in muc:
                sys.exit(f"Lỗi: file cấu hình thiếu mục [{duong_dan}].")
            muc = muc[phan]
        return muc

    for duong_dan, cac_khoa in KHOA_BAT_BUOC.items():
        muc = lay(duong_dan)
        for khoa in cac_khoa:
            if khoa not in muc:
                sys.exit(f"Lỗi: mục [{duong_dan}] thiếu khóa '{khoa}'.")
    for ma_kb, kb in cfg["kich_ban"].items():
        for khoa in KHOA_KICH_BAN:
            if khoa not in kb:
                sys.exit(f"Lỗi: kịch bản [kich_ban.{ma_kb}] thiếu khóa '{khoa}'.")
    for pa in cfg["phuong_an"]:
        for khoa in ("ten", "stt", "tts"):
            if khoa not in pa:
                sys.exit(f"Lỗi: một khối [[phuong_an]] thiếu khóa '{khoa}'.")


def tong_token_vao(luot: float, token_moi_luot: float, token_lich_su_moi_luot: float) -> float:
    """Tổng token gửi vào mô hình cả buổi.

    Mỗi lượt gửi lại toàn bộ lịch sử trước đó: lượt thứ k (tính từ 0) gửi
    token_moi_luot + k x token_lich_su_moi_luot. Cộng n lượt:
    n x token_moi_luot + token_lich_su_moi_luot x n(n-1)/2.
    """
    return luot * token_moi_luot + token_lich_su_moi_luot * luot * (luot - 1) / 2


def hang_muc_chua_co_gia(cfg: dict) -> list[str]:
    """Các hạng mục đang có giá 0, nên tổng chi phí chưa đầy đủ."""
    thieu = []
    llm = cfg["gia"]["llm"]
    if llm["gia_1m_token_vao"] == 0 and llm["gia_1m_token_ra"] == 0:
        thieu.append("mô hình ngôn ngữ")
    if cfg["gia"]["khac"]["ha_tang_vnd_moi_buoi"] == 0:
        thieu.append("hạ tầng")
    return thieu


def doi_ra_vnd(so_tien: float, tien_te: str, ty_gia: float) -> float:
    if tien_te == "USD":
        return so_tien * ty_gia
    if tien_te == "VND":
        return so_tien
    sys.exit(f"Lỗi: tiền tệ không hỗ trợ: {tien_te} (chỉ nhận USD, VND).")


def tinh_chi_phi(cfg: dict) -> list[dict]:
    """Tính chi phí cho từng (phương án x kịch bản x thời lượng)."""
    ts = cfg["tham_so"]
    ty_gia = ts["ty_gia_usd_vnd"]
    buoi_moi_thang = ts["buoi_moi_tuan"] * 52 / 12

    gia_llm = cfg["gia"]["llm"]
    ha_tang_moi_buoi = cfg["gia"]["khac"]["ha_tang_vnd_moi_buoi"]

    ket_qua = []
    for pa in cfg["phuong_an"]:
        try:
            gia_stt = cfg["gia"]["stt"][pa["stt"]]
            gia_tts = cfg["gia"]["tts"][pa["tts"]]
        except KeyError as e:
            sys.exit(f"Lỗi: phương án '{pa['ten']}' trỏ tới giá không tồn tại: {e}.")

        for ma_kb, kb in cfg["kich_ban"].items():
            for phut in ts["thoi_luong_phut"]:
                he_so = phut / BUOI_CHUAN_PHUT  # co giãn tuyến tính từ buổi chuẩn 25'

                phut_tre_noi = kb["phut_tre_noi"] * he_so
                ky_tu_ai_noi = kb["ky_tu_ai_noi"] * he_so
                luot = kb["luot_hoi_thoai"] * he_so

                stt_vnd = phut_tre_noi * doi_ra_vnd(
                    gia_stt["gia_moi_phut"], gia_stt["tien_te"], ty_gia
                )
                tts_vnd = ky_tu_ai_noi * doi_ra_vnd(
                    gia_tts["gia_moi_ky_tu"], gia_tts["tien_te"], ty_gia
                )

                token_vao = tong_token_vao(
                    luot,
                    kb["token_vao_moi_luot"],
                    kb.get("token_lich_su_moi_luot", 0),
                )
                token_ra = luot * kb["token_ra_moi_luot"]
                llm_vnd = doi_ra_vnd(
                    token_vao / 1_000_000 * gia_llm["gia_1m_token_vao"]
                    + token_ra / 1_000_000 * gia_llm["gia_1m_token_ra"],
                    gia_llm["tien_te"],
                    ty_gia,
                )

                tong_buoi_chinh_xac = stt_vnd + tts_vnd + llm_vnd + ha_tang_moi_buoi
                ket_qua.append(
                    {
                        "phuong_an": pa["ten"],
                        "kich_ban": kb.get("ten_hien_thi", ma_kb),
                        "thoi_luong_phut": phut,
                        "stt_vnd": round(stt_vnd),
                        "tts_vnd": round(tts_vnd),
                        "llm_vnd": round(llm_vnd),
                        "ha_tang_vnd": round(ha_tang_moi_buoi),
                        "tong_buoi_vnd": round(tong_buoi_chinh_xac),
                        # Nhân trước rồi mới làm tròn để không cộng dồn sai số làm tròn
                        "tong_thang_vnd": round(tong_buoi_chinh_xac * buoi_moi_thang),
                        "token_vao_ca_buoi": round(token_vao),
                        "luot_hoi_thoai": luot,
                    }
                )
    return ket_qua


def tinh_do_tre(cfg: dict) -> dict:
    """Ước tính độ trễ mỗi lượt = nhận giọng + mô hình + đọc (số liệu từ config)."""
    dt = cfg["do_tre"]
    tong = dt["stt_giay"] + dt["llm_giay"] + dt["tts_giay"]
    return {
        "stt_giay": dt["stt_giay"],
        "llm_giay": dt["llm_giay"],
        "tts_giay": dt["tts_giay"],
        "tong_giay_moi_luot": tong,
    }


def dinh_dang_vnd(so: int) -> str:
    # Ngăn cách hàng nghìn bằng dấu chấm cho dễ đọc tiếng Việt: 5.660
    return f"{so:,}".replace(",", ".")


def ve_markdown(cfg: dict, chi_phi: list[dict], do_tre: dict) -> str:
    ts = cfg["tham_so"]
    dong = []
    dong.append("# Ước tính chi phí và độ trễ một buổi học (T-05)")
    dong.append("")
    thieu = hang_muc_chua_co_gia(cfg)
    if thieu:
        dong.append(
            f"> **CẢNH BÁO: tổng chi phí dưới đây CHƯA ĐẦY ĐỦ.** Giá {', '.join(thieu)} "
            "đang là 0 trong `config.toml`, nên các con số chỉ gồm phần đã có giá."
        )
        dong.append("")
    buoi_thang = f"{ts['buoi_moi_tuan'] * 52 / 12:.1f}".replace(".", ",")
    dong.append(
        f"Tỷ giá: 1 USD = {dinh_dang_vnd(ts['ty_gia_usd_vnd'])} VND · "
        f"{ts['buoi_moi_tuan']} buổi/tuần "
        f"(≈ {buoi_thang} buổi/tháng) · "
        "Giá từ `docs/nghien-cuu/giong-noi.md` (T-01)"
    )
    dong.append("")

    phuong_an_hien_tai = None
    for r in chi_phi:
        if r["phuong_an"] != phuong_an_hien_tai:
            if phuong_an_hien_tai is not None:
                dong.append("")
            phuong_an_hien_tai = r["phuong_an"]
            dong.append(f"## Phương án: {phuong_an_hien_tai}")
            dong.append("")
            dong.append(
                "| Kịch bản | Buổi (phút) | STT (VND) | TTS (VND) | "
                "Mô hình (VND) | Hạ tầng (VND) | Tổng/buổi (VND) | Tổng/tháng (VND) |"
            )
            dong.append("|---|---|---|---|---|---|---|---|")
        dong.append(
            f"| {r['kich_ban']} | {r['thoi_luong_phut']} "
            f"| {dinh_dang_vnd(r['stt_vnd'])} | {dinh_dang_vnd(r['tts_vnd'])} "
            f"| {dinh_dang_vnd(r['llm_vnd'])} | {dinh_dang_vnd(r['ha_tang_vnd'])} "
            f"| {dinh_dang_vnd(r['tong_buoi_vnd'])} | {dinh_dang_vnd(r['tong_thang_vnd'])} |"
        )
    dong.append("")

    dong.append("## Độ trễ ước tính mỗi lượt hội thoại")
    dong.append("")
    dong.append(
        f"- Nhận giọng (STT): {do_tre['stt_giay']} giây\n"
        f"- Mô hình trả lời: {do_tre['llm_giay']} giây\n"
        f"- Đọc thành tiếng (TTS): {do_tre['tts_giay']} giây\n"
        f"- **Tổng mỗi lượt: {do_tre['tong_giay_moi_luot']} giây**"
    )
    dong.append("")
    dong.append(
        "| Kịch bản | Buổi (phút) | Số lượt | Tổng thời gian chờ cả buổi (phút) |"
    )
    dong.append("|---|---|---|---|")
    da_in = set()
    for r in chi_phi:
        khoa = (r["kich_ban"], r["thoi_luong_phut"])
        if khoa in da_in:
            continue
        da_in.add(khoa)
        tong_cho_phut = r["luot_hoi_thoai"] * do_tre["tong_giay_moi_luot"] / 60
        dong.append(
            f"| {r['kich_ban']} | {r['thoi_luong_phut']} "
            f"| {r['luot_hoi_thoai']:.1f} | {tong_cho_phut:.1f} |".replace(".", ",")
        )
    dong.append("")

    dong.append("## Ghi chú")
    dong.append("")
    dong.append(
        "- Chi phí mô hình ngôn ngữ và hạ tầng đang = 0 vì T-01 chưa chọn mô hình "
        "và chưa có kiến trúc hạ tầng. Điền giá vào `config.toml` khi có."
    )
    dong.append(
        "- Token vào mô hình tăng dần theo lượt vì mỗi lượt gửi lại lịch sử "
        "(`token_lich_su_moi_luot` trong `config.toml`)."
    )
    dong.append(
        "- Số liệu độ trễ là GIẢ ĐỊNH TẠM trong `config.toml`, chờ số đo thật ở T-06."
    )
    dong.append(
        "- Buổi 15/30 phút được co giãn tuyến tính từ số liệu buổi chuẩn 25 phút."
    )
    dong.append("")
    return "\n".join(dong)


def ve_csv(cfg: dict, chi_phi: list[dict], do_tre: dict) -> str:
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(
        [
            "phuong_an", "kich_ban", "thoi_luong_phut",
            "stt_vnd", "tts_vnd", "llm_vnd", "ha_tang_vnd",
            "tong_buoi_vnd", "tong_thang_vnd",
            "tre_giay_moi_luot", "hang_muc_chua_co_gia",
        ]
    )
    thieu = "; ".join(hang_muc_chua_co_gia(cfg))
    for r in chi_phi:
        w.writerow(
            [
                r["phuong_an"], r["kich_ban"], r["thoi_luong_phut"],
                r["stt_vnd"], r["tts_vnd"], r["llm_vnd"], r["ha_tang_vnd"],
                r["tong_buoi_vnd"], r["tong_thang_vnd"],
                do_tre["tong_giay_moi_luot"], thieu,
            ]
        )
    return buf.getvalue()


def main() -> None:
    ap = argparse.ArgumentParser(
        description="T-05: ước tính chi phí và độ trễ một buổi học gia sư AI."
    )
    ap.add_argument(
        "--cau-hinh",
        default=str(Path(__file__).with_name("config.toml")),
        help="Đường dẫn file cấu hình TOML (mặc định: config.toml cùng thư mục).",
    )
    ap.add_argument(
        "--dinh-dang",
        choices=["md", "csv"],
        default="md",
        help="Định dạng bảng xuất ra: md (Markdown) hoặc csv.",
    )
    args = ap.parse_args()

    cfg = tai_cau_hinh(Path(args.cau_hinh))
    chi_phi = tinh_chi_phi(cfg)
    do_tre = tinh_do_tre(cfg)

    if args.dinh_dang == "csv":
        print(ve_csv(cfg, chi_phi, do_tre), end="")
    else:
        print(ve_markdown(cfg, chi_phi, do_tre))


if __name__ == "__main__":
    main()
