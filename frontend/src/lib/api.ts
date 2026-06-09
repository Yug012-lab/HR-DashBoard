import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: (window as any).__VITE_API_URL__ || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_URL : und
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// --- Auth ---
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
}

// --- Attendance ---
export const attendanceApi = {
  checkIn: (data: { selfieBase64: string; lat: number; lng: number }) =>
    api.post('/api/attendance/checkin', data),
  checkOut: (data: { selfieBase64: string; lat: number; lng: number }) =>
    api.post('/api/attendance/checkout', data),
  getToday: () => api.get('/api/attendance/today'),
  getAll: (params?: Record<string, string>) =>
    api.get('/api/attendance', { params }),
  getStats: () => api.get('/api/attendance/stats'),
}

// --- Employees ---
export const employeeApi = {
  getAll: (params?: Record<string, string>) => api.get('/api/employees', { params }),
  getById: (id: number) => api.get(`/api/employees/${id}`),
  create: (data: unknown) => api.post('/api/employees', data),
  update: (id: number, data: unknown) => api.put(`/api/employees/${id}`, data),
  delete: (id: number) => api.delete(`/api/employees/${id}`),
}

// --- Leave ---
export const leaveApi = {
  apply: (data: unknown) => api.post('/api/leave/apply', data),
  getMyLeaves: () => api.get('/api/leave/my'),
  getAllLeaves: (params?: Record<string, string>) => api.get('/api/leave', { params }),
  approve: (id: number) => api.put(`/api/leave/${id}/approve`),
  reject: (id: number, reason: string) =>
    api.put(`/api/leave/${id}/reject`, { reason }),
  getBalance: () => api.get('/api/leave/balance'),
}

// --- Payroll ---
export const payrollApi = {
  getAll: (params?: Record<string, string>) => api.get('/api/payroll', { params }),
  getMyPayslips: () => api.get('/api/payroll/my'),
  generate: (month: string, year: number) =>
    api.post('/api/payroll/generate', { month, year }),
  getPayslip: (id: number) => api.get(`/api/payroll/${id}`),
}

// --- Analytics ---
export const analyticsApi = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getAttendanceTrend: (months: number) =>
    api.get(`/api/analytics/attendance-trend?months=${months}`),
  getDepartmentStats: () => api.get('/api/analytics/departments'),
  getAttritionRate: () => api.get('/api/analytics/attrition'),
}

// --- Performance ---
export const performanceApi = {
  getAll: () => api.get('/api/performance'),
  getMyPerformance: () => api.get('/api/performance/my'),
  submit: (data: unknown) => api.post('/api/performance', data),
}

// --- Recruitment ---
export const recruitmentApi = {
  getJobs: () => api.get('/api/recruitment/jobs'),
  createJob: (data: unknown) => api.post('/api/recruitment/jobs', data),
  getCandidates: (jobId?: number) =>
    api.get('/api/recruitment/candidates', { params: jobId ? { jobId } : undefined }),
  updateCandidateStatus: (id: number, status: string) =>
    api.put(`/api/recruitment/candidates/${id}/status`, { status }),
}
