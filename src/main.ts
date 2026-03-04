import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())

app.use(router)

app.mount('#app')

import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

if (!auth.token) {
  auth.devLogin("ADMIN")
  auth.devLogin("MANAGER")
  auth.devLogin("EMPLOYE")
}