<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useAbsencesStore } from "@/stores/absences"
import { useAuthStore } from "@/stores/auth"
import LoadingSpinner from "@/components/LoadingSpinner.vue"

const absencesStore = useAbsencesStore()
const auth = useAuthStore()

const type = ref("")
const motif = ref("")
const dateDebut = ref("")
const dateFin = ref("")

const errors = ref<string[]>([])

onMounted(() => {
  absencesStore.loadAbsences()
})

const isFormValid = computed(() => {
  return (
    type.value &&
    motif.value &&
    dateDebut.value &&
    dateFin.value
  )
})

const filteredAbsences = computed(() => {
  if (!auth.user) return []

  if (auth.user.role === "ADMIN") {
    return absencesStore.absences
  }

  if (auth.user.role === "MANAGER") {
    return absencesStore.absences.filter(a =>
      a.userId === auth.user?.id || a.role === "EMPLOYE"
    )
  }

  if (auth.user.role === "EMPLOYE") {
    return absencesStore.absences.filter(a => a.userId === auth.user?.id)
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
    if (day !== 0) count++
    current.setDate(current.getDate() + 1)
  }

  return count
}

const requestedDays = computed(() => {
  if (!dateDebut.value || !dateFin.value) return 0
  return calculateWorkingDays(dateDebut.value, dateFin.value)
})

const submitAbsence = async () => {
  errors.value = []

  if (auth.user?.role === "ADMIN") {
    errors.value.push("Un ADMIN ne peut pas faire de demande.")
    return
  }

  if (!isFormValid.value) {
    errors.value.push("Tous les champs sont obligatoires.")
    return
  }

  if (type.value === "CONGE" && requestedDays.value > (auth.user?.congeRestant || 0)) {
    errors.value.push("Solde de congé insuffisant.")
    return
  }

  if (dateFin.value < dateDebut.value) {
    errors.value.push("La date de fin doit être après la date de début.")
    return
  }

  try {
    await absencesStore.addAbsence({
      typeAbsence: type.value,
      motif: motif.value,
      dateDebut: dateDebut.value,
      dateFin: dateFin.value,
    })
    type.value = ""
    motif.value = ""
    dateDebut.value = ""
    dateFin.value = ""
  } catch (e: any) {
    errors.value.push(e?.response?.data?.error || "Erreur lors de l'envoi.")
  }
}
</script>

<template>
  <div class="space-y-8 px-1">

    <!-- ═══════════════════════════════════════
         FORMULAIRE NOUVELLE DEMANDE
    ════════════════════════════════════════ -->
    <div
      v-if="auth.user?.role !== 'ADMIN'"
      class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <!-- Header du formulaire -->
      <div class="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100 px-8 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-dark">Nouvelle demande d'absence</h2>
            <p class="text-sm text-gray-400 mt-0.5">Remplissez tous les champs pour soumettre</p>
          </div>
        </div>
      </div>

      <div class="p-8">

        <!-- Messages d'erreur -->
        <div
          v-if="errors.length"
          class="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl"
        >
          <svg class="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <ul class="space-y-1 text-sm">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <!-- Grille du formulaire -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <!-- Type -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Type d'absence <span class="text-primary">*</span>
            </label>
            <div class="relative">
              <select
                v-model="type"
                class="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-dark
                       appearance-none cursor-pointer
                       focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10
                       transition-all duration-200 outline-none"
              >
                <option value="">Sélectionner un type</option>
                <option value="CONGE">🌴 Congé</option>
                <option value="MALADIE">🏥 Maladie</option>
                <option value="MISSION">✈️ Mission</option>
                <option value="AUTRE">📋 Autre</option>
              </select>
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Motif -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Motif <span class="text-primary">*</span>
            </label>
            <input
              v-model="motif"
              placeholder="Expliquez brièvement..."
              class="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-dark
                     placeholder:text-gray-300
                     focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10
                     transition-all duration-200 outline-none"
            />
          </div>

          <!-- Date début -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Date de début <span class="text-primary">*</span>
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                v-model="dateDebut"
                class="w-full border border-gray-200 bg-gray-50 rounded-2xl pl-11 pr-4 py-3 text-sm text-dark
                       focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10
                       transition-all duration-200 outline-none"
              />
            </div>
          </div>

          <!-- Date fin -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Date de fin <span class="text-primary">*</span>
            </label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                v-model="dateFin"
                class="w-full border border-gray-200 bg-gray-50 rounded-2xl pl-11 pr-4 py-3 text-sm text-dark
                       focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10
                       transition-all duration-200 outline-none"
              />
            </div>
          </div>

        </div>

        <!-- Info jours ouvrables -->
        <div
          v-if="type === 'CONGE' && requestedDays > 0"
          class="mt-5 flex flex-wrap items-center gap-6 bg-secondary/5 border border-secondary/20 rounded-2xl px-5 py-4"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-400">Jours demandés</p>
              <p class="text-sm font-bold text-secondary">{{ requestedDays }} jours ouvrables</p>
            </div>
          </div>
          <div class="w-px h-10 bg-secondary/20 hidden sm:block"></div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-400">Solde restant</p>
              <p class="text-sm font-bold text-primary">{{ auth.user?.congeRestant }} jours</p>
            </div>
          </div>
        </div>

        <!-- Bouton submit -->
        <button
          @click="submitAbsence"
          :disabled="!isFormValid"
          class="mt-6 w-full bg-primary text-white py-3.5 rounded-2xl font-semibold text-sm
                 flex items-center justify-center gap-2
                 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.005]
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                 transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Envoyer la demande
        </button>

      </div>
    </div>

    <!-- ═══════════════════════════════════════
         MES DEMANDES
    ════════════════════════════════════════ -->
    <div class="space-y-4">

      <!-- Header section -->
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold text-dark">Mes demandes</h2>
        <span
          v-if="filteredAbsences.length"
          class="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full"
        >
          {{ filteredAbsences.length }}
        </span>
      </div>

      <!-- État vide -->
      <div
        v-if="filteredAbsences.length === 0"
        class="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center gap-3"
      >
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm font-medium">Aucune demande pour le moment</p>
        <p class="text-gray-300 text-xs">Vos demandes apparaîtront ici</p>
      </div>

      <!-- Cartes de demandes -->
      <div
        v-for="a in filteredAbsences"
        :key="a.id"
        class="bg-white rounded-3xl border border-gray-100 overflow-hidden
               transition-all duration-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5"
      >
        <!-- Bande colorée selon statut -->
        <div
          :class="[
            'h-1 w-full',
            a.statut === 'EN_ATTENTE' && 'bg-gradient-to-r from-yellow-300 to-amber-400',
            a.statut === 'VALIDEE'    && 'bg-gradient-to-r from-green-400 to-emerald-400',
            a.statut === 'REFUSEE'   && 'bg-gradient-to-r from-red-400 to-rose-400',
          ]"
        ></div>

        <div class="p-6">
          <div class="flex justify-between items-start gap-4 mb-3">

            <!-- Info demande -->
            <div class="space-y-1 min-w-0">
              <h3 class="font-bold text-dark text-base">{{ a.type }}</h3>
              <p class="text-sm font-medium text-gray-600">{{ a.prenom }} {{ a.nom }}</p>
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ a.dateDebut }}</span>
                <span class="text-gray-300">→</span>
                <span>{{ a.dateFin }}</span>
              </div>
            </div>

            <!-- Badge statut -->
            <span
              :class="[
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
                a.statut === 'EN_ATTENTE' && 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                a.statut === 'VALIDEE'    && 'bg-green-50 text-green-700 border border-green-200',
                a.statut === 'REFUSEE'   && 'bg-red-50 text-red-700 border border-red-200',
              ]"
            >
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  a.statut === 'EN_ATTENTE' && 'bg-yellow-500 animate-pulse',
                  a.statut === 'VALIDEE'    && 'bg-green-500',
                  a.statut === 'REFUSEE'   && 'bg-red-500',
                ]"
              ></span>
              {{
                a.statut === 'EN_ATTENTE'
                  ? 'En attente'
                  : a.statut === 'VALIDEE'
                  ? 'Validée'
                  : 'Refusée'
              }}
            </span>
          </div>

          <!-- Motif -->
          <p class="text-gray-500 text-sm bg-gray-50 rounded-xl px-4 py-2.5 mb-4 leading-relaxed">
            {{ a.motif }}
          </p>

          <!-- Actions validation -->
          <div v-if="a.statut === 'EN_ATTENTE'" class="flex gap-2.5">

            <!-- Manager valide Employé -->
            <template v-if="auth.user?.role === 'MANAGER' && a.role === 'EMPLOYE'">
              <button
                @click="absencesStore.validateAbsence(a.id)"
                class="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold
                       hover:opacity-90 hover:scale-[1.02] transition-all duration-150 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Valider
              </button>
              <button
                @click="absencesStore.refuseAbsence(a.id)"
                class="flex items-center gap-2 bg-white text-primary border border-primary/30 px-4 py-2 rounded-xl text-sm font-semibold
                       hover:bg-primary hover:text-white hover:border-primary transition-all duration-150"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Refuser
              </button>
            </template>

            <!-- Admin valide Manager -->
            <template v-if="auth.user?.role === 'ADMIN' && a.role === 'MANAGER'">
              <button
                @click="absencesStore.validateAbsence(a.id)"
                class="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold
                       hover:opacity-90 hover:scale-[1.02] transition-all duration-150 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Valider
              </button>
              <button
                @click="absencesStore.refuseAbsence(a.id)"
                class="flex items-center gap-2 bg-white text-primary border border-primary/30 px-4 py-2 rounded-xl text-sm font-semibold
                       hover:bg-primary hover:text-white hover:border-primary transition-all duration-150"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Refuser
              </button>
            </template>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>