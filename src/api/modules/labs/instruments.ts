import request from '@/axios'

export const getInstrumentsList = (params: any) => {
  return request.get({ url: '/instruments', params })
}

export const addInstruments = (data: any) => {
  return request.post({
    url: '/instruments',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
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
