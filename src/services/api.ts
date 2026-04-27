import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Session expirée / invalide: repartir sur une session propre
      sessionStorage.removeItem("token")
      localStorage.removeItem("token")
      sessionStorage.removeItem("manager:qr:session")
      localStorage.removeItem("manager:qr:session")

      if (typeof window !== "undefined") {
        const current = window.location.pathname
        if (!current.startsWith("/login")) {
          window.location.assign("/login")
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api

