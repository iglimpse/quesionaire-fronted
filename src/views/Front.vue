<template>
  <div>
    <div class="front-notice-container">
      <div class="front-notice">
        <i class="el-icon-bell" style="margin-right: 2px"></i>公告：{{ top }}
      </div>
      <!-- <div class="" style="padding: ">
      您好，{{ user?.name }}！欢迎使用问卷精灵
      <a href="/home" style="margin-left: 20px" target="_blank">进入后台首页</a>
      </div> -->
      <div class="date-time">{{ currentDateTime }}</div>
    </div>
    <!--头部-->
    <div class="front-header">
      <div class="front-header-left">
        <img src="@/assets/imgs/logo.png" alt="" />
        <div class="title">
          问卷精灵
          <div class="subtitle">SurveySprite</div>
        </div>
      </div>

      <div class="front-header-center">
        <div class="front-header-nav">
          <el-menu :default-active="$route.path" mode="horizontal" router>
            <el-menu-item index="/front/home">首页</el-menu-item>
            <el-menu-item index="/front/pages">问卷模板</el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="front-header-right">
        <div v-if="!user.username">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown>
            <div class="front-header-dropdown">
              <img :src="user.avatar" alt="" />
              <div style="margin-left: 10px">
                <span>{{ user.name }}</span
                ><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- 使用 router-link 设置客服中心菜单项 -->
              <el-dropdown-item style="font-size: 14px; padding: 5px">
                <router-link
                  :to="{ path: '/front/contactus' }"
                  class="router-link-active"
                  ><i class="el-icon-headset"></i>客服中心</router-link
                >
              </el-dropdown-item>
              <!-- 使用 router-link 设置个人中心菜单项 -->
              <el-dropdown-item style="font-size: 14px; padding: 5px">
                <router-link
                  :to="{ path: '/front/person' }"
                  class="router-link-active"
                  ><i class="el-icon-user-solid"></i>个人中心</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px">
                <div class="router-link-active" @click="logout">
                  <i class="el-icon-switch-button"></i>退出
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!--主体-->
    <div class="main-body">
      <router-view ref="child" @update:user="updateUser" />
    </div>
  </div>
</template>

<script>
export default {
  name: "FrontLayout",

  data() {
    return {
      top: "",
      notice: [],
      user: JSON.parse(localStorage.getItem("xm-user") || "{}"),
      currentDateTime: "",
    };
  },

  mounted() {
    this.loadNotice();
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  methods: {
    loadNotice() {
      this.$request.get("/notice/selectAll").then((res) => {
        this.notice = res.data;
        let i = 0;
        if (this.notice && this.notice.length) {
          this.top = this.notice[0].content;
          setInterval(() => {
            this.top = this.notice[i].content;
            i++;
            if (i === this.notice.length) {
              i = 0;
            }
          }, 2500);
        }
      });
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem("xm-user") || "{}"); // 重新获取下用户的最新信息
    },
    // 退出登录
    logout() {
      localStorage.removeItem("xm-user");
      this.$router.push("/login");
    },
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDay = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ][now.getDay()];
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      this.currentDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds} ${weekDay}`;
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/front.css";
</style>