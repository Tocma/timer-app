export class Alarm {
    constructor() {
        this.updateIntervalId = null;
        this.state = {
            time: '',
            isSet: false,
            intervalId: null
        };
        this.elements = {
            currentTimeDisplay: document.getElementById('currentTime'),
            alarmTimeInput: document.getElementById('alarmTime'),
            statusDisplay: document.getElementById('alarmStatus')
        };
        this.initializeEventListeners();
        this.startTimeDisplay();
    }
    initializeEventListeners() {
        const setButton = document.getElementById('alarmSet');
        const cancelButton = document.getElementById('alarmCancel');
        if (setButton)
            setButton.addEventListener('click', () => this.setAlarm());
        if (cancelButton)
            cancelButton.addEventListener('click', () => this.cancelAlarm());
    }
    startTimeDisplay() {
        this.updateCurrentTime();
        this.updateIntervalId = window.setInterval(() => this.updateCurrentTime(), 1000);
    }
    updateCurrentTime() {
        const now = new Date();
        this.elements.currentTimeDisplay.textContent = now.toLocaleTimeString('ja-JP');
    }
    setAlarm() {
        const time = this.elements.alarmTimeInput.value;
        if (!time) {
            alert('アラーム時刻を設定してください');
            return;
        }
        this.state.time = time;
        this.state.isSet = true;
        this.elements.statusDisplay.textContent = `アラーム設定: ${time}`;
        this.elements.statusDisplay.style.color = '#27ae60';
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
        }
        this.state.intervalId = window.setInterval(() => this.checkAlarm(), 1000);
    }
    cancelAlarm() {
        this.state.isSet = false;
        this.elements.statusDisplay.textContent = 'アラームはセットされていません';
        this.elements.statusDisplay.style.color = '#e74c3c';
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }
    checkAlarm() {
        if (!this.state.isSet)
            return;
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentTime === this.state.time) {
            this.playAlarm();
            alert('アラーム時刻になりました！');
            this.cancelAlarm();
        }
    }
    playAlarm() {
        const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgMAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4');
        audio.play().catch(error => console.error('アラーム音声再生エラー:', error));
    }
    destroy() {
        if (this.updateIntervalId !== null) {
            clearInterval(this.updateIntervalId);
        }
        this.cancelAlarm();
    }
}
//# sourceMappingURL=Alarm.js.map