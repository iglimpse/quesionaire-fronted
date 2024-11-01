<template>
  <div class="container">
    <img src="@/assets/imgs/logo.png" alt="Logo" class="logo" />
    <div class="form-container">
      <div class="title">问卷精灵</div>
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="请输入账号"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option value="ADMIN" label="管理员"></el-option>
            <el-option value="USER" label="用户"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="slider">
          <div class="slider-container">
            <vue-slider
              v-model="sliderValue"
              :min="0"
              :max="100"
              :interval="1"
              :lazy="true"
              :adsorb="true"
              :tooltip="false"
              :dot-size="[40, 40]"
              :disabled="sliderVerified"
              @change="onSliderChange"
              :dot-style="dotStyle"
              :rail-style="railStyle"
              :process-style="processStyle"
            ></vue-slider>
            <div v-if="!sliderVerified" class="slider-message">
              请拖动滑块到最右边
            </div>
            <div v-else class="slider-message slider-verified">验证通过</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="login"
            :disabled="!sliderVerified"
            >登 录</el-button
          >
        </el-form-item>
        <div class="register-link">
          <span>还没有账号？请 <a href="/register">注册</a></span>
        </div>
      </el-form>
    </div>

    <el-dialog
      title="用户须知"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div
        style="
          color: red;
          font-size: 16px;
          line-height: 26px;
          margin-bottom: 20px;
        "
      >
        <strong style="color: #4d1cc0">欢迎使用问卷精灵（SurveySprite）</strong>
        <p>
          本系统是一个功能全面、用户友好的Web端问卷调查系统，通过本系统，您可以创建、分发和分析问卷调查。本系统支持多种问卷题型，提供实时数据分析和结果展示功能，适用于市场调查、学术研究、用户反馈等多个应用场景。
        </p>
      </div>
      <div style="text-align: center">
        <img
          src="@/assets/imgs/SurveySprite.png"
          alt="SurveySprite"
          style="width: 200px; height: 200px"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="center-button">
          <el-button
            type="primary"
            @click="closeDialog"
            style="background-color: #4d1cc0; border-color: #4d1cc0"
            >点此开始使用</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "Login",
  components: {
    VueSlider,
  },
  data() {
    return {
      dialogVisible: false,
      form: { role: "USER" },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      sliderValue: 0,
      sliderVerified: false,
      dotStyle: {
        backgroundColor: "#cccccc", // 灰色
        borderColor: "#cccccc", // 灰色
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        borderRadius: "0",
      },
      railStyle: {
        height: "40px",
        backgroundColor: "#e0e0e0",
        borderRadius: "0",
      },
      processStyle: {
        backgroundColor: "#cccccc", // 灰色
        height: "40px",
        borderRadius: "0",
      },
    };
  },
  created() {
    this.checkDialogVisibility();
  },
  methods: {
    login() {
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          this.$request.post("/login", this.form).then((res) => {
            if (res.code === "200") {
              localStorage.setItem("xm-user", JSON.stringify(res.data));
              this.$message.success("登录成功");
              setTimeout(() => {
                if (res.data.role === "USER") {
                  location.href = "/front/home";
                } else {
                  location.href = "/home";
                }
              }, 500);
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    checkDialogVisibility() {
      const lastShownTime = localStorage.getItem("dialogShownTime");
      const now = new Date().getTime();
      const oneMinute = 60 * 1000; // 一分钟的毫秒数

      if (!lastShownTime || now - lastShownTime > oneMinute) {
        this.dialogVisible = true;
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      localStorage.setItem("dialogShownTime", new Date().getTime());
    },
    onSliderChange(value) {
      if (value === 100) {
        this.sliderVerified = true;
      } else {
        setTimeout(() => {
          this.sliderValue = 0; // 未滑到最右边时返回最左边
        }, 100); // 添加一个短暂的延迟，以便视觉上看到滑块返回最左侧
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/imgs/background.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 100px;
  height: auto;
}

.form-container {
  width: 350px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: absolute;
  left: 350px;
}

.title {
  font-size: 26px;
  margin-bottom: 40px;
  color: #333;
}

.login-form {
  text-align: left;
}

.register-link {
  text-align: right;
  margin-top: 10px;
}

.register-link a {
  color: #2a60c9;
  text-decoration: none;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.notice {
  color: #4d1cc0;
  font-size: 16px;
  line-height: 26px;
  margin-bottom: 20px;
}

.survey-sprite img {
  width: 200px;
  height: 200px;
}

.slider-container {
  position: relative;
  margin: -20px 0 20px 0; /* 调整滑动条与上下控件的间距 */
}

.slider-message {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #2d2d23;
  white-space: nowrap;
  z-index: 1; /* 确保文字在滑动条图层之上 */
  font-weight: bold;
}

.slider-verified {
  color: #000000;
  font-weight: bold;
}
</style>
