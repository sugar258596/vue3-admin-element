import request from '@/axios'

// 获取面板统计数据
export const getDashboardPanelApi = () => {
  return request.get({ url: '/dashboard/panel' })
}

// 获取用户访问来源（仪器状态分布）
export const getUserAccessSourceApi = () => {
  return request.get({ url: '/dashboard/user-access-source' })
}

// 获取周活跃量
export const getWeeklyActivityApi = () => {
  return request.get({ url: '/dashboard/weekly-activity' })
}

// 获取月度销售数据
export const getMonthlySalesApi = () => {
  return request.get({ url: '/dashboard/monthly-sales' })
}
