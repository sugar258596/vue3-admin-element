import request from '@/axios'

export const getAppointmentsList = (params) => {
  return request.get({ url: '/appointments', params })
}
export const getPendingList = (params) => {
  return request.get({ url: '/appointments/pending', params })
}

export const detailedAppointments = (id) => {
  return request.get({ url: `/appointments/${id}` })
}

export const updateReview = (id, data) => {
  return request.put({ url: `/appointments/review/${id}`, data })
}
