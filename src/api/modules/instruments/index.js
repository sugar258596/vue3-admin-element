import request from '@/axios'

export const getInstrumentsList = (params) => {
  return request.get({ url: '/instruments', params })
}
export const getInstrumentsOptions = (params) => {
  return request.get({ url: '/instruments/options', params })
}

export const addInstruments = (data) => {
  return request.post({ url: '/instruments', data })
}

export const detailedInstruments = (id) => {
  return request.get({ url: `/instruments/${id}` })
}

export const editInstruments = (id, data) => {
  return request.post({
    url: `/instruments/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteInstruments = (id) => {
  return request.delete({ url: `/instruments/${id}` })
}

export const getApplicationsList = (params) => {
  return request.get({ url: '/instruments/applications', params })
}
export const getRepairsList = (params) => {
  return request.get({ url: '/instruments/repairs', params })
}

export const updatReview = (id, data) => {
  return request.post({ url: `/instruments/applications/review/${id}`, data })
}
export const updataRepairs = (id, data) => {
  return request.post({ url: `/instruments/repairs/update/${id}`, data })
}
