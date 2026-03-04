import api from "./api"

export const getEmployees = async () => {
  // Pour l’instant on simule
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, nom: "Jean Dupont", role: "EMPLOYE", statut: "Actif" },
        { id: 2, nom: "Marie Diop", role: "MANAGER", statut: "Actif" },
      ])
    }, 500)
  })
}
