import request from '@/axios'

export const getNotifications = (params) => {
  return request.get({ url: '/notifications/all', params })
}

export const addNotifications = (data) => {
  return request.post({ url: `/notifications`, data })
}

export const editNotifications = (id, data) => {
  return request.post({ url: `/notifications/${id}`, data })
}

export const deleteNotifications = (id) => {
  return request.delete({ url: `/notifications/${id}` })
}
