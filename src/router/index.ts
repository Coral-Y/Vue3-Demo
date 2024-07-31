import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/Map.vue')
    },
    {
      path: '/eCharts',
      name: 'eCharts',
      component: () => import('../views/ECharts.vue')
    },
    {
      path: '/antvG2',
      name: 'antvG2',
      component: () => import('../views/AntvG2.vue')
    },
    {
      path: '/uPlot',
      name: 'uPlot',
      component: () => import('../views/UPlot.vue')
    },
    {
      path: '/uPlotZoom',
      name: 'uPlotZoom',
      component: () => import('../views/UPlotZoom.vue')
    },
    {
      path: '/Zoom',
      name: 'Zoom',
      component: () => import('../views/myZoom.vue')
    },
    {
      path: '/qrCode',
      name: 'qrCode',
      component: () => import('../views/QrCode.vue')
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
