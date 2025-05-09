import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from '../src/api/index'

const app = createApp(App)
// 在实例上绑定属性
app.config.globalProperties.$api = api

// 重定向到登录页面
router.beforeEach((to, from) => {
    if (to.path !== '/login' ) {
        if (!localStorage.getItem('h5_token')) {
            return '/login'
        }
    }
})

app.use(router)
app.mount('#app')
