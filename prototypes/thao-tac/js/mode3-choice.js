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
      { id: 'A', value: 32, label: '32', isCorrect: false, hint: '💡 Con đã tính đúng hàng đơn vị rồi, nhưng quên cộng 1 nhớ vào hàng chục (2 + 1 = 3, thêm 1 nhớ phải bằng 4 nhé).' },
      { id: 'B', value: 42, label: '42', isCorrect: true, hint: '🎉 <strong>Chính xác tuyệt đối!</strong> 27 + 15 = 42. Con đã nhớ 1 sang hàng chục rất chuẩn!' },
      { id: 'C', value: 41, label: '41', isCorrect: false, hint: '🔍 Hàng đơn vị chưa đúng: 7 + 5 = 12 chứ không phải 11 đâu con nhé!' },
      { id: 'D', value: 52, label: '52', isCorrect: false, hint: '🔍 Hàng chục chưa đúng: 2 + 1 = 3, thêm 1 nhớ bằng 4 thôi, không phải bằng 5 nhé!' }
    ];

    this.state = {
      selectedOptionId: null,
      isChecked: false,
      feedbackMessage: '',
      feedbackType: ''
    };

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const selected = this.options.find(o => o.id === this.state.selectedOptionId);

    this.container.innerHTML = `
      <div class="mode3-wrapper">
        <div class="problem-header">
          <div class="problem-title">
            <span class="badge-math">Cách 3</span>
            <span class="problem-equation">Chọn đáp án đúng</span>
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
              ✅ Kiểm tra đáp án
            </button>
            <button type="button" class="btn-action btn-secondary" id="btn-mode3-reset">
              🔄 Chọn lại từ đầu
            </button>
          </div>

          <!-- Thông báo phản hồi sau khi kiểm tra -->
          <div id="mode3-feedback" class="feedback-banner ${this.state.feedbackType ? 'feedback-' + this.state.feedbackType : ''}">
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
    this.state.isChecked = false;
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
    this.state.isChecked = true;

    if (opt.isCorrect) {
      this.state.feedbackType = 'success';
      this.state.feedbackMessage = opt.hint;
      this.logger.log('trac-nghiem', 'KIEM_TRA_DAP_AN_DUNG', {
        chosenId: opt.id,
        chosenValue: opt.value,
        correctValue: 42
      });
    } else {
      this.state.feedbackType = 'warning';
      this.state.feedbackMessage = opt.hint;
      this.logger.log('trac-nghiem', 'KIEM_TRA_DAP_AN_SAI', {
        chosenId: opt.id,
        chosenValue: opt.value,
        correctValue: 42,
        misconception: opt.value === 32 ? 'quên_nhớ_hàng_chục' : 'tính_nhầm'
      });
    }

    this.render();
  }

  reset() {
    this.state = {
      selectedOptionId: null,
      isChecked: false,
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
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.selectOption(btn.dataset.optionId);
        }
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
