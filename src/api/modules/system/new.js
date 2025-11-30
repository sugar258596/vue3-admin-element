import request from '@/axios'

export const getNewList = () => {
  return request.get({ url: '/news' })
}

export const getNewsById = (id) => {
  return request.get({ url: `/news/${id}` })
}

export const addNews = (data) => {
  return request.post({
    url: '/news', data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const editNews = (id, data) => {
  return request.post({
    url: `/news/${id}`, data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteNews = (id) => {
  return request.delete({ url: `/news/${id}` })
}