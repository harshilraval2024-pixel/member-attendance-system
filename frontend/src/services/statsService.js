import api from './api';

const statsService = {
  getDashboard: () => api.get('/stats/dashboard'),
  getMemberStats: (memberId) => api.get(`/stats/member/${memberId}`),
};

export default statsService;
