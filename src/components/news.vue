<template>
  <div class="news" id="news">
    <!-- 导航 -->
    <div class="news_nav">
      <van-row>
        <van-col span="24">
          <van-nav-bar title="新闻资讯" left-arrow fixed :z-index="999" id="news_nav" @click-left="onClickLeft" />
        </van-col>
      </van-row>
    </div>

    <!-- nav-bar -->
    <div class="news_tabs" id="news_tab" style="margin-top:44px;">
      <van-tabs v-model="active" :line-width="0" @click="onClickCategorySub" :offset-top="44" :sticky="sticky">
        <van-tab v-for="(item, index) in categorySub" :title="item.name" :key="index">

        </van-tab>
      </van-tabs>
    </div>

    <!-- banner -->
    <div class="news_banner" v-show="bannerImg">
      <swiper :options="swiperOption" id="news_banner">
        <swiper-slide class="swiper-slide" v-for="(item,index) in images" :key="index" :data-history="'slide' + index">
          <div class="banner_imgs">
            <img v-lazy="imgPath + item.bannerImgs" alt="">
            <!-- <div class="banner_title">{{item.title}}</div> -->
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <div class="news_tabs" id="news_tabs">
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh" id="news_pull">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <div v-for="(item, index) in goodList" :key="index" ref="ban" class="wrapper" @click="getRouter(item.id)">
            <div class="item_tipss">{{ item.title }}</div>
            <div class="item_content">
              <div class="item_text">
                <div class="item_introduce ellipsis3">{{ item.introduce }}</div>
                <div class="item_bottom">
                  <div class="item_source">{{ item.source }}</div>
                  <div class="item_time">{{ item.publishTime | formatDate }}</div>
                </div>
              </div>
              <div class="item_img" v-bind:style="{'display':item.defaultImg == null || item.defaultImg =='' ? 'none':'block'}">
                <img v-lazy="imgPath + item.defaultImg" alt="">
              </div>
            </div>
          </div>
          <div v-show="tipss" class="tipss" id="tipss">暂无数据</div>
          <!-- <div v-show="success" class="success" id="success">已加载全部数据</div> -->
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import "swiper/dist/css/swiper.css";
  import {
    swiper,
    swiperSlide
  } from "vue-awesome-swiper";
  export default {
    name: "news",
    data() {
      return {
        globKey: "YjU5YTA3NzEtMDI2MS00YzhiLTljM2ItYzE2MTljZDQwNDNhNGExYjEzZTUtYmIx",
        tipss: false,
        imgPath: "",
        // success: false,
        bannerImg: true,
        sticky: true,
        swiperOption: {
          autoplay: true,
          effect: "fade",
          loop: true
        },
        images: [],
        parentId: '1',
        // token: "5b000a66-bbc2-473d-8e7f-09d5a631eace",
        token: '',
        active: 0,
        categorySub: [],
        loading: false,
        finished: false,
        page: 1,
        goodList: [],
        categorySubId: "",
        isRefresh: false
      };
    },
    created() {
      this.imgPath = this.$img;
      this.parentId = this.getUrlParam('parentId')
      this.token = this.getUrlParam('token')
      this.getCategorySubByCategoryID();
      this.getBannerImgs();
    },
    filters: {
      formatDate: function(value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        return y + "." + MM + "." + d;
      }
    },
    methods: {
      onClickLeft() {
        let ua = navigator.userAgent.toLowerCase();
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          //Ios
          window.webkit.messageHandlers.isBack.postMessage(null)
        } else if (/(Android)/i.test(navigator.userAgent)) {
          //Android终端
          window.mobile.isBack()
        }
      },
      getBannerImgs() {
        var sign = this.$md5("token=" + this.token + "&key=" + this.globKey),
          that = this;
        this.axios
          .post(
            "/api/user/article/banner",
            this.qs.stringify({
              token: that.token,
              sign: sign
            })
          )
          .then(function(res) {
            that.images = res.data.data.banners;
            that.bannerImg = res.data.data.bannerNum != 0 ? true : false;
          })
          .catch(function(err) {
            if (err.response) {
              console.log(err.response);
            }
          });
      },
      getCategorySubByCategoryID() {
        var sign = this.$md5(
            "parentId=" +
            this.parentId +
            "&token=" +
            this.token +
            "&key=" +
            this.globKey
          ),
          that = this;
        this.axios
          .post(
            "/api/user/article/category",
            this.qs.stringify({
              parentId: that.parentId,
              token: that.token,
              sign: sign
            })
          )
          .then(function(res) {
            if (res.data.result.code == 200 && res.data.data.list) {
              that.categorySub = res.data.data.list;
              that.active = 0;
              that.categorySubId = that.categorySub[0].id;
              that.onLoad();
            } else {
              that.$toast("服务器错误，数据取得失败");
            }
          })
          .catch(function(err) {
            if (err.response) {
              console.log(err.response);
            }
          });
      },
      onLoad() {
        setTimeout(() => {
          this.categorySubId = this.categorySubId ?
            this.categorySubId :
            this.categorySub[0].id;
          this.getGoodList();
        }, 300);
      },
      onRefresh() {
        setTimeout(() => {
          this.isRefresh = false;
          this.finished = false;
          this.list = [];
          this.onLoad();
        }, 300);
      },
      getGoodList() {
        var sign = this.$md5(
            "categoryId=" +
            this.categorySubId +
            "&page=" +
            this.page +
            "&token=" +
            this.token +
            "&key=" +
            this.globKey
          ),
          that = this;
        this.axios
          .post(
            "/api/user/article/list",
            this.qs.stringify({
              categoryId: that.categorySubId,
              page: that.page,
              token: that.token,
              sign: sign
            })
          )
          .then(function(res) {
            if (res.data.result.code == 200 && res.data.data.rows.length != 0) {
              that.goodList = [];
              that.page++;
              that.goodList = that.goodList.concat(res.data.data.rows);
              // that.success = false
            } else {
              that.finished = true;
              // that.success = true
            }
            that.tipss = res.data.data.totalrows != 0 ? false : true;
            that.loading = false;
          })
          .catch(function(err) {
            if (err.response) {
              console.log(err.response);
            }
          });
      },
      onClickCategorySub(index, title) {
        this.categorySubId = this.categorySub[index].id;
        this.goodList = [];
        this.finished = false;
        // this.success = false
        this.page = 1;
        this.onLoad();
      },
      getRouter(articleId) {
        this.$router.push({
          name: "newsList",
          params: {
            articleId: articleId,
            token: this.token
          }
        });
      },
      //  getUrlParam(params) {
      //   var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
      //   var r = window.location.search.substr(1).match(reg);
      //   if (r !== null) {
      //     return unescape(r[2])
      //   }
      //   return null;
      // }

      getUrlParam(name) {
        return (
          decodeURIComponent(
            (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
              location.href
            ) || [, ""])[1].replace(/\+/g, "%20")
          ) || null
        );
      }
    },
    beforeRouteLeave: (to, from, next) => {
      from.meta.keepAlive = false;
      next();
    },
    mounted() {
      let navHeight = document.getElementById("news_nav").clientHeight;
      let tabsHeight = document.getElementById("news_tab").clientHeight;
      let bannerHeight = document.getElementById("news_banner").clientHeight;
      let winHeight = document.documentElement.clientHeight;
      document.getElementById("news_tabs").style.height =
        winHeight - tabsHeight - bannerHeight - navHeight + "px";
      document.getElementById("news_pull").style.height =
        winHeight - tabsHeight - bannerHeight - navHeight + "px";
      document.getElementById("tipss").style.height =
        winHeight - tabsHeight - bannerHeight - navHeight + "px";
    },
    components: {
      swiper,
      swiperSlide
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .news {
    width: 100%;
    position: relative;
  }

  .tipss {
    width: 100%;
    font-size: 0.8rem;
    color: rgb(153, 153, 153);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .success {
    width: 100%;
    font-size: 0.8rem;
    padding: 0.7rem 0rem;
    color: rgb(153, 153, 153);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .news_nav {
    width: 100%;
  }

  .news_banner {
    width: 100%;
    height: 10.03rem;
  }

  .swiper-slide {
    height: 10.03rem;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .banner_imgs {
    width: 100%;
    position: relative;
  }

  .banner_imgs .banner_title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2.4rem;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    line-height: 2.4rem;
    overflow: hidden;
  }

  #news_tabs {
    overflow: scroll;
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    padding: 0rem 0.5333rem 0.5333rem 0.5333rem;
    margin-bottom: 0.5rem;
    background: #fff;
  }

  .wrapper:last-child {
    margin-bottom: 0rem;
  }

  .wrapper .item_tipss {
    width: 100%;
    color: rgb(51, 51, 51);
    font-size: 0.9rem;
    padding: 0.5333rem 0rem;
  }

  .wrapper .item_content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .item_content .item_text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item_text .item_introduce {
    width: 100%;
    font-size: 0.8rem;
    color: rgb(153, 153, 153);
  }

  .item_text .item_bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .item_text .item_bottom .item_source,
  .item_text .item_bottom .item_time {
    color: rgb(204, 204, 204);
    font-size: 0.7rem;
    padding: 0.5rem 0rem 0rem 0rem;
  }

  .item_content .item_img {
    width: 5.266rem;
    height: 4.2666rem;
    padding-left: 1rem;
    text-align: center;
  }
</style>
