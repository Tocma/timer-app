import { TimerState, TimerElements } from '../types/interfaces.js';

// タイマープリセット用のインターフェース
interface TimerPreset {
    id: string;
    hours: number;
    minutes: number;
    seconds: number;
    name: string;
    lastUsed: Date;
}

export class Timer {
    private state: TimerState;
    private elements: TimerElements & {
        presetSelect: HTMLSelectElement;
        savePresetButton: HTMLButtonElement;
        presetNameInput: HTMLInputElement;
    };
    private presets: TimerPreset[] = [];

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
            display: document.getElementById('timerDisplay') as HTMLElement,
            hoursInput: document.getElementById('timerHours') as HTMLInputElement,
            minutesInput: document.getElementById('timerMinutes') as HTMLInputElement,
            secondsInput: document.getElementById('timerSeconds') as HTMLInputElement,
            presetSelect: document.getElementById('timerPresetSelect') as HTMLSelectElement,
            savePresetButton: document.getElementById('timerSavePreset') as HTMLButtonElement,
            presetNameInput: document.getElementById('timerPresetName') as HTMLInputElement
        };

        this.initializeEventListeners();
        this.loadPresets();
        this.updatePresetSelect();
    }

    private initializeEventListeners(): void {
        const startButton = document.getElementById('timerStart');
        const stopButton = document.getElementById('timerStop');
        const resetButton = document.getElementById('timerReset');

        if (startButton) startButton.addEventListener('click', () => this.start());
        if (stopButton) stopButton.addEventListener('click', () => this.stop());
        if (resetButton) resetButton.addEventListener('click', () => this.reset());

        // 新機能のイベントリスナー
        if (this.elements.presetSelect) {
            this.elements.presetSelect.addEventListener('change', () => this.loadPreset());
        }
        if (this.elements.savePresetButton) {
            this.elements.savePresetButton.addEventListener('click', () => this.saveCurrentAsPreset());
        }
    }

    private start(): void {
        if (this.state.isRunning) return;

        if (this.state.totalSeconds === 0) {
            this.state.hours = parseInt(this.elements.hoursInput.value) || 0;
            this.state.minutes = parseInt(this.elements.minutesInput.value) || 0;
            this.state.seconds = parseInt(this.elements.secondsInput.value) || 0;
            this.state.totalSeconds = this.state.hours * 3600 + this.state.minutes * 60 + this.state.seconds;
        }

        if (this.state.totalSeconds === 0) return;

        // タイマー開始時に自動的に設定を保存
        this.saveTimerUsage();

        this.state.isRunning = true;
        this.state.intervalId = window.setInterval(() => this.tick(), 1000);
    }

    private stop(): void {
        if (!this.state.isRunning) return;
        
        this.state.isRunning = false;
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }

    private reset(): void {
        this.stop();
        this.state.totalSeconds = 0;
        this.updateDisplay();
        this.elements.hoursInput.value = '0';
        this.elements.minutesInput.value = '0';
        this.elements.secondsInput.value = '0';
    }

    private tick(): void {
        if (this.state.totalSeconds > 0) {
            this.state.totalSeconds--;
            this.updateDisplay();
        } else {
            this.stop();
            this.playSound();
            alert('タイマーが終了しました！');
        }
    }

    private updateDisplay(): void {
        const hours = Math.floor(this.state.totalSeconds / 3600);
        const minutes = Math.floor((this.state.totalSeconds % 3600) / 60);
        const seconds = this.state.totalSeconds % 60;
        this.elements.display.textContent = this.formatTime(hours, minutes, seconds);
    }

    private formatTime(hours: number, minutes: number, seconds: number): string {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    private playSound(): void {
        const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgMAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4');
        audio.play().catch(error => console.error('音声再生エラー:', error));
    }

    // 新機能: タイマー使用履歴を保存
    private saveTimerUsage(): void {
        const currentSetting = {
            hours: this.state.hours,
            minutes: this.state.minutes,
            seconds: this.state.seconds
        };

        // 同じ設定が既に存在するかチェック
        const existingIndex = this.presets.findIndex(preset => 
            preset.hours === currentSetting.hours && 
            preset.minutes === currentSetting.minutes && 
            preset.seconds === currentSetting.seconds
        );

        if (existingIndex !== -1) {
            // 既存の設定の最終使用日時を更新
            this.presets[existingIndex].lastUsed = new Date();
        } else {
            // 新しい設定として追加
            const newPreset: TimerPreset = {
                id: this.generateId(),
                hours: currentSetting.hours,
                minutes: currentSetting.minutes,
                seconds: currentSetting.seconds,
                name: this.generateAutoName(currentSetting.hours, currentSetting.minutes, currentSetting.seconds),
                lastUsed: new Date()
            };

            this.presets.unshift(newPreset);

            // 最大10件まで保持
            if (this.presets.length > 10) {
                this.presets = this.presets.slice(0, 10);
            }
        }

        // 最終使用日時順にソート
        this.presets.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());

        this.savePresets();
        this.updatePresetSelect();
    }

    // プリセットの読み込み
    private loadPresets(): void {
        try {
            const saved = localStorage.getItem('timerPresets');
            if (saved) {
                this.presets = JSON.parse(saved).map((preset: any) => ({
                    ...preset,
                    lastUsed: new Date(preset.lastUsed)
                }));
            }
        } catch (error) {
            console.error('プリセットの読み込みに失敗しました:', error);
            this.presets = [];
        }
    }

    // プリセットの保存
    private savePresets(): void {
        try {
            localStorage.setItem('timerPresets', JSON.stringify(this.presets));
        } catch (error) {
            console.error('プリセットの保存に失敗しました:', error);
        }
    }

    // プリセット選択の更新
    private updatePresetSelect(): void {
        if (!this.elements.presetSelect) return;

        // 既存のオプションをクリア
        this.elements.presetSelect.innerHTML = '<option value="">プリセットを選択...</option>';

        // プリセットをオプションとして追加
        this.presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = `${preset.name} (${this.formatTime(preset.hours, preset.minutes, preset.seconds)})`;
            this.elements.presetSelect.appendChild(option);
        });
    }

    // プリセットを読み込んでフォームに設定
    private loadPreset(): void {
        const selectedId = this.elements.presetSelect.value;
        if (!selectedId) return;

        const preset = this.presets.find(p => p.id === selectedId);
        if (!preset) return;

        this.elements.hoursInput.value = preset.hours.toString();
        this.elements.minutesInput.value = preset.minutes.toString();
        this.elements.secondsInput.value = preset.seconds.toString();

        // 選択したプリセットの最終使用日時を更新
        preset.lastUsed = new Date();
        this.presets.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
        this.savePresets();
        this.updatePresetSelect();
    }

    // 現在の設定をプリセットとして保存
    private saveCurrentAsPreset(): void {
        const hours = parseInt(this.elements.hoursInput.value) || 0;
        const minutes = parseInt(this.elements.minutesInput.value) || 0;
        const seconds = parseInt(this.elements.secondsInput.value) || 0;
        const name = this.elements.presetNameInput.value.trim();

        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert('有効な時間を設定してください');
            return;
        }

        const presetName = name || this.generateAutoName(hours, minutes, seconds);
        
        const newPreset: TimerPreset = {
            id: this.generateId(),
            hours,
            minutes,
            seconds,
            name: presetName,
            lastUsed: new Date()
        };

        this.presets.unshift(newPreset);
        
        // 最大10件まで保持
        if (this.presets.length > 10) {
            this.presets = this.presets.slice(0, 10);
        }

        this.savePresets();
        this.updatePresetSelect();
        
        // 入力フィールドをクリア
        this.elements.presetNameInput.value = '';
        
        alert(`プリセット「${presetName}」を保存しました`);
    }

    // 自動的な名前生成
    private generateAutoName(hours: number, minutes: number, seconds: number): string {
        if (hours > 0) {
            return `${hours}時間${minutes > 0 ? minutes + '分' : ''}`;
        } else if (minutes > 0) {
            return `${minutes}分${seconds > 0 ? seconds + '秒' : ''}`;
        } else {
            return `${seconds}秒`;
        }
    }

    // ユニークID生成
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}