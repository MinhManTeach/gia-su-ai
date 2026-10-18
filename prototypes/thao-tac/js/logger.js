/**
 * Event Logger for Child Math Interaction Prototype
 * Ghi lại mọi thao tác của trẻ thành sự kiện (loại thao tác, giá trị, thời điểm)
 * Hoàn toàn chạy in-memory, hiển thị tại khung debug, không gửi dữ liệu ra ngoài.
 */

class EventLogger {
  constructor() {
    this.events = [];
    this.subscribers = [];
  }

  /**
   * Log an event
   * @param {string} mode - 'keo-tha' | 'dat-tinh' | 'trac-nghiem' | 'chung'
   * @param {string} type - Loại sự kiện (e.g. 'CHON_CHE_DO', 'KEO_KHOI', 'GOP_CHUC', 'NHAP_SO', 'CHON_DAP_AN', 'KIEM_TRA', 'LAM_LAI')
   * @param {object|string} detail - Chi tiết sự kiện
   */
  log(mode, type, detail = {}) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    const eventObj = {
      id: this.events.length + 1,
      timestamp: timeStr,
      isoTime: now.toISOString(),
      mode: mode,
      type: type,
      detail: typeof detail === 'string' ? { message: detail } : detail
    };

    this.events.unshift(eventObj); // Đưa sự kiện mới nhất lên đầu
    
    // Giới hạn bộ nhớ 200 sự kiện gần nhất
    if (this.events.length > 200) {
      this.events.pop();
    }

    this.notifySubscribers(eventObj);
    return eventObj;
  }

  getAll() {
    return [...this.events];
  }

  clear() {
    this.events = [];
    this.log('chung', 'XOA_LOG', { message: 'Đã xóa toàn bộ nhật ký sự kiện' });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notifySubscribers(newEvent) {
    for (const callback of this.subscribers) {
      try {
        callback(newEvent, this.events);
      } catch (err) {
        console.error('Lỗi thông báo logger subscriber:', err);
      }
    }
  }

  exportJSON() {
    return JSON.stringify(this.events, null, 2);
  }
}

// Khởi tạo instance toàn cục
window.mathLogger = new EventLogger();
