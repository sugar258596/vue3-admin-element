import request from '@/axios'

export const loginApi = (data) => {
  return request.post({ url: '/auth/login', data })
}

export const loginOutApi = () => {
  return request.post({ url: '/auth/logout' })
}
