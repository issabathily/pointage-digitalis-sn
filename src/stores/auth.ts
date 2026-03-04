import { defineStore } from "pinia"
import axios from 'axios'


interface User {
  id: number
  nom: string
  role: "ADMIN" | "MANAGER" | "EMPLOYE"
  congeRestant: number
}
const DEV_MODE = true
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "ADMIN",
    isManager: (state) => state.user?.role === "MANAGER",
    isEmploye: (state) => state.user?.role === "EMPLOYE",
  },

  actions: {

    devLogin(role: 'ADMIN' | 'MANAGER' | 'EMPLOYE') {
      if (!DEV_MODE) return
    let fakeId = 1

        if (role === "ADMIN") fakeId = 1
        if (role === "MANAGER") fakeId = 2
        if (role === "EMPLOYE") fakeId = 3

  const fakeUser: User = {
    id: fakeId,
    nom: "Dev User",
    role,
    congeRestant: 24
  }
      this.token = "dev-token"
      this.user = fakeUser

      localStorage.setItem("token", "dev-token")
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem("token")
    }
  }
})

/*export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "ADMIN",
    isManager: (state) => state.user?.role === "MANAGER",
    isEmploye: (state) => state.user?.role === "EMPLOYE",
  },

  actions: {
  async login(email: string, password: string) {
  const response = await axios.post(
    "http://192.168.1.8:8000/api/auth/login/",
    { email, password }
  )

  const token = response.data.token as string
  const DEV_MODE = true

  this.token = token
  localStorage.setItem("token", token)

  await this.fetchMe()
},
    async fetchMe() {
      const response = await axios.get(
        "http://192.168.1.8:8000/api/auth/me/",
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      )

      this.user = response.data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem("token")
    }
  }
})*/

