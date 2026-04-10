import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://hostelhub-production-b28a.up.railway.app/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

export const hostelApi = {
  getAll:       ()       => api.get('/public/hostels'),
  search:       (city)   => api.get(`/public/hostels/search?city=${city}`),
  getById:      (id)     => api.get(`/public/hostels/${id}`),
  create:       (data)   => api.post('/hostels', data),
  update:       (id, d)  => api.put(`/hostels/${id}`, d),
  remove:       (id)     => api.delete(`/hostels/${id}`),
  getMyHostels: ()       => api.get('/hostels/my'),
  getAllAdmin:   ()       => api.get('/admin/hostels'),
  approve:      (id)     => api.put(`/admin/hostels/${id}/approve`),
  reject:       (id)     => api.put(`/admin/hostels/${id}/reject`),
}

export const roomApi = {
  getByHostel: (hostelId) => api.get(`/public/hostels/${hostelId}/rooms`),
  getById:     (id)       => api.get(`/public/rooms/${id}`),
  create:      (data)     => api.post('/rooms', data),
  update:      (id, d)    => api.put(`/rooms/${id}`, d),
  remove:      (id)       => api.delete(`/rooms/${id}`),
}

export const bookingApi = {
  create:         (data) => api.post('/bookings', data),
  getMyBookings:  ()     => api.get('/bookings/my'),
  getOwnerBookings: ()   => api.get('/bookings/owner'),
  approve:        (id)   => api.put(`/bookings/${id}/approve`),
  reject:         (id)   => api.put(`/bookings/${id}/reject`),
  cancel:         (id)   => api.put(`/bookings/${id}/cancel`),
  getAll:         ()     => api.get('/bookings/admin'),
}

export const paymentApi = {
  record:        (data) => api.post('/payments', data),
  getMyPayments: ()     => api.get('/payments/my'),
  getAll:        ()     => api.get('/payments/admin'),
}

export const complaintApi = {
  raise:             (data)        => api.post('/complaints', data),
  getMyComplaints:   ()            => api.get('/complaints/my'),
  getOwnerComplaints: ()           => api.get('/complaints/owner'),
  updateStatus:      (id, status)  => api.put(`/complaints/${id}/status`, null, { params: { status } }),
  getAll:            ()            => api.get('/complaints/admin'),
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
}

export default api
