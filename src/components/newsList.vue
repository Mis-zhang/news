<template>
  <div class="newsList" id="newsList">
    <!-- 导航 -->
    <van-row>
      <van-col span="24">
        <van-nav-bar title="详情" left-arrow :right-text="rightTitle" fixed :z-index="999" id="news_nav" @click-left="onClickLeft" @click-right="onClickRight" />
      </van-col>
    </van-row>

    <div class="wrapper" id="wrapper">
      <div class="list_title">{{ infoList.title }}</div>
      <div class="list_sourcetime">
        <div class="list_source">来源：{{ infoList.source }}</div>
        <div class="list_time">{{ infoList.publishTime | formatDate }}</div>
      </div>
      <div class="list_img" v-bind:style="{'display':infoList.defaultImg === null || infoList.defaultImg ==='' ? 'none':'block'}">
        <img v-lazy="imgPath + infoList.defaultImg" alt="">
      </div>
      <div class="list_content">
        {{ infoList.content }}
      </div>
      <div class="list_last">
        <div class="author">作者：{{ infoList.author }}</div>
        <div class="editor">责任编辑：{{ infoList.publishPerson }}</div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "newsList",
    data() {
      return {
        globKey: "YjU5YTA3NzEtMDI2MS00YzhiLTljM2ItYzE2MTljZDQwNDNhNGExYjEzZTUtYmIx",
        imgPath: "",
        articleId: "",
        token: null,
        infoList: {},
        infoListImg: false,
        rightTitle: '',
        isFollow: ''
      };
    },
    filters: {
      formatDate: function(value) {
        let date = new Date(value)
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? "0" + MM : MM
        let d = date.getDate()
        d = d < 10 ? "0" + d : d
        let h = date.getHours()
        h = h < 10 ? "0" + h : h
        let m = date.getMinutes()
        m = m < 10 ? "0" + m : m
        let s = date.getSeconds()
        s = s < 10 ? "0" + s : s
        return y + "." + MM + "." + d
      }
    },
    created() {
      this.imgPath = this.$img
      this.articleId = this.$route.query.articleId ? this.$route.query.articleId : this.$route.params.articleId
      this.token = this.$route.query.token ? this.$route.query.token : this.$route.params.token
      this.getInfoList()
    },
    methods: {
      getInfoList() {
        var sign = this.$md5(
            "articleId=" + this.articleId + "&token=" + this.token + "&key=" + this.globKey
          ),
          that = this
        this.axios
          .post(
            "/api/user/article/info",
            this.qs.stringify({
              articleId: that.articleId,
              token: that.token,
              sign: sign
            })
          )
          .then(function(res) {
            that.infoList = res.data.data.article
            that.isFollow = res.data.data.article.isFollow
            if (res.data.data.article.isFollow === 0) {
              that.rightTitle = '关注'
            } else if (res.data.data.article.isFollow === 1) {
              that.rightTitle = '取消关注'
            } else if (res.data.data.article.isFollow === null) {
              that.rightTitle = '关注'
            }
          })
          .catch(function(err) {
            if (err.response) {
              console.log(err.response)
            }
          });
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      onClickRight() {
        if (this.token === null || this.token === "(null)") {
          this.rightTitle = '关注'
          let ua = navigator.userAgent.toLowerCase();
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            //Ios
            window.webkit.messageHandlers.isLogin.postMessage(null)
          } else if (/(Android)/i.test(navigator.userAgent)) {
            //Android终端
            window.mobile.isLogin()
          }
        } else {
          var sign = this.$md5("articleId=" + this.articleId + "&token=" + this.token + "&key=" + this.globKey),
            that = this
          this.axios
            .post(
              "/api/user/follow/article",
              this.qs.stringify({
                articleId: that.articleId,
                token: that.token,
                sign: sign
              })
            )
            .then(function(res) {
              if (res.data.result.code === '200' && res.data.result.message === "取消关注成功！") {
                that.$toast.success('取消关注')
                that.rightTitle = '关注'
              } else if (res.data.result.code === '200' && res.data.result.message === "关注成功！") {
                that.$toast.success('关注成功')
                that.rightTitle = '取消关注'
              }
            })
            .catch(function(err) {
              if (err.response) {
                console.log(err.response)
                that.$toast.fail('请求失败，请重试');
              }
            });
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == "/news") {
        to.meta.keepAlive = true
      } else {
        to.meta.keepAlive = false
      }
      next()
    }
  };
</script>

<style scoped>
  .newsList {
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    padding: 0rem 0.7rem;
    margin-bottom: 0.5rem;
    background: #fff;
    margin-top: 2.453333rem;
  }

  .wrapper .list_title {
    width: 100%;
    color: rgb(51, 51, 51);
    font-size: 0.9rem;
    padding: 0.5333rem 0rem;
  }

  .wrapper .list_sourcetime {
    width: 100%;
    display: flex;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid #f8f8f8;
  }

  .wrapper .list_sourcetime .list_source,
  .wrapper .list_sourcetime .list_time {
    font-size: 0.8rem;
    color: rgb(153, 153, 153);
  }

  .wrapper .list_sourcetime .list_time {
    padding-left: 2rem;
  }

  .wrapper .list_img {
    width: 85%;
    margin: 0 auto;
    padding: 1rem 0rem 1.3rem 0rem;
    text-align: center;
  }

  .wrapper .list_img>img {
    max-width: 100%;
    height: auto;
  }

  img[lazy="loading"] {
    max-width: 100%;
    height: auto;
    margin: auto;
  }

  img[lazy="error"] {
    max-width: 100%;
    height: auto;
    margin: auto;
  }

  .wrapper .list_content {
    width: 100%;
    font-size: 0.8rem;
    color: rgb(102, 102, 102);
    padding: 1rem 0rem 1rem 0rem;
  }

  .wrapper .list_last {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 0rem 0.5rem 0rem;
  }

  .wrapper .list_last .author,
  .wrapper .list_last .editor {
    font-size: 0.8rem;
    color: rgb(153, 153, 153);
  }
</style>
