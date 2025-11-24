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

