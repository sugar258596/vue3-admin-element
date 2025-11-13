import request from '@/axios'

export const loginApi = (data: any) => {
  return request.post({ url: '/auth/login', data })
}

export const loginOutApi = () => {
  return request.get({ url: '/mock/user/loginOut' })
}
