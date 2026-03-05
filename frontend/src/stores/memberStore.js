import { makeAutoObservable, runInAction } from 'mobx';
import memberService from '../services/memberService';

class MemberStore {
  members = [];
  currentMember = null;
  allSkills = [];
  pagination = { total: 0, page: 1, limit: 10, pages: 0 };
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all members with filters
  async fetchMembers(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const res = await memberService.getAll({
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...params,
      });
      runInAction(() => {
        this.members = res.data.data;
        this.pagination = res.data.pagination;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch members';
        this.loading = false;
      });
    }
  }

  // Fetch single member
  async fetchMember(id) {
    this.loading = true;
    this.error = null;
    try {
      const res = await memberService.getById(id);
      runInAction(() => {
        this.currentMember = res.data.data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch member';
        this.loading = false;
      });
    }
  }

  // Create member
  async createMember(data) {
    this.loading = true;
    this.error = null;
    try {
      const res = await memberService.create(data);
      runInAction(() => {
        this.members.push(res.data.data);
        this.loading = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to create member';
        this.loading = false;
      });
      throw err;
    }
  }

  // Update member
  async updateMember(id, data) {
    this.loading = true;
    this.error = null;
    try {
      const res = await memberService.update(id, data);
      runInAction(() => {
        const index = this.members.findIndex((m) => m._id === id);
        if (index !== -1) this.members[index] = res.data.data;
        if (this.currentMember?._id === id) this.currentMember = res.data.data;
        this.loading = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to update member';
        this.loading = false;
      });
      throw err;
    }
  }

  // Delete member
  async deleteMember(id) {
    this.loading = true;
    this.error = null;
    try {
      await memberService.delete(id);
      runInAction(() => {
        this.members = this.members.filter((m) => m._id !== id);
        if (this.currentMember?._id === id) this.currentMember = null;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to delete member';
        this.loading = false;
      });
      throw err;
    }
  }

  // Fetch all unique skills
  async fetchAllSkills() {
    try {
      const res = await memberService.getAllSkills();
      runInAction(() => {
        this.allSkills = res.data.data;
      });
    } catch (err) {
      // Silently fail
    }
  }

  setPage(page) {
    this.pagination.page = page;
  }

  clearError() {
    this.error = null;
  }

  clearCurrentMember() {
    this.currentMember = null;
  }
}

const memberStore = new MemberStore();
export default memberStore;
