import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)  //Tao app tu App.vue (Init Option API)
app.use(router)             //Su dung router
app.mount('#app')          //Gan app vao the co id la app trong index.html 

