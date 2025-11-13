import request from '@/axios'

export const getUserInfoApi = () => {
  return request.get({ url: '/user/info' })
}

export const getUserList = () => {
  return request.get({ url: '/user' })
}

export const editUser = (id: any, data: any) => {
  return request.post({
    url: `/user/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteUser = (id: any) => {
  return request.delete({
    url: `/user/${id}`
  })
}
