import request from '@/axios'

export const getInstrumentsList = (params) => {
  return request.get({ url: '/instruments', params })
}

export const addInstruments = (data) => {
  return request.post({
    url: '/instruments',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
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
