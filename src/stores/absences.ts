import { defineStore } from "pinia"
import { useAuthStore } from "@/stores/auth"
import { getAbsences, createAbsence, validerAbsence, rejeterAbsence } from "@/services/absences.service"

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

export const useAbsencesStore = defineStore("absences", {
  state: () => ({
    absences: [] as Absence[],
    loading: false,
    error: "" as string,
  }),

  actions: {
    async loadAbsences() {
      this.loading = true
      this.error = ""
      try {
        this.absences = await getAbsences()
      } catch (e: any) {
        this.error = e?.response?.data?.error || "Erreur de chargement"
      } finally {
        this.loading = false
      }
    },

    async addAbsence(data: {
      typeAbsence: string
      motif: string
      dateDebut: string
      dateFin: string
    }) {
      const absence = await createAbsence(data)
      this.absences.unshift(absence)
      return absence
    },

    async validateAbsence(id: number) {
      await validerAbsence(id)
      const absence = this.absences.find(a => a.id === id)
      if (!absence) return
      const authStore = useAuthStore()
      absence.statut = "VALIDEE"
      absence.validatedBy = authStore.user?.nom
      if (authStore.user?.role === "ADMIN" || authStore.user?.role === "MANAGER") {
        absence.validatedByRole = authStore.user.role
      }
    },

    async refuseAbsence(id: number) {
      await rejeterAbsence(id)
      const absence = this.absences.find(a => a.id === id)
      if (!absence) return
      absence.statut = "REFUSEE"
    },
  },
})