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
        selectedPresetDisplay: HTMLElement;
        deletePresetButton: HTMLButtonElement;
        presetListContainer: HTMLElement;
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
            selectedPresetDisplay: document.getElementById('alarmSelectedPreset') as HTMLElement,
            deletePresetButton: document.getElementById('alarmDeletePreset') as HTMLButtonElement,
            presetListContainer: document.getElementById('alarmPresetList') as HTMLElement
        };

        this.initializeEventListeners();
        this.startTimeDisplay();
        this.loadPresets();
        this.updatePresetSelect();
        this.updatePresetListDisplay();
        this.clearSelectedPresetDisplay();
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
        if (this.elements.deletePresetButton) {
            this.elements.deletePresetButton.addEventListener('click', () => this.deleteSelectedPreset());
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
        this.updatePresetListDisplay();
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
    }

    // プリセットを読み込んでフォームに設定
    private loadPreset(): void {
        const selectedId = this.elements.presetSelect.value;
        if (!selectedId) {
            this.clearSelectedPresetDisplay();
            return;
        }

        const preset = this.presets.find(p => p.id === selectedId);
        if (!preset) return;

        this.elements.alarmTimeInput.value = preset.time;
        this.elements.alarmNameInput.value = preset.name;

        // 選択されたプリセットを表示
        this.displaySelectedPreset(preset);

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
        this.updatePresetListDisplay();
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
        this.updatePresetListDisplay();
        
        const savedName = name || this.generateAutoName(time);
        alert(`アラームプリセット「${savedName}」を保存しました`);
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

    // 選択されたプリセットを表示
    private displaySelectedPreset(preset: AlarmPreset): void {
        if (!this.elements.selectedPresetDisplay) return;

        const lastUsed = preset.lastUsed.toLocaleDateString('ja-JP');
        const usageCount = preset.usageCount;
        
        this.elements.selectedPresetDisplay.innerHTML = `
            <div class="selected-preset-info">
                <div class="preset-title">${preset.name}</div>
                <div class="preset-time">${preset.time}</div>
                <div class="preset-meta">使用回数: ${usageCount}回 | 最終使用: ${lastUsed}</div>
            </div>
        `;
        
        this.elements.selectedPresetDisplay.style.display = 'block';
        
        // 削除ボタンを表示
        if (this.elements.deletePresetButton) {
            this.elements.deletePresetButton.style.display = 'inline-block';
        }
    }

    // 選択されたプリセットの表示をクリア
    private clearSelectedPresetDisplay(): void {
        if (this.elements.selectedPresetDisplay) {
            this.elements.selectedPresetDisplay.style.display = 'none';
            this.elements.selectedPresetDisplay.innerHTML = '';
        }
        
        if (this.elements.deletePresetButton) {
            this.elements.deletePresetButton.style.display = 'none';
        }
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

        const confirmDelete = confirm(`アラームプリセット「${preset.name}」を削除しますか？`);
        if (!confirmDelete) return;

        this.presets = this.presets.filter(p => p.id !== selectedId);
        this.savePresets();
        this.updatePresetSelect();
        this.updatePresetListDisplay();

        // 選択状態をクリア
        this.elements.presetSelect.value = '';
        this.clearSelectedPresetDisplay();
        
        // フォームも初期化
        this.elements.alarmTimeInput.value = '';
        this.elements.alarmNameInput.value = '';

        alert(`アラームプリセット「${preset.name}」を削除しました`);
    }

    // プリセットリストの表示を更新
    private updatePresetListDisplay(): void {
        if (!this.elements.presetListContainer) return;

        this.elements.presetListContainer.innerHTML = '';

        if (this.presets.length === 0) {
            this.elements.presetListContainer.innerHTML = '<div class="no-presets">保存されたアラームはありません</div>';
            return;
        }

        this.presets.forEach(preset => {
            const presetItem = document.createElement('div');
            presetItem.className = 'preset-item';
            
            const lastUsed = preset.lastUsed.toLocaleDateString('ja-JP');
            const usageCount = preset.usageCount;
            
            presetItem.innerHTML = `
                <div class="preset-item-content">
                    <div class="preset-item-name">${preset.name}</div>
                    <div class="preset-item-time">${preset.time}</div>
                    <div class="preset-item-meta">使用回数: ${usageCount}回 | 最終使用: ${lastUsed}</div>
                </div>
                <div class="preset-item-actions">
                    <button class="btn-preset-load" data-id="${preset.id}">読込</button>
                    <button class="btn-preset-delete" data-id="${preset.id}">削除</button>
                </div>
            `;

            // イベントリスナーを追加
            const loadBtn = presetItem.querySelector('.btn-preset-load') as HTMLButtonElement;
            const deleteBtn = presetItem.querySelector('.btn-preset-delete') as HTMLButtonElement;

            if (loadBtn) {
                loadBtn.addEventListener('click', () => {
                    this.elements.presetSelect.value = preset.id;
                    this.loadPreset();
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.elements.presetSelect.value = preset.id;
                    this.deleteSelectedPreset();
                });
            }

            this.elements.presetListContainer.appendChild(presetItem);
        });
    }
}