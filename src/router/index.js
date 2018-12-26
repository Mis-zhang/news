import Vue from 'vue'
import Router from 'vue-router'
import news from '@/components/news'
import newsList from '@/components/newsList'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path:'/',
      redirect:'/news'
    },
    {
      path: '/news',
      name: 'news',
      component: news,
      meta: {
        index: 0,
        keepAlive: true
      }
    },
    {
      path: '/newsList',
      name: 'newsList',
      component: newsList,
      meta: {
        index: 1
      }
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})
