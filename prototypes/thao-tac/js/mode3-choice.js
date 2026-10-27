/**
 * Mode 3: Chọn 1 trong 4 đáp án (Trắc nghiệm)
 * Phép tính: 27 + 15 = ?
 * Nút lớn >= 48px, chữ to, dễ đọc trên tablet và máy tính
 */

class Mode3Choice {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.logger = window.mathLogger;

    this.options = [
      { id: 'A', value: 32, label: '32', isCorrect: false, hint: '💡 Con đã tính đúng hàng đơn vị rồi. Ở hàng chục, con hãy kiểm tra xem mình đã cộng thêm số nhớ chưa nhé!' },
      { id: 'B', value: 42, label: '42', isCorrect: true, hint: '🎉 <strong>Chính xác!</strong> Con đã thực hiện phép cộng có nhớ rất tốt!' },
      { id: 'C', value: 41, label: '41', isCorrect: false, hint: '🔍 Con hãy kiểm tra lại phép tính ở hàng đơn vị (7 + 5) nhé!' },
      { id: 'D', value: 52, label: '52', isCorrect: false, hint: '🔍 Hàng đơn vị đúng rồi! Ở hàng chục, con kiểm tra xem mình có cộng số nhớ nhiều hơn một lần không nhé!' }
    ];

    this.correctValue = this.options.find(o => o.isCorrect).value;

    this.state = {
      selectedOptionId: null,
      attemptNo: 0,       // Số lần bấm Kiểm tra
      hadFeedback: false, // Đã chọn sai và nhận gợi ý: đúng sau đó là có hỗ trợ
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
    const selected = this.options.find(o => o.id === this.state.selectedOptionId);

    this.container.innerHTML = `
      <div class="mode3-wrapper">
        <div class="problem-header">
          <div class="problem-title">
            <span class="badge-math">Cách 3</span>
            <h2 class="problem-equation">Chọn đáp án đúng</h2>
          </div>
          <div class="problem-desc">
            Đọc kĩ đề bài bên dưới, chạm hoặc nhấp chuột vào một đáp án con cho là đúng nhất.
          </div>
        </div>

        <div class="mode3-content">
          <!-- Hộp câu hỏi lớn -->
          <div class="question-banner-card">
            <div class="question-label">Tính:</div>
            <div class="question-large-eq">27 + 15 = ?</div>
          </div>

          <!-- Lưới 4 đáp án -->
          <div class="options-grid" role="radiogroup" aria-label="Danh sách 4 đáp án lựa chọn">
            ${this.options.map(opt => `
              <button type="button" 
                      class="option-card ${this.state.selectedOptionId === opt.id ? 'option-selected' : ''}" 
                      data-option-id="${opt.id}"
                      role="radio"
                      aria-checked="${this.state.selectedOptionId === opt.id ? 'true' : 'false'}"
                      tabindex="0">
                <span class="opt-badge">${opt.id}</span>
                <span class="opt-value">${opt.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Các nút thao tác -->
          <div class="choice-actions">
            <button type="button" class="btn-action btn-primary btn-lg" id="btn-mode3-check" ${this.state.selectedOptionId ? '' : 'disabled'}>
              Kiểm tra đáp án
            </button>
            <button type="button" class="btn-action btn-secondary" id="btn-mode3-reset">
              Chọn lại từ đầu
            </button>
          </div>

          <!-- Thông báo phản hồi sau khi kiểm tra -->
          <div id="mode3-feedback" aria-live="polite" aria-atomic="true" class="feedback-banner ${this.state.feedbackType ? 'feedback-' + this.state.feedbackType : ''}">
            ${this.state.feedbackMessage || 'Hãy chọn một trong 4 đáp án ở trên rồi bấm "Kiểm tra đáp án".'}
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  selectOption(optId) {
    if (this.state.selectedOptionId === optId) return;

    const opt = this.options.find(o => o.id === optId);
    this.state.selectedOptionId = optId;
    this.state.feedbackMessage = '';
    this.state.feedbackType = '';

    this.logger.log('trac-nghiem', 'CHON_DAP_AN', {
      optionId: optId,
      value: opt.value
    });

    this.render();
  }

  checkAnswer() {
    if (!this.state.selectedOptionId) return;

    const opt = this.options.find(o => o.id === this.state.selectedOptionId);
    this.state.attemptNo += 1;
    const attempt = {
      chosenId: opt.id,
      chosenValue: opt.value,
      correctValue: this.correctValue,
      attemptNo: this.state.attemptNo,
      // Chọn đúng sau khi đã sai và đọc gợi ý thì không tính là tự làm
      afterFeedback: this.state.hadFeedback
    };

    if (opt.isCorrect) {
      this.state.feedbackType = 'success';
      this.state.feedbackMessage = opt.hint;
      this.logger.log('trac-nghiem', 'KIEM_TRA_DAP_AN_DUNG', attempt);
    } else {
      this.state.feedbackType = 'warning';
      this.state.feedbackMessage = opt.hint;
      this.logger.log('trac-nghiem', 'KIEM_TRA_DAP_AN_SAI', {
        ...attempt,
        misconception: opt.value === 32 ? 'quên_nhớ_hàng_chục' : opt.value === 52 ? 'cộng_nhớ_thừa' : 'tính_nhầm'
      });
      this.state.hadFeedback = true;
    }

    this.render();
  }

  reset() {
    this.state = {
      selectedOptionId: null,
      // Làm lại cùng một câu vẫn giữ số lần thử và dấu đã nhận gợi ý
      attemptNo: this.state.attemptNo,
      hadFeedback: this.state.hadFeedback,
      feedbackMessage: '',
      feedbackType: ''
    };

    this.logger.log('trac-nghiem', 'LAM_LAI', { message: 'Đã hủy lựa chọn để làm lại trắc nghiệm' });
    this.render();
  }

  attachEvents() {
    const optButtons = this.container.querySelectorAll('.option-card');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.optionId;
        this.selectOption(id);
      });
    });

    const btnCheck = this.container.querySelector('#btn-mode3-check');
    if (btnCheck) {
      btnCheck.addEventListener('click', () => this.checkAnswer());
    }

    const btnReset = this.container.querySelector('#btn-mode3-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.reset());
    }
  }
}

window.Mode3Choice = Mode3Choice;
