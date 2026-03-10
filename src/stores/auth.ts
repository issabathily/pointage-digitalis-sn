import { defineStore } from "pinia"
import axios from "axios"

const API = "https://projet-de-pointage-digitalis-3.onrender.com/api"

interface User {
  id: number
  nom: string
  role: "ADMIN" | "MANAGER" | "EMPLOYE"
  congeRestant: number
}

export const useAuthStore = defineStore("auth", {

  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
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
    `${API}/auth/login/`,
    {
      email: email,
      password: password
    }
  )
    const token = response.data.access

  this.token = token
  localStorage.setItem("token", token)
},
 
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem("token")
    }

  }

})