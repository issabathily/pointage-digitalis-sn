import api from "./api"

export interface Employee {
  id: number
  nom: string
  role: string
  statut: string
}

function normalizeStatut(raw: unknown): string {
  if (typeof raw !== "string") return "Inactif"
  const v = raw.trim().toUpperCase()
  if (v === "ACTIF") return "Actif"
  if (v === "INACTIF") return "Inactif"
  if (v === "ABSENT") return "Absent"
  return raw
}

export interface NewEmployee {
  nom: string
  prenom: string
  email: string
  role: "ADMIN" | "MANAGER" | "EMPLOYE"
  statut?: "ACTIF" | "INACTIF"
  password?: string
}

export const getEmployees = async () => {
  const response = await api.get("/users/")
  const data = response.data
  const list = Array.isArray(data) ? data : data?.results ?? []

  return (list as any[]).map((u): Employee => ({
    id: Number(u.id) || 0,
    nom: [u.nom, u.prenom].filter(Boolean).join(" ").trim() || u.email || "Utilisateur",
    role: typeof u.role === "string" ? u.role : "EMPLOYE",
    statut: normalizeStatut(u.statut),
  }))
}

export const createEmployee = async (payload: NewEmployee): Promise<Employee> => {
  const response = await api.post("/users/", payload)
  const u = response.data
  return {
    id: Number(u.id) || 0,
    nom: [u.nom, u.prenom].filter(Boolean).join(" ").trim() || u.email || "Utilisateur",
    role: typeof u.role === "string" ? u.role : "EMPLOYE",
    statut: normalizeStatut(u.statut),
  }
}
