import './assets/main.css'

import { createApp } from 'vue'
import 'uplot/dist/uPlot.min.css'
import { createPinia } from 'pinia'

import 'uno.css'
import 'animate.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
