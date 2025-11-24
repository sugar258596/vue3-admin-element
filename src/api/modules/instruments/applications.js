import request from '@/axios'

export const getApplicationsList = (params) => {
  return request.get({ url: '/instruments/applications', params })
}


export const updatReview = (id, data) => {
  return request.post({ url: `/instruments/applications/review/${id}`, data })
}

