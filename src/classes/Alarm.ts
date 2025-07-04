import { AlarmState, AlarmElements } from '../types/interfaces.js';

// アラームプリセット用のインターフェース
interface AlarmPreset {
    id: string;
    time: string;
    name: string;
    lastUsed: Date;
    usageCount: number;
}

export class Alarm {
    private state: AlarmState;
    private elements: AlarmElements & {
        presetSelect: HTMLSelectElement;
        savePresetButton: HTMLButtonElement;
        alarmNameInput: HTMLInputElement;
        presetDeleteButton: HTMLButtonElement;
    };
    private updateIntervalId: number | null = null;
    private presets: AlarmPreset[] = [];

    constructor() {
        this.state = {
            time: '',
            isSet: false,
            intervalId: null
        };

        this.elements = {
            currentTimeDisplay: document.getElementById('currentTime') as HTMLElement,
            alarmTimeInput: document.getElementById('alarmTime') as HTMLInputElement,
            statusDisplay: document.getElementById('alarmStatus') as HTMLElement,
            presetSelect: document.getElementById('alarmPresetSelect') as HTMLSelectElement,
            savePresetButton: document.getElementById('alarmSavePreset') as HTMLButtonElement,
            alarmNameInput: document.getElementById('alarmName') as HTMLInputElement,
            presetDeleteButton: document.getElementById('alarmDeletePreset') as HTMLButtonElement
        };

        this.initializeEventListeners();
        this.startTimeDisplay();
        this.loadPresets();
        this.updatePresetSelect();
    }

    private initializeEventListeners(): void {
        const setButton = document.getElementById('alarmSet');
        const cancelButton = document.getElementById('alarmCancel');

        if (setButton) setButton.addEventListener('click', () => this.setAlarm());
        if (cancelButton) cancelButton.addEventListener('click', () => this.cancelAlarm());

        // 新機能のイベントリスナー
        if (this.elements.presetSelect) {
            this.elements.presetSelect.addEventListener('change', () => this.loadPreset());
        }
        if (this.elements.savePresetButton) {
            this.elements.savePresetButton.addEventListener('click', () => this.saveCurrentAsPreset());
        }
        if (this.elements.presetDeleteButton) {
            this.elements.presetDeleteButton.addEventListener('click', () => this.deleteSelectedPreset());
        }
    }

    private startTimeDisplay(): void {
        this.updateCurrentTime();
        this.updateIntervalId = window.setInterval(() => this.updateCurrentTime(), 1000);
    }

    private updateCurrentTime(): void {
        const now = new Date();
        this.elements.currentTimeDisplay.textContent = now.toLocaleTimeString('ja-JP');
    }

    private setAlarm(): void {
        const time = this.elements.alarmTimeInput.value;
        if (!time) {
            alert('アラーム時刻を設定してください');
            return;
        }

        const alarmName = this.elements.alarmNameInput.value.trim();

        this.state.time = time;
        this.state.isSet = true;
        
        const displayName = alarmName ? `「${alarmName}」` : '';
        this.elements.statusDisplay.textContent = `アラーム設定: ${time} ${displayName}`;
        this.elements.statusDisplay.style.color = '#27ae60';

        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
        }

        this.state.intervalId = window.setInterval(() => this.checkAlarm(), 1000);

        // アラーム設定時に使用履歴を自動保存
        this.saveAlarmUsage(time, alarmName);
    }

    private cancelAlarm(): void {
        this.state.isSet = false;
        this.elements.statusDisplay.textContent = 'アラームはセットされていません';
        this.elements.statusDisplay.style.color = '#e74c3c';

        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }

    private checkAlarm(): void {
        if (!this.state.isSet) return;

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        if (currentTime === this.state.time) {
            this.playAlarm();
            
            const alarmName = this.elements.alarmNameInput.value.trim();
            const alertMessage = alarmName ? 
                `アラーム「${alarmName}」の時刻になりました！` : 
                'アラーム時刻になりました！';
            
            alert(alertMessage);
            this.cancelAlarm();
        }
    }

    private playAlarm(): void {
        const audio = new Audio('data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgMAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4');
        audio.play().catch(error => console.error('アラーム音声再生エラー:', error));
    }

    public destroy(): void {
        if (this.updateIntervalId !== null) {
            clearInterval(this.updateIntervalId);
        }
        this.cancelAlarm();
    }

    // 新機能: アラーム使用履歴を保存
    private saveAlarmUsage(time: string, name: string): void {
        // 同じ時刻設定が既に存在するかチェック
        const existingIndex = this.presets.findIndex(preset => preset.time === time);

        if (existingIndex !== -1) {
            // 既存設定の使用回数と最終使用日時を更新
            this.presets[existingIndex].usageCount++;
            this.presets[existingIndex].lastUsed = new Date();
            
            // 名前が設定されている場合は更新
            if (name && name !== this.presets[existingIndex].name) {
                this.presets[existingIndex].name = name;
            }
        } else {
            // 新しい設定として追加
            const newPreset: AlarmPreset = {
                id: this.generateId(),
                time: time,
                name: name || this.generateAutoName(time),
                lastUsed: new Date(),
                usageCount: 1
            };

            this.presets.unshift(newPreset);

            // 最大15件まで保持（アラームは時刻のパターンが限られるため少し多めに設定）
            if (this.presets.length > 15) {
                this.presets = this.presets.slice(0, 15);
            }
        }

        // 使用頻度と最終使用日時で並び替え
        this.presets.sort((a, b) => {
            const scoreA = a.usageCount * 0.7 + (new Date().getTime() - new Date(a.lastUsed).getTime()) * -0.3;
            const scoreB = b.usageCount * 0.7 + (new Date().getTime() - new Date(b.lastUsed).getTime()) * -0.3;
            return scoreB - scoreA;
        });

        this.savePresets();
        this.updatePresetSelect();
    }

    // プリセットの読み込み
    private loadPresets(): void {
        try {
            const saved = localStorage.getItem('alarmPresets');
            if (saved) {
                this.presets = JSON.parse(saved).map((preset: any) => ({
                    ...preset,
                    lastUsed: new Date(preset.lastUsed),
                    usageCount: preset.usageCount || 1
                }));
            }
        } catch (error) {
            console.error('アラームプリセットの読み込みに失敗しました:', error);
            this.presets = [];
        }
    }

    // プリセットの保存
    private savePresets(): void {
        try {
            localStorage.setItem('alarmPresets', JSON.stringify(this.presets));
        } catch (error) {
            console.error('アラームプリセットの保存に失敗しました:', error);
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
            const usageIndicator = preset.usageCount > 1 ? ` (${preset.usageCount}回使用)` : '';
            option.textContent = `${preset.time} - ${preset.name}${usageIndicator}`;
            this.elements.presetSelect.appendChild(option);
        });

        // 削除ボタンの表示制御
        if (this.elements.presetDeleteButton) {
            this.elements.presetDeleteButton.style.display = 
                this.presets.length > 0 ? 'inline-block' : 'none';
        }
    }

    // プリセットを読み込んでフォームに設定
    private loadPreset(): void {
        const selectedId = this.elements.presetSelect.value;
        if (!selectedId) return;

        const preset = this.presets.find(p => p.id === selectedId);
        if (!preset) return;

        this.elements.alarmTimeInput.value = preset.time;
        this.elements.alarmNameInput.value = preset.name;

        // 選択したプリセットの使用回数と最終使用日時を更新
        preset.usageCount++;
        preset.lastUsed = new Date();
        
        this.presets.sort((a, b) => {
            const scoreA = a.usageCount * 0.7 + (new Date().getTime() - new Date(a.lastUsed).getTime()) * -0.3;
            const scoreB = b.usageCount * 0.7 + (new Date().getTime() - new Date(b.lastUsed).getTime()) * -0.3;
            return scoreB - scoreA;
        });
        
        this.savePresets();
        this.updatePresetSelect();
    }

    // 現在の設定をプリセットとして保存
    private saveCurrentAsPreset(): void {
        const time = this.elements.alarmTimeInput.value;
        const name = this.elements.alarmNameInput.value.trim();

        if (!time) {
            alert('アラーム時刻を設定してください');
            return;
        }

        // 同じ時刻が既に存在するかチェック
        const existingPreset = this.presets.find(p => p.time === time);
        if (existingPreset) {
            const confirmUpdate = confirm(`時刻 ${time} は既に保存されています。設定を更新しますか？`);
            if (!confirmUpdate) return;
            
            existingPreset.name = name || this.generateAutoName(time);
            existingPreset.lastUsed = new Date();
        } else {
            const newPreset: AlarmPreset = {
                id: this.generateId(),
                time: time,
                name: name || this.generateAutoName(time),
                lastUsed: new Date(),
                usageCount: 0
            };

            this.presets.unshift(newPreset);
            
            if (this.presets.length > 15) {
                this.presets = this.presets.slice(0, 15);
            }
        }

        this.savePresets();
        this.updatePresetSelect();
        
        const savedName = name || this.generateAutoName(time);
        alert(`アラームプリセット「${savedName}」を保存しました`);
    }

    // 選択されたプリセットを削除
    private deleteSelectedPreset(): void {
        const selectedId = this.elements.presetSelect.value;
        if (!selectedId) {
            alert('削除するプリセットを選択してください');
            return;
        }

        const preset = this.presets.find(p => p.id === selectedId);
        if (!preset) return;

        const confirmDelete = confirm(`プリセット「${preset.name}」を削除しますか？`);
        if (!confirmDelete) return;

        this.presets = this.presets.filter(p => p.id !== selectedId);
        this.savePresets();
        this.updatePresetSelect();

        // フォームもクリア
        this.elements.presetSelect.value = '';
        alert(`プリセット「${preset.name}」を削除しました`);
    }

    // 自動的な名前生成
    private generateAutoName(time: string): string {
        const [hours, minutes] = time.split(':').map(Number);
        
        if (hours >= 6 && hours < 12) {
            return `朝のアラーム (${hours}時${minutes}分)`;
        } else if (hours >= 12 && hours < 18) {
            return `午後のアラーム (${hours}時${minutes}分)`;
        } else if (hours >= 18 && hours < 22) {
            return `夕方のアラーム (${hours}時${minutes}分)`;
        } else {
            return `夜のアラーム (${hours}時${minutes}分)`;
        }
    }

    // ユニークID生成
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}