<script setup>
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { set } from 'lodash-es'
import { getUserAccessSourceApi, getWeeklyActivityApi, getMonthlySalesApi } from '@/api'

import { useAppStore } from '@/store/modules/app'

const loading = ref(true)

const appStore = useAppStore()
const isDark = computed(() => appStore.getIsDark)

const pieOptionsData = reactive(pieOptions)

// 仪器状态分布
const getUserAccessSource = async () => {
  try {
    const result = await getUserAccessSourceApi()
    console.log('仪器状态分布数据:', result)
    if (result && Array.isArray(result)) {
      set(pieOptionsData, 'series[0].data', result)
      // 更新 legend 数据
      const legendData = result.map(item => item.name)
      set(pieOptionsData, 'legend.data', legendData)
    }
  } catch (error) {
    console.error('获取仪器状态分布失败:', error)
  }
}

const barOptionsData = reactive(barOptions)

// 周活跃量
const getWeeklyUserActivity = async () => {
  try {
    const result = await getWeeklyActivityApi()
    console.log('周活跃量数据:', result)
    if (result && result.list && Array.isArray(result.list)) {
      const values = result.list.map(item => item.value)
      set(barOptionsData, 'series[0].data', values)
    }
  } catch (error) {
    console.error('获取周活跃量失败:', error)
  }
}

const lineOptionsData = reactive(lineOptions)

// 每月销售总额
const getMonthlySales = async () => {
  try {
    const result = await getMonthlySalesApi()
    console.log('月度销售数据:', result)
    if (result) {
      // 如果返回的是 { list: { estimate, actual } } 格式
      if (result.list && result.list.estimate && result.list.actual) {
        set(lineOptionsData, 'series[0].data', result.list.estimate)
        set(lineOptionsData, 'series[1].data', result.list.actual)
      }
      // 如果返回的是直接 { estimate, actual } 格式
      else if (result.estimate && result.actual) {
        set(lineOptionsData, 'series[0].data', result.estimate)
        set(lineOptionsData, 'series[1].data', result.actual)
      }
    }
  } catch (error) {
    console.error('获取月度销售数据失败:', error)
  }
}

/**
 * 更新 legend.textStyle
 */
const updateLegendTextStyle = (options) => {
  const newTextStyle = {
    color: isDark.value ? '#ccc' : '#333'
  }
  const inactiveColor = isDark.value ? '#abacac' : '#ccc'
  set(options, 'title.textStyle', newTextStyle)
  if (options !== barOptionsData) {
    set(options, 'legend.textStyle', newTextStyle)
    set(options, 'legend.inactiveColor', inactiveColor)
  }
  options === pieOptionsData && set(options, 'series[0].emptyCircleStyle.color', inactiveColor)
}

const getAllApi = async () => {
  await Promise.all([getUserAccessSource(), getWeeklyUserActivity(), getMonthlySales()])
  loading.value = false
}

getAllApi()

// 监听暗黑模式变化并重新更新样式
watch(isDark, () => {
  updateLegendTextStyle(pieOptionsData)
  updateLegendTextStyle(barOptionsData)
  updateLegendTextStyle(lineOptionsData)
})
onMounted(() => {
  updateLegendTextStyle(pieOptionsData)
  updateLegendTextStyle(barOptionsData)
  updateLegendTextStyle(lineOptionsData)
})
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
