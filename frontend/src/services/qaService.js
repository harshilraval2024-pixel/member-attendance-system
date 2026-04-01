import api from './api';

const qaService = {
  getAll: (params = {}) => api.get('/qa', { params }),
  getById: (id) => api.get(`/qa/${id}`),
  create: (data) => api.post('/qa', data),
  update: (id, data) => api.put(`/qa/${id}`, data),
  delete: (id) => api.delete(`/qa/${id}`),
  upvote: (id) => api.patch(`/qa/${id}/upvote`),
  addAnswer: (id, data) => api.post(`/qa/${id}/answers`, data),
  deleteAnswer: (id, answerId) => api.delete(`/qa/${id}/answers/${answerId}`),
  acceptAnswer: (id, answerId) => api.patch(`/qa/${id}/answers/${answerId}/accept`),
  getAllTags: () => api.get('/qa/tags/all'),
};

export default qaService;
