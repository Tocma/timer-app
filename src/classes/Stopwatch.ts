import { StopwatchState, StopwatchElements, HistoryItem } from '../types/interfaces.js';

export class Stopwatch {
    private state: StopwatchState;
    private elements: StopwatchElements;
    private history: HistoryItem[] = [];

    constructor() {
        this.state = {
            startTime: 0,
            elapsedTime: 0,
            isRunning: false,
            intervalId: null,
            laps: []
        };

        this.elements = {
            display: document.getElementById('stopwatchDisplay') as HTMLElement,
            lapTimesDisplay: document.getElementById('lapTimes') as HTMLElement,
            historyDisplay: document.getElementById('stopwatchHistory') as HTMLElement
        };

        this.initializeEventListeners();
        this.loadHistory();
        this.displayHistory();
    }

    private initializeEventListeners(): void {
        const startButton = document.getElementById('stopwatchStart');
        const stopButton = document.getElementById('stopwatchStop');
        const lapButton = document.getElementById('stopwatchLap');
        const resetButton = document.getElementById('stopwatchReset');

        if (startButton) startButton.addEventListener('click', () => this.start());
        if (stopButton) stopButton.addEventListener('click', () => this.stop());
        if (lapButton) lapButton.addEventListener('click', () => this.lap());
        if (resetButton) resetButton.addEventListener('click', () => this.reset());
    }

    private start(): void {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.state.startTime = Date.now() - this.state.elapsedTime;
        this.state.intervalId = window.setInterval(() => this.update(), 10);
    }

    private stop(): void {
        if (!this.state.isRunning) return;

        this.state.isRunning = false;
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }

        if (this.state.elapsedTime > 0) {
            this.saveToHistory();
        }
    }

    private lap(): void {
        if (!this.state.isRunning) return;

        const lapTime = this.formatElapsedTime();
        this.state.laps.push(lapTime);
        this.displayLaps();
    }

    private reset(): void {
        this.stop();
        this.state.elapsedTime = 0;
        this.state.laps = [];
        this.elements.display.textContent = '00:00:00';
        this.elements.lapTimesDisplay.innerHTML = '';
    }

    private update(): void {
        this.state.elapsedTime = Date.now() - this.state.startTime;
        this.elements.display.textContent = this.formatElapsedTime();
    }

    private formatElapsedTime(): string {
        const totalSeconds = Math.floor(this.state.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((this.state.elapsedTime % 1000) / 10);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    private displayLaps(): void {
        this.elements.lapTimesDisplay.innerHTML = '';
        this.state.laps.forEach((lap, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `<span>ラップ ${index + 1}</span><span>${lap}</span>`;
            this.elements.lapTimesDisplay.appendChild(lapItem);
        });
    }

    private saveToHistory(): void {
        const historyItem: HistoryItem = {
            date: new Date().toLocaleDateString('ja-JP'),
            time: this.formatElapsedTime(),
            laps: [...this.state.laps]
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        try {
            localStorage.setItem('stopwatchHistory', JSON.stringify(this.history));
        } catch (error) {
            console.error('履歴の保存に失敗しました:', error);
        }
        
        this.displayHistory();
    }

    private loadHistory(): void {
        try {
            const saved = localStorage.getItem('stopwatchHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (error) {
            console.error('履歴の読み込みに失敗しました:', error);
            this.history = [];
        }
    }

    private displayHistory(): void {
        this.elements.historyDisplay.innerHTML = '';
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${item.date}</span>
                <span>${item.time}</span>
            `;
            this.elements.historyDisplay.appendChild(historyItem);
        });
    }
}