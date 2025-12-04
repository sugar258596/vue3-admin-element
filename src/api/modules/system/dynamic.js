import request from '@/axios'

// 动态就是资讯，直接使用 news 接口
// 获取动态列表
export const getDynamicList = (params) => {
  return request.get({ url: '/news', params })
}

// 获取动态详情
export const getDynamicDetail = (id) => {
  return request.get({ url: `/news/${id}` })
}

// 添加动态
export const addDynamic = (data) => {
  return request.post({ url: '/news', data })
}

// 编辑动态
export const editDynamic = (id, data) => {
  return request.put({ url: `/news/${id}`, data })
}

// 删除动态
export const deleteDynamic = (id) => {
  return request.delete({ url: `/news/${id}` })
}

// 切换动态发布状态
export const toggleDynamicPublish = (id) => {
  return request.patch({ url: `/news/${id}/publish` })
}
