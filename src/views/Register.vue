<template>
  <div class="container">
    <img src="@/assets/imgs/logo.png" alt="Logo" class="logo">
    <div class="form-container">
      <div class="title">欢迎注册</div>
      <el-form :model="form" :rules="rules" ref="formRef" class="register-form">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
              v-model="form.password"
              @focus="handleFocus('password')"
              @blur="handleBlur('password')"
              @input="validatePassword"
          >
            <template #suffix>
              <span :class="['password-hint', { 'hint-active': passwordFocused && isPasswordValid }]">
                6-20位字母和数字
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
              prefix-icon="el-icon-lock"
              placeholder="请确认密码"
              show-password
              v-model="form.confirmPass"
              @focus="handleFocus('confirmPass')"
              @blur="handleBlur('confirmPass')"
              @input="validateConfirmPass"
          >
            <template #suffix>
              <span :class="['password-hint', { 'hint-active': confirmPassFocused && isConfirmPassValid }]">
                6-20位字母和数字
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="register">注 册</el-button>
        </el-form-item>
        <div class="login-link">
          <span>已有账号？请 <a href="/login">登录</a></span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度必须在6-20位之间'))
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(value)) {
        callback(new Error('密码必须包含字母和数字'))
      } else {
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: { role: 'USER' },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPass: [
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      },
      passwordFocused: false,
      confirmPassFocused: false,
      isPasswordValid: false,
      isConfirmPassValid: false
    }
  },
  methods: {
    register() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/register', this.form).then(res => {
            if (res.code === '200') {
              this.$router.push('/')
              this.$message.success('注册成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleFocus(field) {
      if (field === 'password') {
        this.passwordFocused = true
      } else if (field === 'confirmPass') {
        this.confirmPassFocused = true
      }
    },
    handleBlur(field) {
      if (field === 'password') {
        this.passwordFocused = false
      } else if (field === 'confirmPass') {
        this.confirmPassFocused = false
      }
    },
    validatePassword() {
      this.isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(this.form.password)
    },
    validateConfirmPass() {
      this.isConfirmPassValid = this.form.confirmPass === this.form.password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(this.form.confirmPass)
    }
  }
}
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
  left:350px;
}

.title {
  font-size: 26px;
  margin-bottom: 40px;
  color: #333;
}

.register-form {
  text-align: left;
}

.login-link {
  text-align: right;
  margin-top: 10px;
}

.login-link a {
  color: #2a60c9;
  text-decoration: none;
}

.password-hint {
  font-size: 12px;
  color: red;
  transition: color 0.3s;
}

.hint-active {
  color: blue;
}
</style>
