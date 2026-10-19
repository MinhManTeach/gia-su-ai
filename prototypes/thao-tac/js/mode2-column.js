/**
 * Mode 2: Đặt tính theo cột có ô "nhớ"
 * Phép tính: 27 + 15 = 42
 * Hỗ trợ chuột máy tính, cảm ứng tablet và bàn phím số ảo on-screen
 */

class Mode2Column {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.logger = window.mathLogger;
    
    this.state = {
      remember: '', // Ô nhớ (hàng chục)
      tens: '',     // Ô kết quả hàng chục
      units: '',    // Ô kết quả hàng đơn vị
      activeField: 'units', // Mặc định focus vào ô đơn vị (theo thứ tự tính toán tiểu học)
      attemptNo: 0,         // Số lần bấm Kiểm tra với bài đã điền đủ
      hadFeedback: false,   // Đã nhận phản hồi sai trước đó (đúng sau đó là có hỗ trợ)
      feedbackMessage: '',
      feedbackType: ''
    };

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    window.renderKeepingFocus(this.container, () => this.renderNow());
  }

  renderNow() {
    this.container.innerHTML = `
      <div class="mode2-wrapper">
        <div class="problem-header">
          <div class="problem-title">
            <span class="badge-math">Cách 2</span>
            <span class="problem-equation">Đặt tính rồi tính: 27 + 15</span>
          </div>
          <div class="problem-desc">
            Thực hiện phép tính từ phải sang trái (tính hàng <strong>đơn vị</strong> trước, rồi đến hàng <strong>chục</strong>).
            Đừng quên điền số vào ô <strong>nhớ</strong> nhé!
          </div>
        </div>

        <div class="mode2-body">
          <!-- Khu vực phép tính dạng cột dọc -->
          <div class="column-math-card">
            <div class="column-math-grid">
              
              <!-- Hàng tiêu đề cột mờ -->
              <div class="grid-cell col-label">Hàng chục</div>
              <div class="grid-cell col-label">Hàng đơn vị</div>

              <!-- Hàng ô nhớ phía trên -->
              <div class="grid-cell">
                <div class="remember-box-wrap">
                  <span class="remember-tag">nhớ</span>
                  <div class="math-input-box remember-box ${this.state.activeField === 'remember' ? 'active-focus' : ''}" 
                       data-field="remember" tabindex="0" role="textbox" aria-label="Ô nhớ hàng chục">
                    ${this.state.remember !== '' ? this.state.remember : '<span class="placeholder-dot">?</span>'}
                  </div>
                </div>
              </div>
              <div class="grid-cell"></div> <!-- Ô trống trên hàng đơn vị -->

              <!-- Hàng số thứ nhất: 27 -->
              <div class="grid-cell digit-cell"><span class="digit-text">2</span></div>
              <div class="grid-cell digit-cell"><span class="digit-text">7</span></div>

              <!-- Hàng số thứ hai: 15 kèm dấu + -->
              <div class="grid-cell digit-cell has-plus">
                <span class="math-operator">+</span>
                <span class="digit-text">1</span>
              </div>
              <div class="grid-cell digit-cell"><span class="digit-text">5</span></div>

              <!-- Dòng kẻ ngang phân cách -->
              <div class="grid-divider"></div>

              <!-- Hàng kết quả (input) -->
              <div class="grid-cell">
                <div class="math-input-box result-box ${this.state.activeField === 'tens' ? 'active-focus' : ''}" 
                     data-field="tens" tabindex="0" role="textbox" aria-label="Ô kết quả hàng chục">
                  ${this.state.tens !== '' ? this.state.tens : '<span class="placeholder-dash">?</span>'}
                </div>
              </div>
              <div class="grid-cell">
                <div class="math-input-box result-box ${this.state.activeField === 'units' ? 'active-focus' : ''}" 
                     data-field="units" tabindex="0" role="textbox" aria-label="Ô kết quả hàng đơn vị">
                  ${this.state.units !== '' ? this.state.units : '<span class="placeholder-dash">?</span>'}
                </div>
              </div>

            </div>

            <!-- Gợi ý các bước tính gợi mở, không lộ đáp án -->
            <div class="math-steps-guide">
              <div class="step-guide-item ${this.state.activeField === 'units' ? 'guide-active' : ''}">
                <span class="step-badge">Bước 1</span>
                <span>Cộng hàng đơn vị trước. Được bao nhiêu? Có phải nhớ không?</span>
              </div>
              <div class="step-guide-item ${this.state.activeField === 'tens' || this.state.activeField === 'remember' ? 'guide-active' : ''}">
                <span class="step-badge">Bước 2</span>
                <span>Cộng hàng chục, nhớ thêm số đã nhớ (nếu có) nhé.</span>
              </div>
            </div>
          </div>

          <!-- Bàn phím số cảm ứng dành cho trẻ dùng tablet / chuột -->
          <div class="virtual-keypad-card">
            <div class="keypad-title">Bàn phím số cho trẻ</div>
            <div class="keypad-active-target">
              Đang nhập cho: <strong>${this.getActiveFieldName()}</strong>
            </div>
            <div class="keypad-grid">
              <button type="button" class="keypad-btn" data-key="1">1</button>
              <button type="button" class="keypad-btn" data-key="2">2</button>
              <button type="button" class="keypad-btn" data-key="3">3</button>
              <button type="button" class="keypad-btn" data-key="4">4</button>
              <button type="button" class="keypad-btn" data-key="5">5</button>
              <button type="button" class="keypad-btn" data-key="6">6</button>
              <button type="button" class="keypad-btn" data-key="7">7</button>
              <button type="button" class="keypad-btn" data-key="8">8</button>
              <button type="button" class="keypad-btn" data-key="9">9</button>
              <button type="button" class="keypad-btn keypad-func" data-key="clear" title="Xóa số trong ô này">⌫</button>
              <button type="button" class="keypad-btn" data-key="0">0</button>
            </div>
            
            <div class="keypad-controls">
              <button type="button" class="btn-action btn-primary btn-check-col" id="btn-mode2-check">
                ✅ Kiểm tra kết quả
              </button>
              <button type="button" class="btn-action btn-secondary" id="btn-mode2-reset">
                🔄 Làm lại
              </button>
            </div>
          </div>
        </div>

        <!-- Khung phản hồi sau khi bấm kiểm tra -->
        <div id="mode2-feedback" class="feedback-banner ${this.state.feedbackType ? 'feedback-' + this.state.feedbackType : ''}">
          ${this.state.feedbackMessage || 'Nhấn vào ô cần điền rồi bấm số trên bàn phím. Khi tính xong hãy bấm "Kiểm tra kết quả".'}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  getActiveFieldName() {
    switch (this.state.activeField) {
      case 'remember': return 'Ô nhớ (hàng chục)';
      case 'tens': return 'Kết quả hàng chục';
      case 'units': return 'Kết quả hàng đơn vị';
      default: return 'Chọn một ô bên trái';
    }
  }

  setActiveField(fieldName) {
    if (this.state.activeField === fieldName) return;
    this.state.activeField = fieldName;
    this.logger.log('dat-tinh', 'CHON_O_NHAP', {
      field: fieldName,
      fieldDescription: this.getActiveFieldName()
    });
    this.render();
  }

  inputDigit(digit) {
    if (!this.state.activeField) return;

    const prevValue = this.state[this.state.activeField];
    this.state[this.state.activeField] = digit;

    this.logger.log('dat-tinh', 'NHAP_CHU_SO', {
      field: this.state.activeField,
      prevValue: prevValue,
      newValue: digit
    });

    // Chuyển ô theo thứ tự cố định: Đơn vị -> Ô nhớ -> Chục.
    // Không phụ thuộc số vừa gõ, để không lộ đúng/sai khi trẻ đang làm dở.
    if (this.state.activeField === 'units') {
      this.state.activeField = 'remember';
    } else if (this.state.activeField === 'remember') {
      this.state.activeField = 'tens';
    }

    this.render();
  }

  handleBackspace() {
    if (!this.state.activeField) return;
    const prevValue = this.state[this.state.activeField];
    this.state[this.state.activeField] = '';

    this.logger.log('dat-tinh', 'XOA_CHU_SO', {
      field: this.state.activeField,
      prevValue: prevValue
    });

    this.render();
  }

  checkAnswer() {
    const u = this.state.units;
    const t = this.state.tens;
    const r = this.state.remember;

    // Chưa làm xong
    if (u === '' || t === '') {
      this.state.feedbackType = 'info';
      this.state.feedbackMessage = '💡 Con hãy điền đầy đủ cả hàng đơn vị và hàng chục rồi kiểm tra nhé!';
      this.logger.log('dat-tinh', 'KIEM_TRA_CHUA_XONG', { units: u, tens: t, remember: r });
      this.render();
      return;
    }

    this.state.attemptNo += 1;
    const attempt = {
      units: u,
      tens: t,
      remember: r,
      attemptNo: this.state.attemptNo,
      // Đúng sau khi đã nhận phản hồi sai thì là có hỗ trợ, không phải tự làm
      afterFeedback: this.state.hadFeedback
    };

    // Trường hợp 1: Đúng hoàn toàn cả phép tính và ô nhớ
    if (u === '2' && t === '4' && r === '1') {
      this.state.feedbackType = 'success';
      this.state.feedbackMessage = '🎉 <strong>Xuất sắc!</strong> Con đã đặt tính và cộng có nhớ rất chính xác: 27 + 15 = 42!';
      this.logger.log('dat-tinh', 'KIEM_TRA_DUNG_TOAN_DIEN', { ...attempt, resultCorrect: true, carryCorrect: true });
    }
    // Trường hợp 2: Kết quả đúng 42 nhưng ô nhớ trống hoặc ghi sai: chưa tính là làm đủ các bước
    else if (u === '2' && t === '4') {
      this.state.feedbackType = 'info';
      this.state.feedbackMessage = r === ''
        ? '👏 <strong>Kết quả 42 rất đúng!</strong> Con hãy điền thêm số nhớ vào ô nhớ ở trên để ghi lại bước làm nhé!'
        : '👏 <strong>Kết quả 42 rất đúng!</strong> Con xem lại số trong ô nhớ nhé: 7 + 5 được mấy chục?';
      this.logger.log('dat-tinh', 'KIEM_TRA_DUNG_THIEU_NHO', { ...attempt, resultCorrect: true, carryCorrect: false });
    }
    // Trường hợp 3: Lỗi điển hình quên nhớ (ra kết quả 32)
    else if (u === '2' && t === '3') {
      this.state.feedbackType = 'warning';
      this.state.feedbackMessage = '💡 Con đã tính đúng 7 + 5 = 12 (viết 2). Nhưng ở hàng chục: 2 + 1 = 3, con hãy nhớ <strong>cộng thêm 1</strong> được nhớ sang nhé!';
      this.logger.log('dat-tinh', 'KIEM_TRA_LOI_QUEN_NHO', { ...attempt, resultCorrect: false });
    }
    // Trường hợp 4: Sai hàng đơn vị
    else if (u !== '2') {
      this.state.feedbackType = 'warning';
      this.state.feedbackMessage = '🔍 Con hãy kiểm tra lại hàng đơn vị nhé: <strong>7 + 5 = ?</strong> (viết mấy và nhớ mấy nhỉ?)';
      this.logger.log('dat-tinh', 'KIEM_TRA_SAI_DON_VI', { ...attempt, resultCorrect: false });
    }
    // Trường hợp 5: Sai hàng chục
    else {
      this.state.feedbackType = 'warning';
      this.state.feedbackMessage = '🔍 Hàng đơn vị đúng rồi! Con hãy tính lại hàng chục: 2 + 1 thêm 1 nhớ bằng bao nhiêu nhé!';
      this.logger.log('dat-tinh', 'KIEM_TRA_SAI_CHUC', { ...attempt, resultCorrect: false });
    }

    if (this.state.feedbackType === 'warning') this.state.hadFeedback = true;
    this.render();
  }

  reset() {
    this.state = {
      remember: '',
      tens: '',
      units: '',
      activeField: 'units',
      // Làm lại cùng một bài vẫn giữ số lần thử và dấu đã nhận phản hồi
      attemptNo: this.state.attemptNo,
      hadFeedback: this.state.hadFeedback,
      feedbackMessage: '',
      feedbackType: ''
    };

    this.logger.log('dat-tinh', 'LAM_LAI', { message: 'Đã xóa toàn bộ phép đặt tính để làm lại' });
    this.render();
  }

  attachEvents() {
    // Focus vào các ô input box
    const boxes = this.container.querySelectorAll('.math-input-box');
    boxes.forEach(box => {
      box.addEventListener('click', (e) => {
        const field = box.dataset.field;
        this.setActiveField(field);
      });
      // Hỗ trợ Enter hoặc Space trên phím tiếp cận
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.setActiveField(box.dataset.field);
        }
      });
    });

    // Bàn phím số on-screen
    const keys = this.container.querySelectorAll('.keypad-btn');
    keys.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (key === 'clear') {
          this.handleBackspace();
        } else {
          this.inputDigit(key);
        }
      });
    });

    // Nút Kiểm tra
    const btnCheck = this.container.querySelector('#btn-mode2-check');
    if (btnCheck) {
      btnCheck.addEventListener('click', () => this.checkAnswer());
    }

    // Nút Làm lại
    const btnReset = this.container.querySelector('#btn-mode2-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.reset());
    }

    // Lắng nghe bàn phím vật lý trên máy tính (nếu người dùng gõ số 0-9)
    if (!this._keydownBound) {
      this._keydownHandler = (e) => {
        // Chỉ nhận khi mode 2 đang hiển thị
        if (this.container.offsetParent === null) return;
        // Phím đang đứng trên nút, ô nhập hoặc thẻ chuyển chế độ đã có xử lý riêng:
        // không để Enter vừa bấm nút vừa chấm bài.
        if (e.target instanceof Element && e.target.closest('button, a, input, textarea, select, [role="textbox"], [role="tab"]')) {
          if (e.key === 'Enter' || e.key === ' ') return;
          if (!e.target.closest('.mode2-wrapper')) return;
        }

        if (e.key >= '0' && e.key <= '9') {
          this.inputDigit(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          this.handleBackspace();
        } else if (e.key === 'Enter') {
          this.checkAnswer();
        }
      };
      window.addEventListener('keydown', this._keydownHandler);
      this._keydownBound = true;
    }
  }
}

window.Mode2Column = Mode2Column;
