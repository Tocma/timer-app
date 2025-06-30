import { Timer } from './classes/Timer.js';
import { Alarm } from './classes/Alarm.js';
import { Stopwatch } from './classes/Stopwatch.js';

class App {
    // @ts-ignore
    private timer: Timer;
    // @ts-ignore
    private alarm: Alarm;
    // @ts-ignore
    private stopwatch: Stopwatch;
    // @ts-ignore
    private currentTab: string = 'timer';

    constructor() {
        this.timer = new Timer();
        this.alarm = new Alarm();
        this.stopwatch = new Stopwatch();

        this.initializeTabs();
    }

    private initializeTabs(): void {
        const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLButtonElement;
                const tabName = target.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }

    private switchTab(tabName: string): void {
        // タブボタンのアクティブ状態を更新
        const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector<HTMLButtonElement>(`.tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // コンテンツの表示切り替え
        const contents = document.querySelectorAll<HTMLDivElement>('.tab-content');
        contents.forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.currentTab = tabName;
    }
}

// DOMContentLoadedイベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new App();
});