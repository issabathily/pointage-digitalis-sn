import axios from "axios"

const api = axios.create({
  baseURL: "https://projet-de-pointage-digitalis-3.onrender.com/", // à adapter selon backend
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
