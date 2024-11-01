<template>
  <div class="main-content">
    <div class="thanks-container">
      <div class="thanks-message">
        <img src="@/assets/imgs/logo.png" alt="Logo" class="logo" />
        <div class="message-text">
          <p>感谢您的参与！</p>
          <p>我们将继续努力为您提供更好的服务。</p>
          <p>天天开心喵！</p>
        </div>
      </div>
      <!-- <div class="return-home">
        <el-button size="medium" type="primary" @click="closeWin"
          >关 闭</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Thanks",
  methods: {
    closeWin() {
      window.close();
    },
  },
};
</script>

<style scoped>
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
}

.thanks-container {
  position: relative; /* 让伪元素相对于该容器定位 */
  text-align: center;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  animation: pop-in 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  overflow: hidden; /* 隐藏溢出的粒子 */
}

.thanks-message {
  font-size: 28px;
  color: #409eff;
  margin-bottom: 30px;
  animation: slide-in 1s ease-out, color-change 6s infinite alternate;
}

.message-text {
  font-size: 20px;
  line-height: 1.6;
}

.return-home {
  margin-top: 30px;
}

.return-home a {
  font-size: 20px;
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid transparent;
}

.return-home a:hover {
  color: #0050b3;
  border-color: #0050b3;
}

.logo {
  font-size: 48px;
  margin-right: 15px;
  display: inline-block;
  animation: float 3s infinite ease-in-out alternate;
}

/* 添加粒子效果 */
.thanks-container::before {
  content: "";
  position: absolute;
  top: -50px; /* 调整粒子的起始位置 */
  left: -50px; /* 调整粒子的起始位置 */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.3);
  animation: particles 4s linear infinite;
}

.thanks-container::after {
  content: "";
  position: absolute;
  bottom: -50px; /* 调整粒子的起始位置 */
  right: -50px; /* 调整粒子的起始位置 */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.3);
  animation: particles 4s linear infinite;
}

/* 定义粒子动画 */
@keyframes particles {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes slide-in {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes color-change {
  0% {
    color: #409eff;
  }
  50% {
    color: #67c23a;
  }
  100% {
    color: #409eff;
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
