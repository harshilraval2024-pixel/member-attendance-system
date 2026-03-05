import { makeAutoObservable, runInAction } from 'mobx';
import statsService from '../services/statsService';

class DashboardStore {
  totalMembers = 0;
  totalAttendance = 0;
  avgAttendanceRate = 0;
  mostActive = [];
  weeklyTrend = [];
  monthlyTrend = [];
  skillsDistribution = [];
  statusDistribution = [];
  memberStats = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchDashboardStats() {
    this.loading = true;
    this.error = null;
    try {
      const res = await statsService.getDashboard();
      const data = res.data.data;
      runInAction(() => {
        this.totalMembers = data.totalMembers;
        this.totalAttendance = data.totalAttendance;
        this.avgAttendanceRate = data.avgAttendanceRate;
        this.mostActive = data.mostActive;
        this.weeklyTrend = data.weeklyTrend;
        this.monthlyTrend = data.monthlyTrend;
        this.skillsDistribution = data.skillsDistribution;
        this.statusDistribution = data.statusDistribution;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch dashboard stats';
        this.loading = false;
      });
    }
  }

  async fetchMemberStats(memberId) {
    this.loading = true;
    this.error = null;
    try {
      const res = await statsService.getMemberStats(memberId);
      runInAction(() => {
        this.memberStats = res.data.data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch member stats';
        this.loading = false;
      });
    }
  }

  clearError() {
    this.error = null;
  }

  clearMemberStats() {
    this.memberStats = null;
  }
}

const dashboardStore = new DashboardStore();
export default dashboardStore;
