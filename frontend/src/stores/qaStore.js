import { makeAutoObservable, runInAction } from 'mobx';
import qaService from '../services/qaService';

class QAStore {
  questions = [];
  currentQuestion = null;
  allTags = [];
  pagination = { total: 0, page: 1, limit: 10, pages: 0 };
  loading = false;
  submitting = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchQuestions(params = {}) {
    this.loading = true;
    this.error = null;
    try {
      const res = await qaService.getAll({
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...params,
      });
      runInAction(() => {
        this.questions = res.data.data;
        this.pagination = res.data.pagination;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch questions';
        this.loading = false;
      });
    }
  }

  async fetchQuestion(id) {
    this.loading = true;
    this.error = null;
    try {
      const res = await qaService.getById(id);
      runInAction(() => {
        this.currentQuestion = res.data.data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to fetch question';
        this.loading = false;
      });
    }
  }

  async createQuestion(data) {
    this.submitting = true;
    this.error = null;
    try {
      const res = await qaService.create(data);
      runInAction(() => {
        this.questions.unshift(res.data.data);
        this.pagination.total += 1;
        this.submitting = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to create question';
        this.submitting = false;
      });
      throw err;
    }
  }

  async deleteQuestion(id) {
    this.loading = true;
    this.error = null;
    try {
      await qaService.delete(id);
      runInAction(() => {
        this.questions = this.questions.filter((q) => q._id !== id);
        if (this.currentQuestion?._id === id) this.currentQuestion = null;
        this.pagination.total = Math.max(0, this.pagination.total - 1);
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to delete question';
        this.loading = false;
      });
      throw err;
    }
  }

  async upvoteQuestion(id) {
    try {
      const res = await qaService.upvote(id);
      runInAction(() => {
        const idx = this.questions.findIndex((q) => q._id === id);
        if (idx !== -1) this.questions[idx].upvotes = res.data.data.upvotes;
        if (this.currentQuestion?._id === id) {
          this.currentQuestion.upvotes = res.data.data.upvotes;
        }
      });
    } catch (err) {
      // Silently fail on upvote errors
    }
  }

  async addAnswer(questionId, data) {
    this.submitting = true;
    this.error = null;
    try {
      const res = await qaService.addAnswer(questionId, data);
      runInAction(() => {
        this.currentQuestion = res.data.data;
        const idx = this.questions.findIndex((q) => q._id === questionId);
        if (idx !== -1) {
          this.questions[idx].status = res.data.data.status;
          this.questions[idx].answers = res.data.data.answers;
        }
        this.submitting = false;
      });
      return res.data.data;
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to add answer';
        this.submitting = false;
      });
      throw err;
    }
  }

  async deleteAnswer(questionId, answerId) {
    this.loading = true;
    this.error = null;
    try {
      const res = await qaService.deleteAnswer(questionId, answerId);
      runInAction(() => {
        this.currentQuestion = res.data.data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to delete answer';
        this.loading = false;
      });
      throw err;
    }
  }

  async acceptAnswer(questionId, answerId) {
    try {
      const res = await qaService.acceptAnswer(questionId, answerId);
      runInAction(() => {
        this.currentQuestion = res.data.data;
        const idx = this.questions.findIndex((q) => q._id === questionId);
        if (idx !== -1) this.questions[idx].status = res.data.data.status;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.response?.data?.error || 'Failed to accept answer';
      });
    }
  }

  async fetchAllTags() {
    try {
      const res = await qaService.getAllTags();
      runInAction(() => {
        this.allTags = res.data.data;
      });
    } catch (err) {
      // Silently fail
    }
  }

  setPage(page) {
    this.pagination.page = page;
  }

  clearCurrentQuestion() {
    this.currentQuestion = null;
  }

  clearError() {
    this.error = null;
  }
}

const qaStore = new QAStore();
export default qaStore;
