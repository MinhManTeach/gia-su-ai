/**
 * Mode 1: Kéo thả que chục và khối đơn vị, gộp 10 đơn vị thành 1 chục
 * Phép tính: 27 + 15
 * Hỗ trợ chuột và cảm ứng trên tablet (Pointer Events)
 */

class Mode1DragDrop {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.logger = window.mathLogger;
    
    // Trạng thái bài toán 27 + 15
    this.state = {
      // Kho ban đầu số 27: 2 chục, 7 đơn vị
      // Kho ban đầu số 15: 1 chục, 5 đơn vị
      // Bảng gộp: tens (que chục) và units (khối đơn vị)
      tensInBoard: 0,
      unitsInBoard: 0,
      hasGrouped: false,
      items: [] // Danh sách các vật phẩm (que chục, khối đơn vị)
    };

    this.draggedItem = null;
    this.init();
  }

  init() {
    this.setupInitialItems();
    this.render();
  }

  setupInitialItems() {
    this.state.items = [];
    this.state.hasGrouped = false;

    // Số 27: 2 que chục
    this.state.items.push(
      { id: 'ten-27-1', type: 'ten', numValue: 10, source: 'num27', location: 'num27', label: '1 chục' },
      { id: 'ten-27-2', type: 'ten', numValue: 10, source: 'num27', location: 'num27', label: '1 chục' }
    );
    // Số 27: 7 khối đơn vị
    for (let i = 1; i <= 7; i++) {
      this.state.items.push(
        { id: `unit-27-${i}`, type: 'unit', numValue: 1, source: 'num27', location: 'num27', label: '1' }
      );
    }

    // Số 15: 1 que chục
    this.state.items.push(
      { id: 'ten-15-1', type: 'ten', numValue: 10, source: 'num15', location: 'num15', label: '1 chục' }
    );
    // Số 15: 5 khối đơn vị
    for (let i = 1; i <= 5; i++) {
      this.state.items.push(
        { id: `unit-15-${i}`, type: 'unit', numValue: 1, source: 'num15', location: 'num15', label: '1' }
      );
    }
  }

  render() {
    const unitsInBoardCount = this.state.items.filter(it => it.location === 'board-units').length;
    const tensInBoardCount = this.state.items.filter(it => it.location === 'board-tens').length;
    const canGroup = unitsInBoardCount >= 10 && !this.state.hasGrouped;

    this.container.innerHTML = `
      <div class="mode1-wrapper">
        <div class="problem-header">
          <div class="problem-title">
            <span class="badge-math">Cách 1</span>
            <span class="problem-equation">27 + 15 = ?</span>
          </div>
          <div class="problem-desc">
            Kéo thả hoặc chạm vào <strong>que chục</strong> và <strong>khối đơn vị</strong> để đưa vào Bảng Tính.
            Khi đủ 10 đơn vị, hãy bấm nút <strong>Gộp 10 đơn vị thành 1 chục</strong> nhé!
          </div>
        </div>

        <!-- Kho đồ vật ban đầu -->
        <div class="materials-area">
          <div class="source-group" data-source="num27">
            <div class="group-header">
              <span class="group-title">Số 27 (2 chục và 7 đơn vị)</span>
              <button type="button" class="btn-quick-move" data-action="move-all-num27">Đưa số 27 vào bảng</button>
            </div>
            <div class="items-holder" id="holder-num27">
              <!-- Render items of num27 -->
            </div>
          </div>

          <div class="source-plus">+</div>

          <div class="source-group" data-source="num15">
            <div class="group-header">
              <span class="group-title">Số 15 (1 chục và 5 đơn vị)</span>
              <button type="button" class="btn-quick-move" data-action="move-all-num15">Đưa số 15 vào bảng</button>
            </div>
            <div class="items-holder" id="holder-num15">
              <!-- Render items of num15 -->
            </div>
          </div>
        </div>

        <!-- Bảng tính gộp -->
        <div class="workspace-board">
          <div class="board-top-bar">
            <h3 class="board-title">Bảng Tính Gộp (Kết Quả)</h3>
            <div class="board-actions">
              <button type="button" class="btn-action btn-group-tens ${canGroup ? 'glow-pulse' : ''}" 
                      id="btn-group-tens" ${canGroup ? '' : 'disabled'}>
                ✨ Gộp 10 đơn vị thành 1 chục (${unitsInBoardCount}/10)
              </button>
              <button type="button" class="btn-action btn-secondary" id="btn-mode1-reset">
                🔄 Làm lại
              </button>
            </div>
          </div>

          <div class="board-columns">
            <!-- Cột Hàng Chục -->
            <div class="board-column dropzone" id="zone-board-tens" data-zone="board-tens">
              <div class="column-header">
                <span class="col-name">Hàng Chục</span>
                <span class="col-counter" id="count-tens">${tensInBoardCount} chục (${tensInBoardCount * 10})</span>
              </div>
              <div class="column-items" id="items-board-tens"></div>
            </div>

            <!-- Cột Hàng Đơn Vị -->
            <div class="board-column dropzone" id="zone-board-units" data-zone="board-units">
              <div class="column-header">
                <span class="col-name">Hàng Đơn Vị</span>
                <span class="col-counter" id="count-units">${unitsInBoardCount} đơn vị</span>
              </div>
              <div class="column-items" id="items-board-units"></div>
            </div>
          </div>

          <!-- Kết luận kết quả -->
          <div class="board-summary">
            <div class="summary-line">
              <span>Số chục hiện tại: <strong class="highlight-val">${tensInBoardCount}</strong> chục</span>
              <span>Số đơn vị hiện tại: <strong class="highlight-val">${unitsInBoardCount}</strong> đơn vị</span>
              <span>Tổng cộng: <strong class="highlight-total">${tensInBoardCount * 10 + unitsInBoardCount}</strong></span>
            </div>
            <div id="mode1-feedback" class="feedback-banner ${this.getFeedbackStatus(tensInBoardCount, unitsInBoardCount)}">
              ${this.getFeedbackMessage(tensInBoardCount, unitsInBoardCount)}
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderAllItems();
    this.attachEvents();
  }

  getFeedbackStatus(tens, units) {
    if (tens === 4 && units === 2) return 'feedback-success';
    if (units >= 10) return 'feedback-info';
    return '';
  }

  getFeedbackMessage(tens, units) {
    if (tens === 4 && units === 2) {
      return '🎉 <strong>Tuyệt vời!</strong> Con đã gộp thành 4 chục và 2 đơn vị. Kết quả là <strong>42</strong>!';
    }
    if (units >= 10 && !this.state.hasGrouped) {
      return '💡 <em>Hàng đơn vị đã có ' + units + ' khối (đủ 10 khối trở lên). Hãy nhấn nút <strong>"Gộp 10 đơn vị thành 1 chục"</strong> để nhớ sang hàng chục nhé!</em>';
    }
    if (this.state.hasGrouped && units < 10 && tens < 4) {
      return 'Tiếp tục đưa các que chục còn lại vào bảng tính nhé!';
    }
    return 'Hãy kéo hoặc chạm vào các que chục và khối đơn vị để đưa vào đúng cột trên Bảng Tính.';
  }

  renderAllItems() {
    const holder27 = this.container.querySelector('#holder-num27');
    const holder15 = this.container.querySelector('#holder-num15');
    const boardTens = this.container.querySelector('#items-board-tens');
    const boardUnits = this.container.querySelector('#items-board-units');

    if (!holder27 || !holder15 || !boardTens || !boardUnits) return;

    holder27.innerHTML = '';
    holder15.innerHTML = '';
    boardTens.innerHTML = '';
    boardUnits.innerHTML = '';

    for (const item of this.state.items) {
      const el = this.createItemElement(item);
      if (item.location === 'num27') {
        holder27.appendChild(el);
      } else if (item.location === 'num15') {
        holder15.appendChild(el);
      } else if (item.location === 'board-tens') {
        boardTens.appendChild(el);
      } else if (item.location === 'board-units') {
        boardUnits.appendChild(el);
      }
    }
  }

  createItemElement(item) {
    const el = document.createElement('div');
    el.id = item.id;
    el.className = `draggable-item item-${item.type} ${item.isNewGrouped ? 'item-grouped-pulse' : ''}`;
    el.dataset.id = item.id;
    el.dataset.type = item.type;
    el.dataset.location = item.location;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${item.type === 'ten' ? 'Que tính 1 chục' : 'Khối 1 đơn vị'}, mã ${item.id}`);

    if (item.type === 'ten') {
      // Que chục gồm 10 vạch phân chia rõ ràng
      let segments = '';
      for (let s = 0; s < 10; s++) {
        segments += '<span class="ten-segment"></span>';
      }
      el.innerHTML = `
        <div class="ten-rod">
          <span class="rod-label">1 chục</span>
          <div class="rod-segments">${segments}</div>
        </div>
      `;
    } else {
      // Khối đơn vị vuông
      el.innerHTML = `
        <div class="unit-block">
          <span class="unit-label">1</span>
        </div>
      `;
    }

    this.attachDragEvents(el, item);
    return el;
  }

  attachDragEvents(element, item) {
    // Pointer Events để hỗ trợ cả chuột PC và ngón tay cảm ứng trên iPad/tablet
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;
    let isDragging = false;

    const onPointerDown = (e) => {
      // Chỉ nhận click chuột trái hoặc chạm ngón tay
      if (e.button !== undefined && e.button !== 0) return;
      
      element.setPointerCapture(e.pointerId);
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      element.classList.add('is-touching');

      this.logger.log('keo-tha', 'CHAM_VAT_PHAM', {
        itemId: item.id,
        itemType: item.type,
        currentLocation: item.location
      });
    };

    const onPointerMove = (e) => {
      if (!element.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!isDragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        isDragging = true;
        element.classList.add('is-dragging');
        this.logger.log('keo-tha', 'BAT_DAU_KEO', {
          itemId: item.id,
          fromLocation: item.location
        });
      }

      if (isDragging) {
        element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        element.style.zIndex = '1000';

        // Highlight dropzone dưới con trỏ
        this.highlightDropzoneAt(e.clientX, e.clientY, item.type);
      }
    };

    const onPointerUp = (e) => {
      if (!element.hasPointerCapture(e.pointerId)) return;
      element.releasePointerCapture(e.pointerId);
      element.classList.remove('is-touching', 'is-dragging');
      element.style.transform = '';
      element.style.zIndex = '';
      this.clearDropzoneHighlights();

      if (isDragging) {
        // Thao tác kéo thả
        const targetZone = this.findDropzoneAt(e.clientX, e.clientY);
        if (targetZone) {
          this.handleDrop(item, targetZone);
        } else {
          this.logger.log('keo-tha', 'THA_NGOAI_VUNG', {
            itemId: item.id,
            returnedTo: item.location
          });
        }
      } else {
        // Thao tác chạm/click nhanh: tự động chuyển giữa kho và bảng tính
        this.handleClickMove(item);
      }
    };

    const onPointerCancel = (e) => {
      if (!element.hasPointerCapture(e.pointerId)) return;
      element.releasePointerCapture(e.pointerId);
      element.classList.remove('is-touching', 'is-dragging');
      element.style.transform = '';
      element.style.zIndex = '';
      this.clearDropzoneHighlights();
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerCancel);
  }

  findDropzoneAt(x, y) {
    const dropzones = this.container.querySelectorAll('.dropzone, .source-group');
    for (const zone of dropzones) {
      const rect = zone.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (zone.dataset.zone) return zone.dataset.zone;
        if (zone.dataset.source) return zone.dataset.source;
      }
    }
    return null;
  }

  highlightDropzoneAt(x, y, itemType) {
    this.clearDropzoneHighlights();
    const zoneName = this.findDropzoneAt(x, y);
    if (!zoneName) return;

    let targetEl = null;
    if (zoneName === 'board-tens' || zoneName === 'board-units') {
      targetEl = this.container.querySelector(`#zone-${zoneName}`);
    } else {
      targetEl = this.container.querySelector(`.source-group[data-source="${zoneName}"]`);
    }

    if (targetEl) {
      targetEl.classList.add('dropzone-hover');
    }
  }

  clearDropzoneHighlights() {
    const zones = this.container.querySelectorAll('.dropzone, .source-group');
    zones.forEach(z => z.classList.remove('dropzone-hover'));
  }

  handleDrop(item, targetZone) {
    // 1. Kiểm tra nếu thả nhầm cột (khối đơn vị vào cột chục, hoặc que chục vào cột đơn vị)
    // Theo quy định: trả vật phẩm về chỗ cũ, ghi nhận THA_NHAM_COT và không báo "sai" làm gián đoạn trẻ.
    if ((item.type === 'unit' && targetZone === 'board-tens') || (item.type === 'ten' && targetZone === 'board-units')) {
      this.logger.log('keo-tha', 'THA_NHAM_COT', {
        itemId: item.id,
        itemType: item.type,
        attemptedZone: targetZone,
        returnedTo: item.location,
        note: 'Trẻ kéo nhầm cột; đã trả về vị trí cũ để tự làm lại'
      });
      this.render();
      return;
    }

    // 2. Kiểm tra thả hợp lệ:
    // Que chục vào board-tens hoặc về kho source
    // Khối đơn vị vào board-units hoặc về kho source
    let valid = false;
    let finalLocation = item.location;

    if (item.type === 'ten' && (targetZone === 'board-tens' || targetZone === item.source)) {
      finalLocation = targetZone;
      valid = true;
    } else if (item.type === 'unit' && (targetZone === 'board-units' || targetZone === item.source)) {
      finalLocation = targetZone;
      valid = true;
    }

    if (valid) {
      const oldLoc = item.location;
      item.location = finalLocation;
      this.logger.log('keo-tha', 'THA_HOP_LE', {
        itemId: item.id,
        itemType: item.type,
        from: oldLoc,
        to: finalLocation
      });
      this.render();
    } else {
      this.logger.log('keo-tha', 'THA_KHONG_HOP_LE', {
        itemId: item.id,
        itemType: item.type,
        attemptedZone: targetZone,
        returnedTo: item.location
      });
      this.render();
    }
  }

  handleClickMove(item) {
    const oldLoc = item.location;
    let newLoc = oldLoc;

    if (oldLoc === 'num27' || oldLoc === 'num15') {
      // Đưa vào bảng tính tương ứng
      newLoc = item.type === 'ten' ? 'board-tens' : 'board-units';
    } else {
      // Đưa trả về kho ban đầu
      newLoc = item.source || 'num27';
    }

    item.location = newLoc;
    this.logger.log('keo-tha', 'CHAM_CHUYEN_VI_TRI', {
      itemId: item.id,
      itemType: item.type,
      from: oldLoc,
      to: newLoc
    });
    this.render();
  }

  groupTenUnits() {
    // Tìm các khối đơn vị đang ở board-units
    const unitsInBoard = this.state.items.filter(it => it.location === 'board-units');
    if (unitsInBoard.length < 10) return;

    // Lấy 10 khối đầu tiên để gộp
    const toRemove = unitsInBoard.slice(0, 10);
    const toRemoveIds = toRemove.map(it => it.id);

    // Xóa 10 khối này khỏi danh sách
    this.state.items = this.state.items.filter(it => !toRemoveIds.includes(it.id));

    // Tạo 1 que chục mới đưa thẳng vào cột board-tens
    const newTenId = `ten-grouped-${Date.now()}`;
    this.state.items.push({
      id: newTenId,
      type: 'ten',
      numValue: 10,
      source: 'board-tens',
      location: 'board-tens',
      label: '1 chục (mới gộp)',
      isNewGrouped: true
    });

    this.state.hasGrouped = true;

    this.logger.log('keo-tha', 'GOP_10_DON_VI_THANH_1_CHUC', {
      removedUnitsCount: 10,
      newTenId: newTenId,
      remainingUnits: this.state.items.filter(it => it.location === 'board-units').length,
      currentTens: this.state.items.filter(it => it.location === 'board-tens').length
    });

    this.render();
  }

  moveAllSource(sourceName) {
    let movedCount = 0;
    for (const item of this.state.items) {
      if (item.source === sourceName && item.location === sourceName) {
        item.location = item.type === 'ten' ? 'board-tens' : 'board-units';
        movedCount++;
      }
    }

    this.logger.log('keo-tha', 'CHUYEN_NHANH_CO_TRO_GIUP', {
      source: sourceName,
      movedItemsCount: movedCount,
      hasAssistance: true,
      note: 'Dùng nút trợ giúp chuyển nhanh cả số vào bảng (phân biệt với tự kéo)'
    });

    this.render();
  }

  reset() {
    this.setupInitialItems();
    this.logger.log('keo-tha', 'LAM_LAI', { message: 'Đã đưa toàn bộ que tính và khối đơn vị về vị trí ban đầu' });
    this.render();
  }

  attachEvents() {
    // Nút Gộp 10 đơn vị
    const btnGroup = this.container.querySelector('#btn-group-tens');
    if (btnGroup) {
      btnGroup.addEventListener('click', () => this.groupTenUnits());
    }

    // Nút Làm lại
    const btnReset = this.container.querySelector('#btn-mode1-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.reset());
    }

    // Nút chuyển nhanh cả nhóm
    const btnMove27 = this.container.querySelector('[data-action="move-all-num27"]');
    if (btnMove27) {
      btnMove27.addEventListener('click', () => this.moveAllSource('num27'));
    }

    const btnMove15 = this.container.querySelector('[data-action="move-all-num15"]');
    if (btnMove15) {
      btnMove15.addEventListener('click', () => this.moveAllSource('num15'));
    }
  }
}

window.Mode1DragDrop = Mode1DragDrop;
