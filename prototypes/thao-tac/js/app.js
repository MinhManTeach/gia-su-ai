/**
 * Main Application Orchestrator
 * Điều khiển chuyển đổi 3 chế độ thao tác và hiển thị bảng Debug Event Log
 */

document.addEventListener('DOMContentLoaded', () => {
  const logger = window.mathLogger;

  // Khởi tạo các mode
  const mode1 = new window.Mode1DragDrop('tab-content-mode1');
  const mode2 = new window.Mode2Column('tab-content-mode2');
  const mode3 = new window.Mode3Choice('tab-content-mode3');

  // Quản lý chuyển Tab
  const tabs = document.querySelectorAll('.nav-tab-btn');
  const contents = document.querySelectorAll('.tab-panel');

  function switchTab(targetModeId) {
    tabs.forEach(tab => {
      const isTarget = tab.dataset.target === targetModeId;
      tab.classList.toggle('tab-active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    contents.forEach(content => {
      const isTarget = content.id === `tab-content-${targetModeId}`;
      content.classList.toggle('panel-active', isTarget);
    });

    logger.log('chung', 'CHUYEN_CHE_DO', {
      selectedMode: targetModeId,
      tabTitle: document.querySelector(`.nav-tab-btn[data-target="${targetModeId}"]`)?.innerText.trim()
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      switchTab(target);
    });
  });

  // Quản lý Khung Debug Log
  const debugTableBody = document.getElementById('debug-log-tbody');
  const debugCounter = document.getElementById('debug-counter');
  const btnToggleDebug = document.getElementById('btn-toggle-debug');
  const debugBody = document.getElementById('debug-body-wrapper');
  const btnClearLog = document.getElementById('btn-clear-log');
  const btnExportJson = document.getElementById('btn-export-json');

  let isDebugCollapsed = false;

  function renderEventRow(event) {
    const tr = document.createElement('tr');
    tr.className = `log-row log-mode-${event.mode}`;

    const badgeModeClass = {
      'keo-tha': 'badge-mode-1',
      'dat-tinh': 'badge-mode-2',
      'trac-nghiem': 'badge-mode-3',
      'chung': 'badge-mode-common'
    }[event.mode] || 'badge-mode-common';

    const detailFormatted = JSON.stringify(event.detail, null, 1)
      .replace(/[{}"]/g, '')
      .replace(/\n\s*/g, ' | ')
      .trim();

    tr.innerHTML = `
      <td class="col-time">${event.timestamp}</td>
      <td class="col-mode"><span class="badge ${badgeModeClass}">${event.mode}</span></td>
      <td class="col-type"><span class="event-type-name">${event.type}</span></td>
      <td class="col-detail"><code class="detail-code">${detailFormatted || '-'}</code></td>
    `;
    return tr;
  }

  function updateDebugView(newEvent, allEvents) {
    if (debugCounter) {
      debugCounter.textContent = `${allEvents.length} sự kiện`;
    }

    if (!debugTableBody) return;

    // Render lại danh sách
    debugTableBody.innerHTML = '';
    const recent = allEvents.slice(0, 50); // Hiện 50 sự kiện gần nhất
    for (const evt of recent) {
      debugTableBody.appendChild(renderEventRow(evt));
    }
  }

  logger.subscribe((newEvent, allEvents) => {
    updateDebugView(newEvent, allEvents);
  });

  if (btnToggleDebug && debugBody) {
    btnToggleDebug.addEventListener('click', () => {
      isDebugCollapsed = !isDebugCollapsed;
      debugBody.classList.toggle('collapsed', isDebugCollapsed);
      btnToggleDebug.textContent = isDebugCollapsed ? '🔼 Mở rộng log' : '🔽 Thu gọn log';
    });
  }

  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      logger.clear();
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(logger.exportJSON());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `math_debug_events_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      logger.log('chung', 'XUAT_FILE_JSON', { count: logger.getAll().length });
    });
  }

  // Đọc tham số URL để chuyển tab hoặc demo nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const hashMode = window.location.hash ? window.location.hash.replace('#', '') : null;
  const initialMode = urlParams.get('mode') || hashMode || 'mode1';

  if (['mode1', 'mode2', 'mode3'].includes(initialMode)) {
    switchTab(initialMode);
  }

  // Tự động kích hoạt trạng thái demo phục vụ kiểm thử và chụp ảnh màn hình nếu có ?demo=1
  if (urlParams.get('demo') === '1') {
    setTimeout(() => {
      if (initialMode === 'mode1') {
        mode1.moveAllSource('num27');
        mode1.moveAllSource('num15');
        setTimeout(() => {
          mode1.groupTenUnits();
        }, 150);
      } else if (initialMode === 'mode2') {
        mode2.state.units = '2';
        mode2.state.remember = '1';
        mode2.state.tens = '4';
        mode2.checkAnswer();
      } else if (initialMode === 'mode3') {
        mode3.selectOption('B');
        mode3.checkAnswer();
      }
    }, 100);
  }

  // Ghi log sự kiện khởi tạo
  logger.log('chung', 'KHOI_DONG_UNG_DUNG', {
    screenResolution: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
    initialMode: initialMode
  });
});
