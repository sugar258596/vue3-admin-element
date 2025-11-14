import request from '@/axios'

export const getLabsList = (params: any) => {
  return request.get({ url: '/labs', params })
}
export const getLabsOptions = (params: any) => {
  return request.get({ url: '/labs/options', params })
}

export const addLabs = (data: any) => {
  return request.post({ url: '/labs', data })
}

export const detailedLabs = (id: any) => {
  return request.get({ url: `/labs/${id}` })
}

export const editLabs = (id: any, data: any) => {
  return request.post({
    url: `/labs/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteLabs = (id: any) => {
  return request.delete({ url: `/labs/${id}` })
}
