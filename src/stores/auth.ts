import { defineStore } from "pinia"
import api from "@/services/api"

interface User {
  id: number
  nom: string
  role: "ADMIN" | "MANAGER" | "EMPLOYE"
  congeRestant: number
}

function normalizeRole(rawRole: unknown): User["role"] | null {
  if (typeof rawRole !== "string") return null

  const normalized = rawRole
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_")

  if (["ADMIN", "ADMINISTRATEUR", "SUPER_ADMIN", "SUPERADMIN"].includes(normalized)) {
    return "ADMIN"
  }

  if (["MANAGER", "GESTIONNAIRE", "RESPONSABLE", "CHEF_SERVICE"].includes(normalized)) {
    return "MANAGER"
  }

  if (["EMPLOYE", "EMPLOYEE", "USER", "STAFF", "COLLABORATEUR"].includes(normalized)) {
    return "EMPLOYE"
  }

  return null
}

function isTruthyFlag(value: unknown): boolean {
  if (value === true || value === 1) return true
  if (typeof value === "string") {
    const v = value.trim().toLowerCase()
    return ["true", "1", "yes", "oui"].includes(v)
  }
  return false
}

function extractRoleDeep(payload: unknown, depth = 0): User["role"] | null {
  if (!payload || depth > 4) return null

  if (typeof payload === "string") {
    return normalizeRole(payload)
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const role = extractRoleDeep(item, depth + 1)
      if (role) return role
    }
    return null
  }

  if (typeof payload !== "object") return null

  const obj = payload as Record<string, unknown>

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase()
    const looksRoleField =
      keyLower.includes("role") ||
      keyLower.includes("profil") ||
      keyLower.includes("type") ||
      keyLower.includes("group") ||
      keyLower.includes("groupe")

    if (looksRoleField) {
      const role = normalizeRole(value)
      if (role) return role
    }

    const nestedRole = extractRoleDeep(value, depth + 1)
    if (nestedRole) return nestedRole
  }

  return null
}

function extractRole(payload: Record<string, any>): User["role"] | null {
  const directCandidates = [
    payload.role,
    payload.user_role,
    payload.userRole,
    payload.type,
    payload.userType,
    payload.profile,
    payload.fonction,
    payload?.user?.role,
    payload?.user?.user_role,
  ]

  for (const candidate of directCandidates) {
    const role = normalizeRole(candidate)
    if (role) return role
  }

  const listCandidates = [
    payload.roles,
    payload.groups,
    payload.authorities,
    payload.permissions,
    payload?.user?.roles,
    payload?.user?.groups,
  ]

  for (const list of listCandidates) {
    if (!Array.isArray(list)) continue
    for (const value of list) {
      const role = normalizeRole(typeof value === "string" ? value : value?.name ?? value?.code)
      if (role) return role
    }
  }

  const deepRole = extractRoleDeep(payload)
  if (deepRole) return deepRole

  if (isTruthyFlag(payload.is_superuser) || isTruthyFlag(payload.is_admin) || isTruthyFlag(payload.is_staff)) {
    return "ADMIN"
  }

  if (isTruthyFlag(payload.is_manager) || isTruthyFlag(payload.manager)) {
    return "MANAGER"
  }

  if (isTruthyFlag(payload.is_employee) || isTruthyFlag(payload.employe)) {
    return "EMPLOYE"
  }

  return null
}

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payloadPart = parts[1]
    if (!payloadPart) return null

    // base64url -> base64
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function readUserFromPayload(payload: Record<string, any>): User | null {
  const p = payload
  if (!p) return null

  const idRaw = p.user_id ?? p.id ?? p.sub
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw)
  const safeId = Number.isFinite(id) ? id : 0

  const role = extractRole(p)
  const nom = (p.nom ?? p.name ?? p.username ?? p.email ?? p?.user?.email ?? "") as string
  const congeRestantRaw = p.congeRestant ?? p.conge_restant ?? p.leaveRemaining ?? 0
  const congeRestant = typeof congeRestantRaw === "number" ? congeRestantRaw : Number(congeRestantRaw) || 0

  if (!role) return null

  return { id: safeId, nom, role, congeRestant }
}

function userFromJwt(token: string): User | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  return readUserFromPayload(payload)
}

function userFromLoginResponse(data: any): User | null {
  if (!data || typeof data !== "object") return null

  const candidates = [
    data.user,
    data.utilisateur,
    data.data?.user,
    data.data,
    data,
  ]

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue
    const user = readUserFromPayload(candidate)
    if (user) return user
  }

  return null
}

async function userFromMeEndpoint(token: string): Promise<User | null> {
  try {
    const response = await api.get("/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.data || typeof response.data !== "object") return null
    return readUserFromPayload(response.data)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore("auth", {

  state: () => ({
    user: null as User | null,
    token: sessionStorage.getItem("token") || localStorage.getItem("token") || null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "ADMIN",
    isManager: (state) => state.user?.role === "MANAGER",
    isEmploye: (state) => state.user?.role === "EMPLOYE",
  },

  actions: {
  
async initFromStorage() {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token")
  if (!token) return

  this.isLoading = true
  this.token = token

  // Migration: si un ancien token est en localStorage, le déplacer en sessionStorage
  if (!sessionStorage.getItem("token") && localStorage.getItem("token")) {
    sessionStorage.setItem("token", token)
    localStorage.removeItem("token")
  }
  try {
    const u = userFromJwt(token)
    if (u) {
      this.user = u
      return
    }

    const me = await userFromMeEndpoint(token)
    if (me) {
      this.user = me
      return
    }

    // On conserve la session meme si le backend ne fournit pas encore le profil.
    this.user = {
      id: 0,
      nom: "Utilisateur",
      role: "EMPLOYE",
      congeRestant: 0,
    }
  } finally {
    this.isLoading = false
  }
},

async login(email: string, password: string) {
  this.isLoading = true
  try {
    // Toujours démarrer une session propre (évite les résidus d'un autre utilisateur)
    this.logout()

    const identifier = email.trim()
    const response = await api.post("/auth/login/", {
      email: identifier,
      username: identifier,
      password: password,
    })
    const token =
      response.data?.access ??
      response.data?.access_token ??
      response.data?.token ??
      response.data?.data?.access ??
      response.data?.data?.access_token ??
      response.data?.data?.token

    if (typeof token !== "string" || token.trim().length === 0) {
      throw new Error("Token d'authentification introuvable dans la réponse login.")
    }

    this.token = token
    sessionStorage.setItem("token", token)
    localStorage.removeItem("token")
    const userFromResponse = userFromLoginResponse(response.data)
    const userFromToken = userFromJwt(token)
    const userFromMe =
      userFromResponse || userFromToken ? null : await userFromMeEndpoint(token)
    const user = userFromResponse ?? userFromToken ?? userFromMe

    if (!user) {
      // Fallback non bloquant: permet de rester connecte meme si /auth/me/ est indisponible.
      this.user = {
        id: Number(response.data?.user_id) || 0,
        nom: response.data?.nom || identifier,
        role: "EMPLOYE",
        congeRestant: 0,
      }
      return
    }

    this.user = user
  } finally {
    this.isLoading = false
  }
},
 
    logout() {
      this.token = null
      this.user = null
      sessionStorage.removeItem("token")
      localStorage.removeItem("token")

      // Nettoyage des données de session (évite de “réutiliser” la session d’un autre compte)
      sessionStorage.removeItem("manager:qr:session")
      localStorage.removeItem("manager:qr:session")
    }

  }

})