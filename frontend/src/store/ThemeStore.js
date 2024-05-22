// themeStore.js
import {action, makeAutoObservable, observable} from 'mobx';

class ThemeStore {
    theme = 'light';

    constructor() {
        makeAutoObservable(this, {
            theme: observable,
            setTheme: action,
        });
    }

    setTheme(newTheme) {
        this.theme = newTheme;
    }
}

export const themeStore = new ThemeStore();
