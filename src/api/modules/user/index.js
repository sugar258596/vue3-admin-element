import request from '@/axios'

export const getUserInfoApi = () => {
  return request.get({ url: '/user/info' })
}

export const getUserList = () => {
  return request.get({ url: '/user' })
}

export const addUser = (id, data) => {
  return request.post({
    url: `/user`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const editUser = (id, data) => {
  return request.post({
    url: `/user/${id}`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteUser = (id) => {
  return request.delete({
    url: `/user/${id}`
  })
}

export const editUserInfo = (data) => {
  return request.post({
    url: `/user/profile`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export const editPassword = (data) => {
  return request.post({
    url: `/user/change-password`,
    data
  })
}
