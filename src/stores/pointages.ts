import { defineStore } from "pinia"
import axios from "axios"

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
      const response = await axios.get("https://projet-de-pointage-digitalis-3.onrender.com/api/pointages/")
      this.pointages = response.data
    }
  }
})