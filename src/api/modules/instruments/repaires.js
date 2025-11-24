import request from '@/axios'

export const getRepairsList = (params) => {
  return request.get({ url: '/repairs', params })
}

export const updatRepairs = (id, data) => {
  return request.post({ url: `/repairs/update/${id}`, data })
}

