<template>
  <div class="manager-container">
    <!--  头部  -->
    <div class="manager-header">
      <div class="manager-header-left">
        <img src="@/assets/imgs/logo.png" />
        <div class="title">问卷后台管理
          <div class="subtitle">SurveySprite</div>
        </div>
      </div>

      <div class="manager-header-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: $route.path }">{{
            $route.meta.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="manager-header-right">
        <el-dropdown placement="bottom">
          <div class="avatar">
            <img
              :src="
                user.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
            />
            <div>{{ user.name || "管理员" }}</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style=" color:black; font-size: 14px" @click.native="logout"><i class="el-icon-switch-button"></i>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--  主体  -->
    <div class="manager-main">
      <!--  侧边栏  -->
      <div class="manager-main-left">
        <el-menu
          :default-openeds="['info', 'user', 'message', 'setting']"
          router
          style="border: none"
          :default-active="$route.path"
        >
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="info">
            <template slot="title">
              <i class="el-icon-s-order"></i><span>问卷管理</span>
            </template>
            <el-menu-item index="/pages"
              ><i class="el-icon-document"></i>问卷信息</el-menu-item
            >
            <el-menu-item index="/answer"
              ><i class="el-icon-s-claim"></i>答题信息</el-menu-item
            >
          </el-submenu>

          <el-submenu index="user">
            <template slot="title">
              <i class="el-icon-s-custom"></i><span>用户管理</span>
            </template>
            <el-menu-item index="/admin"
              ><i class="el-icon-user-solid"></i>管理员信息</el-menu-item
            >
            <el-menu-item index="/user"
              ><i class="el-icon-user"></i>用户信息</el-menu-item
            >
          </el-submenu>

          <el-submenu index="message">
            <template slot="title">
              <i class="el-icon-chat-dot-round"></i><span>信息处理</span>
            </template>
            <!--el-menu-item index="/help">帮助中心</el-menu-item>
            <el-menu-item index="/feedback">意见箱</el-menu-item-->
            <el-menu-item index="/notice"
              ><i class="el-icon-office-building"></i>公告信息</el-menu-item
            >
            <el-menu-item index="/logs"
              ><i class="el-icon-chat-line-square"></i>操作日志</el-menu-item
            >
          </el-submenu>

          <el-submenu index="setting">
            <template slot="title">
              <i class="el-icon-s-tools"></i><span>设置</span>
            </template>
            <el-menu-item index="/adminperson"
              ><i class="el-icon-mobile-phone"></i>个人信息</el-menu-item
            >
            <el-menu-item index="/password"
              ><i class="el-icon-unlock"></i>修改密码</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </div>

      <!--  数据表格  -->
      <div class="manager-main-right">
        <router-view @update:user="updateUser" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Manager",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("xm-user") || "{}"),
    };
  },
  created() {
    if (!this.user.id || this.user.role !== "ADMIN") {
      this.$router.push("/login");
    }
  },
  methods: {
    updateUser() {
      this.user = JSON.parse(localStorage.getItem("xm-user") || "{}"); // 重新获取下用户的最新信息
    },
    logout() {
      localStorage.removeItem("xm-user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/manager.css";
</style>