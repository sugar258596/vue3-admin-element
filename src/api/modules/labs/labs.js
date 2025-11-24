import request from '@/axios'

export const getLabsList = (params) => {
  return request.get({ url: '/labs', params })
}
export const getLabsOptions = (params) => {
  return request.get({ url: '/labs/options', params })
}

export const addLabs = (data) => {
  return request.post({
    url: '/labs', data, headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const detailedLabs = (id) => {
  return request.get({ url: `/labs/${id}` })
}

export const editLabs = (id, data) => {
  return request.post({
    url: `/labs/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteLabs = (id) => {
  return request.delete({ url: `/labs/${id}` })
}
