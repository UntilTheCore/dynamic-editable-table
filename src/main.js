import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'virtual:uno.css'
import { registerDirective } from "@/utils/directive.js";

const app = createApp(App)

app.use(createPinia())
app.use(router)

registerDirective(app);

app.mount('#app')
