import request from '@/axios'

export const getBannerType = () => {
  return request.get({ url: '/banners/types' })
}
export const addBannerType = (data) => {
  return request.post({ url: '/banners/types', data })
}

export const editBannerType = (id, data) => {
  return request.post({ url: `/banners/types/${id}`, data })
}

export const deleteBannerType = (id) => {
  return request.delete({ url: `/banners/types/${id}` })
}


export const getBannerList = (params) => {
  return request.get({ url: '/banners', params })
}

export const addBanner = (data) => {
  return request.post({
    url: '/banners',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const editBanner = (id, data) => {
  return request.post({
    url: `/banners/${id}`, data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteBanner = (id) => {
  return request.delete({ url: `/banners/${id}` })
}