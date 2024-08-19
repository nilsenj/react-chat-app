import { makeAutoObservable, action } from 'mobx';

class AuthStore {
    unauthorized = false;

    constructor() {
        makeAutoObservable(this, {
            setUnauthorized: action,
            resetUnauthorized: action,
        });
    }

    setUnauthorized() {
        this.unauthorized = true;
    }

    resetUnauthorized() {
        this.unauthorized = false;
    }
}

const authStore = new AuthStore();
export default authStore;
