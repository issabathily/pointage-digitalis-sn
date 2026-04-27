<script setup lang="ts">
import { ref, computed } from "vue"
import { useAbsencesStore } from "@/stores/absences"
import { useAuthStore } from "@/stores/auth"

const absencesStore = useAbsencesStore()
const auth = useAuthStore()

const nom = ref("")
const prenom = ref("")
const type = ref("")
const motif = ref("")
const dateDebut = ref("")
const dateFin = ref("")

const errors = ref<string[]>([])

const isFormValid = computed(() => {
  return (
    nom.value &&
    prenom.value &&
    type.value &&
    motif.value &&
    dateDebut.value &&
    dateFin.value
  )
})

const filteredAbsences = computed(() => {

  if (!auth.user) return []

  // ADMIN voit tout
  if (auth.user.role === "ADMIN") {
    return absencesStore.absences
  }

  // MANAGER voit ses demandes + celles des employés
  if (auth.user.role === "MANAGER") {
    return absencesStore.absences.filter(a =>
      a.userId === auth.user?.id || a.role === "EMPLOYE"
    )
  }

  // EMPLOYE voit uniquement ses demandes
  if (auth.user.role === "EMPLOYE") {
    return absencesStore.absences.filter(a =>
      a.userId === auth.user?.id
    )
  }

  return []
})

const calculateWorkingDays = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    const day = current.getDay()

    // 0 = dimanche
    if (day !== 0) {
      count++
    }

    current.setDate(current.getDate() + 1)
  }

  return count
}

const requestedDays = computed(() => {
  if (!dateDebut.value || !dateFin.value) return 0
  return calculateWorkingDays(dateDebut.value, dateFin.value)
})


const submitAbsence = () => {
  errors.value = []

  if (auth.user?.role === "ADMIN") {
    errors.value.push("Un ADMIN ne peut pas faire de demande.")
    return
  }

  if (!isFormValid.value) {
    errors.value.push("Tous les champs sont obligatoires.")
    return
  }

  if (requestedDays.value > (auth.user?.congeRestant || 0)) {
  errors.value.push("Solde de congé insuffisant.")
  return
}

  if (dateFin.value < dateDebut.value) {
    errors.value.push("La date de fin doit être après la date de début.")
    return
  }

  absencesStore.addAbsence({
    id: Date.now(),
    userId: auth.user?.id || 0,
    nom: nom.value,
    prenom: prenom.value,
    role: auth.user?.role as "EMPLOYE" | "MANAGER",
    type: type.value,
    motif: motif.value,
    dateDebut: dateDebut.value,
    dateFin: dateFin.value,
    statut: "EN_ATTENTE",
    validatedBy: "",
    validatedByRole: "MANAGER"
  })

  nom.value = ""
  prenom.value = ""
  type.value = ""
  motif.value = ""
  dateDebut.value = ""
  dateFin.value = ""
}
</script>


<template>
 <div class="space-y-6"><div v-if="auth.user?.role !== 'ADMIN'"
      class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">

    <h2 class="text-2xl font-bold text-dark mb-8">
      Nouvelle demande d'absence
    </h2>

    <!-- Messages d'erreur -->
    <div v-if="errors.length"
        class="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
      <ul>
        <li v-for="(error, index) in errors" :key="index">
          • {{ error }}
        </li>
      </ul>
    </div>

    <div class="grid grid-cols-2 gap-6">

      <!-- Nom -->
      <div class="relative">
        <label class="block text-sm mb-2 text-gray-600">Nom *</label>
        <input v-model="nom"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary
                focus:border-primary transition-all duration-200 outline-none"
          placeholder="Ex: Ndiaye" />
      </div>

      <!-- Prénom -->
      <div>
        <label class="block text-sm mb-2 text-gray-600">Prénom *</label>
        <input v-model="prenom"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary
                focus:border-primary transition-all duration-200 outline-none"
          placeholder="Ex: Moussa" />
      </div>

      <!-- Type -->
      <div>
        <label class="block text-sm mb-2 text-gray-600">Type d'absence *</label>
        <select v-model="type"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-secondary
                focus:border-secondary transition-all duration-200 outline-none">
          <option value="">Sélectionner</option>
          <option value="CONGE">Congé</option>
          <option value="MALADIE">Maladie</option>
          <option value="MISSION">Mission</option>
          <option value="AUTRE">Autre</option>
        </select>
      </div>

      <!-- Motif -->
      <div>
        <label class="block text-sm mb-2 text-gray-600">Motif *</label>
        <input v-model="motif"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-accent
                focus:border-accent transition-all duration-200 outline-none"
          placeholder="Expliquez brièvement..." />
      </div>

      <!-- Date début -->
      <div>
        <label class="block text-sm mb-2 text-gray-600">Date début *</label>
        <input type="date" v-model="dateDebut"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary
                transition-all duration-200 outline-none" />
      </div>

      <!-- Date fin -->
      <div>
        <label class="block text-sm mb-2 text-gray-600">Date fin *</label>
        <input type="date" v-model="dateFin"
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-primary
                transition-all duration-200 outline-none" />
      </div>

      <div v-if="type === 'CONGE' && requestedDays > 0" class="mt-4 text-sm font-semibold text-secondary">
          Nombre de jours ouvrables : {{ requestedDays }} <br>
        Solde restant : {{ auth.user?.congeRestant }}
      </div>

    </div>

    <!-- Bouton -->
    <button
      @click="submitAbsence"
      :disabled="!isFormValid"
      class="mt-8 w-full bg-primary text-white py-3 rounded-xl font-semibold
            transition-all duration-200
            hover:bg-secondary hover:scale-[1.01]
            disabled:opacity-50 disabled:cursor-not-allowed">
      Envoyer la demande
    </button>

    </div>
</div>


    <!-- MES DEMANDES -->

<div class="space-y-4">

  <h2 class="text-xl font-bold text-dark">
    Mes demandes
  </h2>

  <div v-if="filteredAbsences.length === 0"
       class="text-gray-400 text-sm">
    Aucune demande pour le moment.
  </div>

  <div
    v-for="a in filteredAbsences"
    :key="a.id"
    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100
           transition-all duration-300 hover:shadow-md hover:-translate-y-1"
  >

    <div class="flex justify-between items-center mb-4">

      <div>
        <h3 class="font-semibold text-lg">
          {{ a.type }}
        </h3>
        <h2 class="text-sm text-gray-500">
          {{ a.prenom }} {{ a.nom }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ a.dateDebut }} → {{ a.dateFin }}
        </p>
      </div>

      <!-- Badge Statut -->
      <div>
  <span
    :class="[
      'px-3 py-1 rounded-full text-xs font-semibold',
      a.statut === 'EN_ATTENTE' && 'bg-yellow-100 text-yellow-700',
      a.statut === 'VALIDEE' && 'bg-green-100 text-green-700',
      a.statut === 'REFUSEE' && 'bg-red-100 text-red-700'
    ]"
  >
    {{
      a.statut === 'EN_ATTENTE'
        ? 'En attente'
        : a.statut === 'VALIDEE'
        ? 'Validée'
        : 'Refusée'
    }}
  </span>
</div>

    </div>

    <p class="text-gray-600 text-sm mb-4">
      {{ a.motif }}
    </p>

    <!-- Actions validation -->
    <div v-if="a.statut === 'EN_ATTENTE'" class="flex gap-3">

      <!-- Manager valide Employé -->
      <template v-if="auth.user?.role === 'MANAGER' && a.role === 'EMPLOYE'">

        <button
          @click="absencesStore.validateAbsence(a.id)"
          class="bg-secondary text-white px-4 py-2 rounded-lg
                 hover:opacity-90 transition">
          Valider
        </button>

        <button
          @click="absencesStore. refuseAbsence(a.id)"
          class="bg-primary text-white px-4 py-2 rounded-lg
                 hover:opacity-90 transition">
          Refuser
        </button>

      </template>

      <!-- Admin valide Manager -->
      <template v-if="auth.user?.role === 'ADMIN' && a.role === 'MANAGER'">

        <button
          @click="absencesStore.validateAbsence(a.id)"
          class="bg-secondary text-white px-4 py-2 rounded-lg
                 hover:opacity-90 transition">
          Valider
        </button>

        <button
          @click="absencesStore.refuseAbsence(a.id)"
          class="bg-primary text-white px-4 py-2 rounded-lg
                 hover:opacity-90 transition">
          Refuser
        </button>

      </template>

    </div>

  </div>

</div>
</template>