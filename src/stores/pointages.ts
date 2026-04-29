import { defineStore } from "pinia"
import api from "@/services/api"

export interface Pointage {
  id: number
  date: string
  heure_entree: string
  heure_sortie: string | null
  est_retard: boolean
  minutes_retard: number
  heures_sup: number
  typePointage: string
  user: number
  userNom?: string
  user_nom?: string
  user_prenom?: string
}

export const usePointageStore = defineStore("pointages", {
  state: () => ({
    pointages: [] as Pointage[]
  }),

  actions: {
    async fetchPointages() {
      const response = await api.get("/pointages/")
      this.pointages = response.data
    },

    async fetchTodayPointages() {
      const response = await api.get("/pointages/today/")
      this.pointages = response.data
    },

    async confirmerPointageDepuisScan(payload: {
      employeeId: number
      employeeNom: string
      type: "ENTREE" | "SORTIE"
      date: string
    }) {
      try {
        const response = await api.post("/pointages/scan/", {
          user: payload.employeeId,
          type: payload.type,
          date: payload.date,
        })
        // Utiliser les données du backend qui incluent le nom de l'employé
        if (response.data && response.data.pointage) {
          this.pointages.unshift(response.data.pointage)
        } else {
          // Fallback si le backend ne renvoie pas le pointage
          const localRecord: Pointage = {
            id: Date.now(),
            date: payload.date,
            heure_entree: payload.type === "ENTREE" ? new Date().toLocaleTimeString() : "",
            heure_sortie: payload.type === "SORTIE" ? new Date().toLocaleTimeString() : null,
            est_retard: false,
            minutes_retard: 0,
            heures_sup: 0,
            typePointage: payload.type,
            user: payload.employeeId,
            userNom: payload.employeeNom,
          }
          this.pointages.unshift(localRecord)
        }
      } catch {
        // Fallback local en cas d'erreur
        const localRecord: Pointage = {
          id: Date.now(),
          date: payload.date,
          heure_entree: payload.type === "ENTREE" ? new Date().toLocaleTimeString() : "",
          heure_sortie: payload.type === "SORTIE" ? new Date().toLocaleTimeString() : null,
          est_retard: false,
          minutes_retard: 0,
          heures_sup: 0,
          typePointage: payload.type,
          user: payload.employeeId,
          userNom: payload.employeeNom,
        }
        this.pointages.unshift(localRecord)
      }
    }
  }
})