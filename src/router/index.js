import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: () => import('../views/Manager.vue'),
    redirect: '/home',  // 重定向到主页
    children: [
      { path: '403', name: 'NoAuth', meta: { name: '无权限' }, component: () => import('../views/manager/403') },
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/manager/Home') },
      { path: 'admin', name: 'Admin', meta: { name: '管理员信息' }, component: () => import('../views/manager/Admin') },
      { path: 'adminPerson', name: 'AdminPerson', meta: { name: '个人信息' }, component: () => import('../views/manager/AdminPerson') },
      { path: 'password', name: 'Password', meta: { name: '修改密码' }, component: () => import('../views/manager/Password') },
      { path: 'notice', name: 'Notice', meta: { name: '公告信息' }, component: () => import('../views/manager/Notice') },
      { path: 'user', name: 'User', meta: { name: '用户信息' }, component: () => import('../views/manager/User') },
      { path: 'pages', name: 'Pages', meta: { name: '问卷信息' }, component: () => import('../views/manager/Pages') },
      { path: 'question', name: 'Question', meta: { name: '题目信息' }, component: () => import('../views/manager/Question') },
      { path: 'questionItem', name: 'QuestionItem', meta: { name: '题目内容' }, component: () => import('../views/manager/QuestionItem') },
      { path: 'answer', name: 'Answer', meta: { name: '答题信息' }, component: () => import('../views/manager/Answer') },
      { path: 'logs', name: 'Logs', meta: { name: '操作日志' }, component: () => import('../views/manager/Logs') },
    ]
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/Front.vue'),
    children: [
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/front/Home') },
      { path: 'person', name: 'Person', meta: { name: '个人信息' }, component: () => import('../views/front/Person') },
      { path: 'pages', name: 'FPages', meta: { name: '问卷模板' }, component: () => import('../views/front/Pages') },
      // { path: 'echarts', name: 'Echarts', meta: { name: '数据分析' }, component: () => import('../views/front/Echarts') },
      { path: 'contactus', name: 'Contactus', meta: { name: '客服中心' }, component: () => import('../views/front/Contactus') },
      { path: 'preview', name: 'Preview', meta: { name: '问卷预览' }, component: () => import('../views/front/Preview') },
      { path: 'design', name: 'Design', meta: { name: '设计问卷' }, component: () => import('../views/front/Design') },
    ]
  },
  { path: '/realPage', name: 'RealPage', meta: { name: '调查问卷' }, component: () => import('../views/front/RealPage') },
  { path: '/thanks', name: 'Thanks', meta: { name: '感谢' }, component: () => import('../views/front/Thanks') },
  { path: '/login', name: 'Login', meta: { name: '登录' }, component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', meta: { name: '注册' }, component: () => import('../views/Register.vue') },
  { path: '*', name: 'NotFound', meta: { name: '无法访问' }, component: () => import('../views/404.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注：不需要前台的项目，可以注释掉该路由守卫
// 路由守卫
// router.beforeEach((to ,from, next) => {
//   let user = JSON.parse(localStorage.getItem("xm-user") || '{}');
//   if (to.path === '/') {
//     if (user.role) {
//       if (user.role === 'USER') {
//         next('/front/home')
//       } else {
//         next('/home')
//       }
//     } else {
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })

export default router
