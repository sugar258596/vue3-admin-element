import request from '@/axios'

export const getAppointmentsList = (params: any) => {
  return request.get({ url: '/appointments', params })
}
export const getPendingList = (params: any) => {
  return request.get({ url: '/appointments/pending', params })
}

export const detailedAppointments = (id: any) => {
  return request.get({ url: `/appointments/${id}` })
}

export const updateReview = (id: any, data: any) => {
  return request.patch({ url: `/appointments/review/${id}`, data })
}
