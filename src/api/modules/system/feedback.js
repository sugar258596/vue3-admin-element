import request from '@/axios'

// 获取反馈列表
export const getFeedbackList = (params) => {
  return request.get({ url: '/feedbacks', params })
}

// 获取反馈详情
export const getFeedbackDetail = (id) => {
  return request.get({ url: `/feedbacks/${id}` })
}

// 回复反馈
export const replyFeedback = (id, data) => {
  return request.post({ url: `/feedbacks/${id}/reply`, data })
}

// 更新反馈状态
export const updateFeedbackStatus = (id, status) => {
  return request.patch({ url: `/feedbacks/${id}/status`, data: { status } })
}

// 删除反馈
export const deleteFeedback = (id) => {
  return request.delete({ url: `/feedbacks/${id}` })
}

// 关闭反馈
export const closeFeedback = (id) => {
  return request.patch({ url: `/feedbacks/${id}/close` })
}
