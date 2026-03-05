import { makeAutoObservable, runInAction } from 'mobx';
import attendanceService from '../services/attendanceService';

class AttendanceStore {
  records = [];
  memberRecords = [];
  memberStats = null;
  pagination = { total: 0, page: 1, limit: 20, pages: 0 };
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all attendance records
  async fetchAttendance(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const res = await attendanceService.getAll({
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...params,
      });
      runInAction(() => {
        this.records = res.data.data;
        this.pagination = res.data.pagination;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch attendance';
        this.loading = false;
      });
    }
  }

  // Record attendance
  async createAttendance(data) {
    this.loading = true;
    this.error = null;
    try {
      const res = await attendanceService.create(data);
      runInAction(() => {
        this.records.unshift(res.data.data);
        this.loading = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to record attendance';
        this.loading = false;
      });
      throw err;
    }
  }

  // Bulk create attendance
  async bulkCreateAttendance(data) {
    this.loading = true;
    this.error = null;
    try {
      const res = await attendanceService.bulkCreate(data);
      runInAction(() => {
        this.loading = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to record bulk attendance';
        this.loading = false;
      });
      throw err;
    }
  }

  // Fetch member-specific attendance
  async fetchMemberAttendance(memberId) {
    this.loading = true;
    this.error = null;
    try {
      const res = await attendanceService.getByMember(memberId);
      runInAction(() => {
        this.memberRecords = res.data.data.records;
        this.memberStats = res.data.data.stats;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch member attendance';
        this.loading = false;
      });
    }
  }

  setPage(page) {
    this.pagination.page = page;
  }

  clearError() {
    this.error = null;
  }

  clearMemberRecords() {
    this.memberRecords = [];
    this.memberStats = null;
  }
}

const attendanceStore = new AttendanceStore();
export default attendanceStore;
