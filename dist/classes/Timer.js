export class Timer {
    constructor() {
        this.state = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isRunning: false,
            intervalId: null
        };
        this.elements = {
            display: document.getElementById('timerDisplay'),
            hoursInput: document.getElementById('timerHours'),
            minutesInput: document.getElementById('timerMinutes'),
            secondsInput: document.getElementById('timerSeconds')
        };
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        const startButton = document.getElementById('timerStart');
        const stopButton = document.getElementById('timerStop');
        const resetButton = document.getElementById('timerReset');
        if (startButton)
            startButton.addEventListener('click', () => this.start());
        if (stopButton)
            stopButton.addEventListener('click', () => this.stop());
        if (resetButton)
            resetButton.addEventListener('click', () => this.reset());
    }
    start() {
        if (this.state.isRunning)
            return;
        if (this.state.totalSeconds === 0) {
            this.state.hours = parseInt(this.elements.hoursInput.value) || 0;
            this.state.minutes = parseInt(this.elements.minutesInput.value) || 0;
            this.state.seconds = parseInt(this.elements.secondsInput.value) || 0;
            this.state.totalSeconds = this.state.hours * 3600 + this.state.minutes * 60 + this.state.seconds;
        }
        if (this.state.totalSeconds === 0)
            return;
        this.state.isRunning = true;
        this.state.intervalId = window.setInterval(() => this.tick(), 1000);
    }
    stop() {
        if (!this.state.isRunning)
            return;
        this.state.isRunning = false;
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }
    reset() {
        this.stop();
        this.state.totalSeconds = 0;
        this.updateDisplay();
        this.elements.hoursInput.value = '0';
        this.elements.minutesInput.value = '0';
        this.elements.secondsInput.value = '0';
    }
    tick() {
        if (this.state.totalSeconds > 0) {
            this.state.totalSeconds--;
            this.updateDisplay();
        }
        else {
            this.stop();
            this.playSound();
            alert('タイマーが終了しました！');
        }
    }
    updateDisplay() {
        const hours = Math.floor(this.state.totalSeconds / 3600);
        const minutes = Math.floor((this.state.totalSeconds % 3600) / 60);
        const seconds = this.state.totalSeconds % 60;
        this.elements.display.textContent = this.formatTime(hours, minutes, seconds);
    }
    formatTime(hours, minutes, seconds) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    playSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgMAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4');
        audio.play().catch(error => console.error('音声再生エラー:', error));
    }
}
//# sourceMappingURL=Timer.js.map