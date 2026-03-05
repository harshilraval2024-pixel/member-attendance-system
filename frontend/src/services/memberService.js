import api from './api';

const memberService = {
  getAll: (params = {}) => api.get('/members', { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getAllSkills: () => api.get('/members/skills/all'),
};

export default memberService;
