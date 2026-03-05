import api from './api';

const attendanceService = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  bulkCreate: (data) => api.post('/attendance/bulk', data),
  getByMember: (memberId) => api.get(`/attendance/member/${memberId}`),
};

export default attendanceService;
