import api from "./api"

export interface Absence {
  id: number
  userId: number
  nom: string
  prenom: string
  role: "EMPLOYE" | "MANAGER" | "ADMIN"
  type: string
  motif: string
  dateDebut: string
  dateFin: string
  statut: "EN_ATTENTE" | "VALIDEE" | "REFUSEE"
  validatedBy?: string
  validatedByRole?: "MANAGER" | "ADMIN"
}

export function mapAbsence(raw: any): Absence {
  const user = raw.user || {}
  return {
    id: Number(raw.id),
    userId: Number(raw.user),
    nom: user.nom || "",
    prenom: user.prenom || "",
    role: user.role || "EMPLOYE",
    type: raw.typeAbsence || "",
    motif: raw.motif || "",
    dateDebut: raw.dateDebut,
    dateFin: raw.dateFin,
    statut: raw.statut,
    validatedBy: raw.validatedBy,
    validatedByRole: raw.validatedByRole,
  }
}

export const getAbsences = async (): Promise<Absence[]> => {
  const response = await api.get("/absences/")
  const list = Array.isArray(response.data) ? response.data : response.data?.results ?? []
  return list.map(mapAbsence)
}

export const createAbsence = async (data: {
  typeAbsence: string
  motif: string
  dateDebut: string
  dateFin: string
}): Promise<Absence> => {
  const response = await api.post("/absences/", data)
  return mapAbsence(response.data)
}

export const validerAbsence = async (id: number): Promise<void> => {
  await api.put(`/absences/${id}/valider/`)
}

export const rejeterAbsence = async (id: number): Promise<void> => {
  await api.put(`/absences/${id}/rejeter/`)
}
