import request from '@/axios'

export const getApplicationsList = (params) => {
  return request.get({ url: '/instrument-applications', params })
}


export const updatReview = (id, data) => {
  return request.post({ url: `/instrument-applications/${id}`, data })
}

