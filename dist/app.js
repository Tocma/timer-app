import { Timer } from './classes/Timer.js';
import { Alarm } from './classes/Alarm.js';
import { Stopwatch } from './classes/Stopwatch.js';
class App {
    constructor() {
        // @ts-ignore
        this.currentTab = 'timer';
        this.timer = new Timer();
        this.alarm = new Alarm();
        this.stopwatch = new Stopwatch();
        this.initializeTabs();
    }
    initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target;
                const tabName = target.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }
    switchTab(tabName) {
        // タブボタンのアクティブ状態を更新
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        // コンテンツの表示切り替え
        const contents = document.querySelectorAll('.tab-content');
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
//# sourceMappingURL=app.js.map