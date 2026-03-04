<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useAbsencesStore } from "@/stores/absences"
import DashboardCard from "@/components/DashboardCard.vue"
import { usePointageStore } from "@/stores/pointages"



const auth = useAuthStore()
const absencesStore = useAbsencesStore()
const pointageStore = usePointageStore()

onMounted(async () => {
  await pointageStore.fetchPointages()
})

const today = new Date().toISOString().split("T")[0]

const todaysPointages = computed(() =>
  pointageStore.pointages.filter(p => p.date === today)
)

const presentCount = computed(() =>
  todaysPointages.value.length
)

const lateCount = computed(() =>
  todaysPointages.value.filter(p => p.est_retard).length
)

const absentCount = computed(() => {
  // temporaire en attendant API users
  return 0
})
const pendingCount = computed(() => {
  return absencesStore.absences.filter(a =>
    a.statut === "EN_ATTENTE"
  ).length
})


const adminActivities = computed(() => {
  if (auth.user?.role !== "ADMIN") return []

  return absencesStore.absences
    .filter(a => a.statut === "VALIDEE" && a.validatedByRole === "MANAGER")
    .slice(-5)
})

// ------------------ EMPLOYE ------------------

const myPendingRequests = computed(() => {
  if (!auth.user) return 0

  return absencesStore.absences.filter(a =>
    a.userId === auth.user?.id &&
    a.statut === "EN_ATTENTE"
  ).length
})

const myRemainingLeave = computed(() => {
  return auth.user?.congeRestant || 0
})

// Fake heures (temporaire DEV)
const myMonthlyHours = computed(() => {
  return 132 // à connecter au backend plus tard
})


// ------------------ MANAGER ------------------

const pendingToValidate = computed(() => {
  if (auth.user?.role !== "MANAGER") return 0

  return absencesStore.absences.filter(a =>
    a.role === "EMPLOYE" &&
    a.statut === "EN_ATTENTE"
  ).length
})

// Simulé pour l’instant
const employeesPresentToday = computed(() => {
  return 5
})

const employeesAbsentToday = computed(() => {
  return 2
})


// ------------------ ADMIN ------------------

const totalAbsences = computed(() => {
  return absencesStore.absences.length
})

const totalPending = computed(() => {
  return absencesStore.absences.filter(a =>
    a.statut === "EN_ATTENTE"
  ).length
})
</script>

<template>
  <div class="space-y-8">

    <!-- TITLE -->
    <div class="space-y-10">

      <div>
        <h1 class="text-3xl font-bold text-dark">
          Tableau de bord
        </h1>
        <p class="text-gray-500 mt-1">
          Bienvenue {{ auth.user?.nom }}
        </p>
      </div>
    

      <!-- Employés -->
      <div v-if="auth.user?.role === 'EMPLOYE'" class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

      <DashboardCard title="Demandes en attente" :value="myPendingRequests" variant="primary"/>

      <DashboardCard title="Congés restants" :value="myRemainingLeave" variant="secondary" />

      <DashboardCard title="Heures ce mois" :value="myMonthlyHours + 'h'" variant="accent"/>

      </div>

      <!-- Manager & Admin -->
      <div v-if="auth.user?.role === 'MANAGER' || auth.user?.role === 'ADMIN'" class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Demandes en attente" :value="pendingCount" variant="primary"/>

        <DashboardCard title="Présents aujourd'hui" :value="presentCount" variant="secondary"/>

        <DashboardCard title="En retard"  :value="lateCount" variant="accent"/>

        <DashboardCard title="Absents" :value="absentCount" variant="primary"/>
      </div>
      
    </div>
    

    <!-- SECTION ACTIVITÉ -->
    <div v-if="auth.user?.role === 'ADMIN'">

  <h3 class="text-lg font-semibold text-dark mb-6">
    Activité Managers
  </h3>

  <div
    v-for="activity in adminActivities"
    :key="activity.id"
    class="p-4 rounded-xl hover:bg-gray-50"
  >
    <p class="text-sm text-dark">
      Le manager {{ activity.validatedBy }} a validé une demande
    </p>
  </div>

</div>

  </div>
</template>
