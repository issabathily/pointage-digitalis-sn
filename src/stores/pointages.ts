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

    async confirmerPointageDepuisScan(payload: {
      employeeId: number
      employeeNom: string
      type: "ENTREE" | "SORTIE"
      date: string
    }) {
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

      try {
        await api.post("/pointages/scan/", {
          user: payload.employeeId,
          type: payload.type,
          date: payload.date,
        })
      } catch {
        // Fallback local pour ne pas bloquer le flux de scan si l'endpoint n'existe pas encore.
      }

      this.pointages.unshift(localRecord)
    }
  }
})