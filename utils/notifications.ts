// Notification and Sound System

export class NotificationManager {
  private static audioContext: AudioContext | null = null;

  static init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Play notification sound
  static playSound(type: 'success' | 'info' | 'warning' | 'call') {
    this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different sounds for different events
    const soundConfig = {
      success: { freq: 800, duration: 0.15 },
      info: { freq: 600, duration: 0.1 },
      warning: { freq: 400, duration: 0.2 },
      call: { freq: 1000, duration: 0.3 },
    };

    const config = soundConfig[type];
    oscillator.frequency.value = config.freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + config.duration);
  }

  // Show browser notification
  static async showNotification(title: string, body: string, icon?: string) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body, icon });
      }
    }
  }

  // Toast notification (in-app)
  static showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const event = new CustomEvent('show-toast', { detail: { message, type } });
    window.dispatchEvent(event);
  }
}
