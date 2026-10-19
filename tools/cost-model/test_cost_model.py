#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T-05 · Test cho công cụ ước tính chi phí và độ trễ.

Chạy bằng một lệnh (đứng trong thư mục tools/cost-model):
    python3 test_cost_model.py

Chỉ dùng thư viện chuẩn Python, không gọi mạng.
"""

import copy
import tempfile
import tomllib
import unittest
from pathlib import Path

import cost_model

THU_MUC = Path(__file__).parent
CONFIG_MAC_DINH = THU_MUC / "config.toml"


def tai_config() -> dict:
    with open(CONFIG_MAC_DINH, "rb") as f:
        return tomllib.load(f)


class TestChiPhi(unittest.TestCase):
    def setUp(self):
        self.cfg = tai_config()
        self.cp = cost_model.tinh_chi_phi(self.cfg)
        self.dt = cost_model.tinh_do_tre(self.cfg)

    def lay_dong(self, phuong_an: str, kich_ban: str, phut: int) -> dict:
        for r in self.cp:
            if (
                r["phuong_an"] == phuong_an
                and r["kich_ban"] == kich_ban
                and r["thoi_luong_phut"] == phut
            ):
                return r
        self.fail(f"Không tìm thấy dòng: {phuong_an} / {kich_ban} / {phut}'")

    def test_google_stt_fpt_tts_trung_binh_25_phut(self):
        """Đối chiếu tính tay với bảng T-01 mục 3: 10 x 0,016 USD + 6.000 x 0,25 VND.

        Tính tay: 10 x 0,016 x 26.000 = 4.160 VND (STT)
                  + 6.000 x 0,25 = 1.500 VND (TTS)
                  = 5.660 VND  (T-01 làm tròn ghi ~5.700 VND)
        """
        r = self.lay_dong("Google STT + FPT TTS", "Trẻ nói trung bình", 25)
        self.assertEqual(r["stt_vnd"], 4160)
        self.assertEqual(r["tts_vnd"], 1500)
        self.assertEqual(r["tong_buoi_vnd"], 5660)

    def test_fpt_stt_fpt_tts_trung_binh_25_phut(self):
        """Đối chiếu tính tay với bảng T-01 mục 3: 10 x 620 VND + 6.000 x 0,25 VND.

        Tính tay: 10 x 620 = 6.200 VND (STT) + 1.500 VND (TTS) = 7.700 VND.
        """
        r = self.lay_dong("FPT STT + FPT TTS", "Trẻ nói trung bình", 25)
        self.assertEqual(r["stt_vnd"], 6200)
        self.assertEqual(r["tts_vnd"], 1500)
        self.assertEqual(r["tong_buoi_vnd"], 7700)

    def test_co_gian_tuyen_tinh_theo_thoi_luong(self):
        """Buổi 15' = 0,6 x buổi 25' (trừ hạ tầng tính theo buổi, không co giãn)."""
        for pa in ("Google STT + FPT TTS", "FPT STT + FPT TTS"):
            for kb in ("Trẻ nói ít", "Trẻ nói trung bình", "Trẻ nói nhiều"):
                r25 = self.lay_dong(pa, kb, 25)
                r15 = self.lay_dong(pa, kb, 15)
                self.assertAlmostEqual(r15["stt_vnd"], r25["stt_vnd"] * 0.6, delta=1)
                self.assertAlmostEqual(r15["tts_vnd"], r25["tts_vnd"] * 0.6, delta=1)
                self.assertEqual(r15["ha_tang_vnd"], r25["ha_tang_vnd"])

    def test_tong_thang_theo_buoi_moi_tuan(self):
        """3 buổi/tuần ~= 13 buổi/tháng (3 x 52 / 12)."""
        r = self.lay_dong("Google STT + FPT TTS", "Trẻ nói trung bình", 25)
        self.assertEqual(r["tong_thang_vnd"], round(5660 * 3 * 52 / 12))

    def test_du_3_kich_ban_va_3_thoi_luong(self):
        """Ít nhất 3 kịch bản (ít / trung bình / nhiều) x 3 thời lượng (15/25/30')."""
        for pa in ("Google STT + FPT TTS", "FPT STT + FPT TTS"):
            dem = sum(1 for r in self.cp if r["phuong_an"] == pa)
            self.assertEqual(dem, 9)  # 3 kịch bản x 3 thời lượng

    def test_do_tre_moi_luot(self):
        """Độ trễ mỗi lượt = nhận giọng + mô hình + đọc, lấy từ số liệu nhập."""
        self.assertEqual(
            self.dt["tong_giay_moi_luot"],
            self.dt["stt_giay"] + self.dt["llm_giay"] + self.dt["tts_giay"],
        )
        self.assertEqual(self.dt["tong_giay_moi_luot"], 6.0)

    def test_gia_lay_tu_config_khong_cung_trong_code(self):
        """Đổi tỷ giá trong config thì kết quả phải đổi theo."""
        cfg2 = copy.deepcopy(self.cfg)
        cfg2["tham_so"]["ty_gia_usd_vnd"] = 30000
        with tempfile.NamedTemporaryFile(
            "wb", suffix=".toml", delete=False
        ) as tmp:
            # ghi lại config đã sửa (tomllib chỉ đọc; dùng repr đơn giản qua tomli-w không có
            # sẵn nên ta sửa trực tiếp text của file gốc cho test này)
            goc = CONFIG_MAC_DINH.read_text(encoding="utf-8")
            tmp.write(goc.replace("ty_gia_usd_vnd = 26000", "ty_gia_usd_vnd = 30000").encode("utf-8"))
            tmp_path = tmp.name
        try:
            cfg_sua = cost_model.tai_cau_hinh(Path(tmp_path))
            cp_sua = cost_model.tinh_chi_phi(cfg_sua)
            stt_cu = self.lay_dong("Google STT + FPT TTS", "Trẻ nói trung bình", 25)["stt_vnd"]
            stt_moi = next(
                r for r in cp_sua
                if r["phuong_an"] == "Google STT + FPT TTS"
                and r["kich_ban"] == "Trẻ nói trung bình"
                and r["thoi_luong_phut"] == 25
            )["stt_vnd"]
            # 10 x 0,016 x 30.000 = 4.800, khác với 4.160 khi tỷ giá 26.000
            self.assertEqual(stt_moi, 4800)
            self.assertNotEqual(stt_cu, stt_moi)
        finally:
            Path(tmp_path).unlink()

    def test_khong_goi_api_that(self):
        """Mã nguồn không được import bất cứ thứ gì liên quan tới mạng/API."""
        ma_nguon = (THU_MUC / "cost_model.py").read_text(encoding="utf-8").lower()
        cam = [
            "urllib", "requests", "httpx", "aiohttp", "http.client",
            "socket", "ssl", "openai", "anthropic", "google.cloud",
            "boto3", "grpc",
        ]
        for tu in cam:
            self.assertNotIn(tu, ma_nguon, f"Phát hiện dùng '{tu}' trong code")

    def test_xuat_csv_chay_duoc(self):
        out = cost_model.ve_csv(self.cfg, self.cp, self.dt)
        dong_dau = out.splitlines()[0]
        self.assertIn("tong_buoi_vnd", dong_dau)
        self.assertIn("tre_giay_moi_luot", dong_dau)
        # 2 phương án x 3 kịch bản x 3 thời lượng = 18 dòng dữ liệu
        self.assertEqual(len(out.strip().splitlines()), 1 + 18)

        self.assertIn("hang_muc_chua_co_gia", dong_dau)
        self.assertIn("mô hình ngôn ngữ; hạ tầng", out.splitlines()[1])

    def test_token_vao_tang_theo_lich_su(self):
        """Tính tay: 16 lượt x 400 + 200 x 16 x 15 / 2 = 6.400 + 24.000 = 30.400 token."""
        self.assertEqual(cost_model.tong_token_vao(16, 400, 200), 30400)
        self.assertEqual(cost_model.tong_token_vao(16, 400, 0), 6400)
        r = self.lay_dong("Google STT + FPT TTS", "Trẻ nói trung bình", 25)
        self.assertEqual(r["token_vao_ca_buoi"], 30400)

    def test_gia_mo_hinh_tinh_theo_token_co_lich_su(self):
        """Giá 1 USD / 1 triệu token vào, 0 ra: 30.400 token x 26.000 / 1.000.000 = 790,4 -> 790 VND."""
        cfg2 = copy.deepcopy(self.cfg)
        cfg2["gia"]["llm"]["gia_1m_token_vao"] = 1.0
        r = next(
            r for r in cost_model.tinh_chi_phi(cfg2)
            if r["phuong_an"] == "Google STT + FPT TTS"
            and r["kich_ban"] == "Trẻ nói trung bình" and r["thoi_luong_phut"] == 25
        )
        self.assertEqual(r["llm_vnd"], 790)

    def test_canh_bao_khi_gia_bang_0(self):
        md = cost_model.ve_markdown(self.cfg, self.cp, self.dt)
        self.assertIn("CHƯA ĐẦY ĐỦ", md.splitlines()[2])
        cfg2 = copy.deepcopy(self.cfg)
        cfg2["gia"]["llm"]["gia_1m_token_vao"] = 1.0
        cfg2["gia"]["khac"]["ha_tang_vnd_moi_buoi"] = 100
        self.assertNotIn("CHƯA ĐẦY ĐỦ", cost_model.ve_markdown(cfg2, self.cp, self.dt))

    def test_thieu_khoa_bao_loi_de_hieu(self):
        cfg2 = copy.deepcopy(self.cfg)
        del cfg2["kich_ban"]["it"]["luot_hoi_thoai"]
        with self.assertRaises(SystemExit) as loi:
            cost_model.kiem_tra_khoa(cfg2)
        self.assertIn("kich_ban.it", str(loi.exception.code))
        self.assertIn("luot_hoi_thoai", str(loi.exception.code))

    def test_lam_tron_sau_khi_nhan_ra_thang(self):
        """Hạ tầng 0,4 VND/buổi: tổng tháng tính trên số chưa làm tròn."""
        cfg2 = copy.deepcopy(self.cfg)
        cfg2["gia"]["khac"]["ha_tang_vnd_moi_buoi"] = 0.4
        r = next(
            r for r in cost_model.tinh_chi_phi(cfg2)
            if r["phuong_an"] == "Google STT + FPT TTS"
            and r["kich_ban"] == "Trẻ nói trung bình" and r["thoi_luong_phut"] == 25
        )
        self.assertEqual(r["tong_buoi_vnd"], 5660)
        self.assertEqual(r["tong_thang_vnd"], round(5660.4 * 13))


if __name__ == "__main__":
    unittest.main(verbosity=2)
