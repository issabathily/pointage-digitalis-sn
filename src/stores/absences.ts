import { defineStore } from "pinia"
import { useAuthStore } from "@/stores/auth"


export interface Absence {
  id: number
  userId: number
  nom: string
  prenom: string
  role: "EMPLOYE" | "MANAGER"
  type: string
  motif: string
  dateDebut: string
  dateFin: string
  statut: "EN_ATTENTE" | "VALIDEE" | "REFUSEE"
  validatedBy?: string
  validatedByRole?: "MANAGER" | "ADMIN"
}


export const useAbsencesStore = defineStore("absences", {
  state: () => ({
    absences: [] as Absence[],
  }),

  actions: {

    addAbsence(absence: Absence) {
      this.absences.push(absence)
    },

validateAbsence(id: number) {
  const absence = this.absences.find(a => a.id === id)
  if (!absence) return

  const authStore = useAuthStore()

  absence.statut = "VALIDEE"
  absence.validatedBy = authStore.user?.nom

  if (authStore.user?.role === "ADMIN" || authStore.user?.role === "MANAGER") {
    absence.validatedByRole = authStore.user.role
  }
}, 

    refuseAbsence(id: number) {
  const absence = this.absences.find(a => a.id === id)

  if (!absence) return

  absence.statut = "REFUSEE"
}

  }
})