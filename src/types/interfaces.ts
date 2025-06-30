// タイマーの状態を管理するインターフェース
export interface TimerState {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isRunning: boolean;
    intervalId: number | null;
}

// アラームの状態を管理するインターフェース
export interface AlarmState {
    time: string;
    isSet: boolean;
    intervalId: number | null;
}

// ストップウォッチの状態を管理するインターフェース
export interface StopwatchState {
    startTime: number;
    elapsedTime: number;
    isRunning: boolean;
    intervalId: number | null;
    laps: string[];
}

// ストップウォッチの履歴項目インターフェース
export interface HistoryItem {
    date: string;
    time: string;
    laps: string[];
}

// DOM要素の型定義
export interface TimerElements {
    display: HTMLElement;
    hoursInput: HTMLInputElement;
    minutesInput: HTMLInputElement;
    secondsInput: HTMLInputElement;
}

export interface AlarmElements {
    currentTimeDisplay: HTMLElement;
    alarmTimeInput: HTMLInputElement;
    statusDisplay: HTMLElement;
}

export interface StopwatchElements {
    display: HTMLElement;
    lapTimesDisplay: HTMLElement;
    historyDisplay: HTMLElement;
}