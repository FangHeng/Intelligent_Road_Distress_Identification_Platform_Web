import { makeAutoObservable } from 'mobx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

class UIStore {
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    startLoading() {
        this.loading = true;
        NProgress.start();
    }

    stopLoading() {
        this.loading = false;
        NProgress.done();
    }
}

export const uiStore =  new UIStore();