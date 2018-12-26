// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Qs from 'qs'
import md5 from 'js-md5'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  Row,
  Col,
  Tab,
  Tabs,
  NavBar,
  Toast,
  Lazyload,
  List,
  PullRefresh
} from 'vant';
Vue.use(Row).use(Col).use(Tab).use(Tabs).use(NavBar).use(Toast).use(List).use(PullRefresh)
Vue.use(Lazyload, {
  error: require('../static/images/error.png'),
  loading: require('../static/images/loading.gif'),
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'],
  preload: 1,
})



Vue.config.productionTip = false
const img = 'http://192.168.1.206:8010/img/'

Vue.prototype.axios = axios
Vue.prototype.qs = Qs
Vue.prototype.$md5 = md5;
Vue.prototype.$img = img

axios.defaults.baseURL = 'http://192.168.1.206:8090/nft'

NProgress.inc()
NProgress.configure({
  easing: 'ease',
  speed: 1000,
  showSpinner: false
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    NProgress.start();
  }
  if (to.path === 'news') {
    // document.getElementById("news").style.display = 'none'
    NProgress.start();
  }
  if (to.path === 'newsList') {
    axios.interceptors.request.use((config) => {
      NProgress.start();
      document.getElementById("newsList").style.display = 'none'
      return config;
    }, (err) => {
      return Promise.reject(err)
    })
    axios.interceptors.response.use((response) => {
      document.getElementById("newsList").style.display = 'block'
      return response;
    }, (err) => {
      return Promise.reject(err);

    })
    NProgress.start();
  }
  next()
});

router.afterEach(() => {
  NProgress.done();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
