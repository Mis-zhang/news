<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
     <transition :name="transitionName">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        transitionName: ''
      }
    },
    watch: {
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }
      }
    }
  }
</script>

<style>
  #app {
    width: 100%;
    position: relative;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    background: #f7f7f7;
    font-family: 'MicrosoftYaHei';
  }

  .van-nav-bar {
    background-color: rgb(124, 196, 118);
  }

  .van-nav-bar .van-icon {
    color: #fff;
    vertical-align: middle;
  }

  .van-nav-bar__title {
    color: #fff;
  }
  .van-nav-bar__text {
    color: #fff;
  }

  .van-tab--active {
    color: #7cc576;
  }

  .ellipsis3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .ellipsis2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ellipsis1 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 200ms;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .van-pull-refresh {
    overflow: scroll;
  }

  /* 进度条 */
  #nprogress .bar {
    background: rgb(124, 196, 118) !important;
  }
  .spinner {
    display: none !important;
  }
</style>
