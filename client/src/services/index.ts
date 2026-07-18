import api from './api';
import type { ApiResponse, AuthData, User, DashboardStats } from '@/types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/register', data),
  verifyOtp: (email: string, otp: string) =>
    api.post<ApiResponse<AuthData>>('/auth/verify-otp', { email, otp }),
  resendOtp: (email: string) =>
    api.post<ApiResponse<null>>('/auth/resend-otp', { email }),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/login', data),
  googleLogin: (credential: string, action?: 'login' | 'register') =>
    api.post<ApiResponse<AuthData>>('/auth/google', { credential, action }),
  socialAuth: (data: { email: string; name?: string; provider: 'google' | 'apple'; action: 'login' | 'register' }) =>
    api.post<ApiResponse<AuthData>>('/auth/social-auth', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),
  updateProfile: (data: { name?: string; avatar?: string; preferences?: Partial<User['preferences']> }) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', data),
  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<AuthData>>('/auth/reset-password', { token, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

export const taskApi = {
  getAll: (params?: Record<string, string>) => api.get('/tasks', { params }),
  getCalendar: (month: number, year: number) =>
    api.get('/tasks/calendar', { params: { month, year } }),
  create: (data: Record<string, unknown>) => api.post('/tasks', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  reorder: (tasks: { id: string; status: string; order: number }[]) =>
    api.put('/tasks/reorder', { tasks }),
};

export const habitApi = {
  getAll: () => api.get('/habits'),
  getStats: () => api.get('/habits/stats'),
  create: (data: Record<string, unknown>) => api.post('/habits', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/habits/${id}`, data),
  delete: (id: string) => api.delete(`/habits/${id}`),
  toggle: (id: string) => api.post(`/habits/${id}/toggle`),
};

export const goalApi = {
  getAll: (params?: Record<string, string>) => api.get('/goals', { params }),
  create: (data: Record<string, unknown>) => api.post('/goals', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
  addMilestone: (id: string, data: Record<string, unknown>) =>
    api.post(`/goals/${id}/milestones`, data),
  toggleMilestone: (goalId: string, milestoneId: string) =>
    api.patch(`/goals/${goalId}/milestones/${milestoneId}`),
};

export const expenseApi = {
  getAll: (params?: Record<string, string>) => api.get('/expenses', { params }),
  create: (data: Record<string, unknown>) => api.post('/expenses', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getBudgets: () => api.get('/expenses/budgets'),
  createBudget: (data: Record<string, unknown>) => api.post('/expenses/budgets', data),
  updateBudget: (id: string, data: Record<string, unknown>) =>
    api.put(`/expenses/budgets/${id}`, data),
  deleteBudget: (id: string) => api.delete(`/expenses/budgets/${id}`),
  getReport: (period?: string) => api.get('/expenses/report', { params: { period } }),
};

export const learningApi = {
  getAll: (params?: Record<string, string>) => api.get('/learning', { params }),
  create: (data: Record<string, unknown>) => api.post('/learning', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/learning/${id}`, data),
  delete: (id: string) => api.delete(`/learning/${id}`),
  getAnalytics: () => api.get('/learning/analytics'),
};

export const analyticsApi = {
  getDashboard: () => api.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),
  getAnalytics: (period?: string) => api.get('/analytics', { params: { period } }),
};

export const aiApi = {
  getDailySuggestions: () => api.get('/ai/daily-suggestions'),
  getWeeklySummary: () => api.get('/ai/weekly-summary'),
  getGoalRecommendations: () => api.get('/ai/goal-recommendations'),
  getLearningRecommendations: () => api.get('/ai/learning-recommendations'),
  getTaskPrioritization: () => api.get('/ai/task-prioritization'),
  getImprovementInsights: () => api.get('/ai/improvement-insights'),
  chat: (message: string) => api.post('/ai/chat', { message }),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
