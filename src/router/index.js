import { createRouter, createWebHashHistory } from 'vue-router'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectWrap',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-center',
    name: 'Personal',
    meta: {
      title: t('router.personal'),
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'personal-center',
        component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
        name: 'PersonalCenter',
        meta: {
          title: t('router.personalCenter'),
          hidden: true,
          canTo: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'vi-ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
    ]
  },
  {
    path: '/laboratory',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Laboratory',
    meta: {
      title: '实验室管理',
      icon: 'medical-icon:laboratory',
      alwaysShow: true
    },
    children: [
      {
        path: 'lab',
        component: () => import('@/views/Laboratory/Lab/index.vue'),
        name: 'Lab',
        meta: {
          title: '实验室'
        }
      },
      {
        path: 'appointments',
        component: () => import('@/views/Laboratory/Appointments/index.vue'),
        name: 'Appointments',
        meta: {
          title: '实验室预约'
        }
      },
    ]
  },
  {
    path: '/instrument',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Instrument',
    meta: {
      title: '仪器管理',
      icon: 'arcticons:apparatus',
      alwaysShow: true
    },
    children: [
      {
        path: 'instruments',
        component: () => import('@/views/Instruments/Instruments/index.vue'),
        name: 'Instruments',
        meta: {
          title: '仪器'
        }
      },
      {
        path: 'applications',
        component: () => import('@/views/Instruments/Applications/index.vue'),
        name: 'Applications',
        meta: {
          title: '使用申请'
        }
      },
      {
        path: 'repaires',
        component: () => import('@/views/Instruments/Repaires/index.vue'),
        name: 'Repaires',
        meta: {
          title: '维修记录'
        }
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/authorization/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'arcticons:apparatus',
      alwaysShow: true
    },
    children: [
      {
        path: 'notifications',
        component: () => import('@/views/System/Notifications/index.vue'),
        name: 'Notifications',
        meta: {
          title: '通知'
        }
      },
      {
        path: 'feedback',
        component: () => import('@/views/System/Feedback/index.vue'),
        name: 'Feedback',
        meta: {
          title: '反馈管理'
        }
      },
      {
        path: 'dynamic',
        component: () => import('@/views/System/Dynamic/index.vue'),
        name: 'Dynamic',
        meta: {
          title: '动态管理'
        }
      },
    ]
  },
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: t('router.authorization'),
      icon: 'vi-eos-icons:role-binding',
      alwaysShow: true
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/Authorization/Role/Role.vue'),
        name: 'Role',
        meta: {
          title: t('router.role')
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app) => {
  app.use(router)
}

export default router
