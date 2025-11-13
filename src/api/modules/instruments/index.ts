import request from '@/axios'

export const getInstrumentsList = (params: any) => {
  return request.get({ url: '/instruments', params })
}
export const getInstrumentsOptions = (params: any) => {
  return request.get({ url: '/instruments/options', params })
}

export const addInstruments = (data: any) => {
  return request.post({ url: '/instruments', data })
}

export const detailedInstruments = (id: any) => {
  return request.get({ url: `/instruments/${id}` })
}

export const editInstruments = (id: any, data: any) => {
  return request.post({
    url: `/instruments/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteInstruments = (id: any) => {
  return request.delete({ url: `/instruments/${id}` })
}

export const getApplicationsList = (params: any) => {
  return request.get({ url: '/instruments/applications', params })
}
export const getRepairsList = (params: any) => {
  return request.get({ url: '/instruments/repairs', params })
}

export const updatReview = (id: any, data: any) => {
  return request.post({ url: `/instruments/applications/review/${id}`, data })
}
export const updataRepairs = (id: any, data: any) => {
  return request.post({ url: `/instruments/repairs/update/${id}`, data })
}
