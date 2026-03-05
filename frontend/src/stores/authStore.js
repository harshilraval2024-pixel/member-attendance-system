import { makeAutoObservable, runInAction } from 'mobx';
import authService from '../services/authService';

class AuthStore {
  admin = null;
  token = localStorage.getItem('token') || null;
  isAuthenticated = !!localStorage.getItem('token');
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.loadUser();
    }
  }

  async login(credentials) {
    this.loading = true;
    this.error = null;
    try {
      const res = await authService.login(credentials);
      runInAction(() => {
        this.token = res.data.data.token;
        this.admin = res.data.data;
        this.isAuthenticated = true;
        localStorage.setItem('token', res.data.data.token);
        this.loading = false;
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Login failed';
        this.loading = false;
      });
      return false;
    }
  }

  async register(data) {
    this.loading = true;
    this.error = null;
    try {
      const res = await authService.register(data);
      runInAction(() => {
        this.token = res.data.data.token;
        this.admin = res.data.data;
        this.isAuthenticated = true;
        localStorage.setItem('token', res.data.data.token);
        this.loading = false;
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Registration failed';
        this.loading = false;
      });
      return false;
    }
  }

  async loadUser() {
    try {
      const res = await authService.getMe();
      runInAction(() => {
        this.admin = res.data.data;
        this.isAuthenticated = true;
      });
    } catch (err) {
      runInAction(() => {
        this.logout();
      });
    }
  }

  logout() {
    this.admin = null;
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  clearError() {
    this.error = null;
  }
}

const authStore = new AuthStore();
export default authStore;
