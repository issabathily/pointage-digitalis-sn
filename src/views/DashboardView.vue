<!--<script setup lang="ts">-->
<!--import { ref, onMounted, computed, watch } from "vue"-->
<!--import { useAuthStore } from "@/stores/auth"-->
<!--import DashboardCard from "@/components/DashboardCard.vue"-->
<!--import ChartWrapper from "@/components/ChartWrapper.vue"-->
<!--import { kpiService, ChartData } from "@/services/kpi.service"-->

<!--const auth = useAuthStore()-->

<!--const employeeKPI = ref({-->
<!--  days_worked_this_month: 0,-->
<!--  monthly_lates: 0,-->
<!--  monthly_overtime: 0-->
<!--})-->

<!--const managerKPI = ref({-->
<!--  present_today: 0,-->
<!--  late_today: 0,-->
<!--  overtime_today: 0,-->
<!--  total_employees: 0-->
<!--})-->

<!--const employeeChartData = ref<ChartData | null>(null)-->
<!--const managerTeamChartData = ref<ChartData | null>(null)-->
<!--const managerWeeklyTrendData = ref<ChartData | null>(null)-->

<!--const isLoading = ref(true)-->
<!--const chartsLoading = ref(true)-->

<!--const isManager = computed(() =>-->
<!--  auth.user?.role === "MANAGER" || auth.user?.role === "ADMIN"-->
<!--)-->

<!--const today = computed(() =>-->
<!--  new Date().toLocaleDateString("fr-FR", {-->
<!--    weekday: "long", day: "numeric", month: "long", year: "numeric"-->
<!--  })-->
<!--)-->

<!--const currentHour = new Date().getHours()-->
<!--const greeting = computed(() => {-->
<!--  if (currentHour < 12) return "Bonjour"-->
<!--  if (currentHour < 18) return "Bon après-midi"-->
<!--  return "Bonsoir"-->
<!--})-->

<!--const loadKPI = async () => {-->
<!--  if (!auth.user) return-->

<!--  try {-->
<!--    if (auth.user.role === "EMPLOYE") {-->
<!--      employeeKPI.value = await kpiService.getEmployeeKPI()-->
<!--      employeeChartData.value = await kpiService.getEmployeeMonthlyChart()-->
<!--    } else if (isManager.value) {-->
<!--      managerKPI.value = await kpiService.getManagerKPI()-->
<!--      const [teamChart, weeklyTrend] = await Promise.all([-->
<!--        kpiService.getManagerTeamChart(),-->
<!--        kpiService.getManagerWeeklyTrend()-->
<!--      ])-->
<!--      managerTeamChartData.value = teamChart-->
<!--      managerWeeklyTrendData.value = weeklyTrend-->
<!--    }-->
<!--  } catch (error) {-->
<!--    console.error("Erreur lors du chargement des KPI:", error)-->
<!--  } finally {-->
<!--    isLoading.value = false-->
<!--    chartsLoading.value = false-->
<!--  }-->
<!--}-->

<!--onMounted(async () => {-->
<!--  if (auth.user) {-->
<!--    await loadKPI()-->
<!--  }-->
<!--})-->

<!--watch(() => auth.user, (newUser) => {-->
<!--  if (newUser) {-->
<!--    loadKPI()-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-10">-->

<!--    &lt;!&ndash; HEADER &ndash;&gt;-->
<!--    <div class="mb-10">-->
<!--      <p class="text-sm font-medium text-gray-400 capitalize tracking-wide mb-1">{{ today }}</p>-->
<!--      <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">-->
<!--        {{ greeting }}, {{ auth.user?.nom }}-->
<!--      </h1>-->
<!--      <p class="text-gray-500 mt-1 text-base">-->
<!--        Voici un aperçu de votre activité-->
<!--      </p>-->
<!--    </div>-->

<!--    &lt;!&ndash; KPI CARDS &ndash;&gt;-->
<!--    <div class="mb-10">-->

<!--      &lt;!&ndash; Employés &ndash;&gt;-->
<!--      <div-->
<!--        v-if="auth.user?.role === 'EMPLOYE'"-->
<!--        class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"-->
<!--      >-->
<!--        <DashboardCard title="Jours travaillés ce mois" :value="employeeKPI.days_worked_this_month" variant="primary"/>-->
<!--        <DashboardCard title="Retards ce mois" :value="employeeKPI.monthly_lates" variant="secondary"/>-->
<!--        <DashboardCard title="Heures sup ce mois" :value="employeeKPI.monthly_overtime + 'h'" variant="accent"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Manager & Admin &ndash;&gt;-->
<!--      <div-->
<!--        v-if="isManager"-->
<!--        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"-->
<!--      >-->
<!--        <DashboardCard title="Présents aujourd'hui" :value="managerKPI.present_today" variant="primary"/>-->
<!--        <DashboardCard title="En retard" :value="managerKPI.late_today" variant="secondary"/>-->
<!--        <DashboardCard title="Heures sup aujourd'hui" :value="managerKPI.overtime_today + 'h'" variant="accent"/>-->
<!--        <DashboardCard title="Total employés" :value="managerKPI.total_employees" variant="primary"/>-->
<!--      </div>-->

<!--    </div>-->

<!--    &lt;!&ndash; CHARTS SECTION &ndash;&gt;-->
<!--    <div class="grid gap-6 lg:grid-cols-2">-->

<!--      &lt;!&ndash; Employee Chart — pleine largeur &ndash;&gt;-->
<!--      <div-->
<!--        v-if="auth.user?.role === 'EMPLOYE'"-->
<!--        class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8"-->
<!--      >-->
<!--        <div class="flex items-start justify-between mb-6">-->
<!--          <div>-->
<!--            <h3 class="text-lg font-semibold text-gray-900">Activité mensuelle</h3>-->
<!--            <p class="text-sm text-gray-400 mt-0.5">Vos pointages sur le mois en cours</p>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div v-if="chartsLoading" class="flex flex-col items-center justify-center h-64 gap-3">-->
<!--          <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary"></div>-->
<!--          <p class="text-sm text-gray-400">Chargement…</p>-->
<!--        </div>-->
<!--        <ChartWrapper v-else-if="employeeChartData" type="line" :data="employeeChartData" :height="300"/>-->
<!--        <div v-else class="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">-->
<!--          <svg class="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>-->
<!--          </svg>-->
<!--          <p class="text-sm">Aucune donnée disponible</p>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Manager Charts &ndash;&gt;-->
<!--      <template v-if="isManager">-->

<!--        &lt;!&ndash; Team Distribution &ndash;&gt;-->
<!--        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">-->
<!--          <div class="mb-6">-->
<!--            <h3 class="text-lg font-semibold text-gray-900">Répartition de l'équipe</h3>-->
<!--            <p class="text-sm text-gray-400 mt-0.5">Statuts des employés aujourd'hui</p>-->
<!--          </div>-->

<!--          <div v-if="chartsLoading" class="flex flex-col items-center justify-center h-64 gap-3">-->
<!--            <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary"></div>-->
<!--            <p class="text-sm text-gray-400">Chargement…</p>-->
<!--          </div>-->
<!--          <ChartWrapper v-else-if="managerTeamChartData" type="doughnut" :data="managerTeamChartData" :height="300"/>-->
<!--          <div v-else class="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">-->
<!--            <svg class="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>-->
<!--              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>-->
<!--            </svg>-->
<!--            <p class="text-sm">Aucune donnée disponible</p>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Weekly Trend &ndash;&gt;-->
<!--        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">-->
<!--          <div class="mb-6">-->
<!--            <h3 class="text-lg font-semibold text-gray-900">Tendance hebdomadaire</h3>-->
<!--            <p class="text-sm text-gray-400 mt-0.5">Présences sur les 7 derniers jours</p>-->
<!--          </div>-->

<!--          <div v-if="chartsLoading" class="flex flex-col items-center justify-center h-64 gap-3">-->
<!--            <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary"></div>-->
<!--            <p class="text-sm text-gray-400">Chargement…</p>-->
<!--          </div>-->
<!--          <ChartWrapper v-else-if="managerWeeklyTrendData" type="line" :data="managerWeeklyTrendData" :height="300"/>-->
<!--          <div v-else class="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">-->
<!--            <svg class="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>-->
<!--            </svg>-->
<!--            <p class="text-sm">Aucune donnée disponible</p>-->
<!--          </div>-->
<!--        </div>-->

<!--      </template>-->
<!--    </div>-->

<!--  </div>-->
<!--</template>-->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue"
import { useAuthStore } from "@/stores/auth"
import DashboardCard from "@/components/DashboardCard.vue"
import ChartWrapper from "@/components/ChartWrapper.vue"
import { kpiService, ChartData } from "@/services/kpi.service"

const auth = useAuthStore()

const employeeKPI = ref({
  days_worked_this_month: 0,
  monthly_lates: 0,
  monthly_overtime: 0
})

const managerKPI = ref({
  present_today: 0,
  late_today: 0,
  overtime_today: 0,
  total_employees: 0
})

const employeeChartData = ref<ChartData | null>(null)
const managerTeamChartData = ref<ChartData | null>(null)
const managerWeeklyTrendData = ref<ChartData | null>(null)

const isLoading = ref(true)
const chartsLoading = ref(true)

const isManager = computed(() =>
  auth.user?.role === "MANAGER" || auth.user?.role === "ADMIN"
)

const today = computed(() =>
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })
)

const currentHour = new Date().getHours()
const greeting = computed(() => {
  if (currentHour < 12) return "Bonjour"
  if (currentHour < 18) return "Bon après-midi"
  return "Bonsoir"
})

const loadKPI = async () => {
  if (!auth.user) return

  try {
    if (auth.user.role === "EMPLOYE") {
      employeeKPI.value = await kpiService.getEmployeeKPI()
      employeeChartData.value = await kpiService.getEmployeeMonthlyChart()
    } else if (isManager.value) {
      managerKPI.value = await kpiService.getManagerKPI()
      const [teamChart, weeklyTrend] = await Promise.all([
        kpiService.getManagerTeamChart(),
        kpiService.getManagerWeeklyTrend()
      ])
      managerTeamChartData.value = teamChart
      managerWeeklyTrendData.value = weeklyTrend
    }
  } catch (error) {
    console.error("Erreur lors du chargement des KPI:", error)
  } finally {
    isLoading.value = false
    chartsLoading.value = false
  }
}

onMounted(async () => {
  if (auth.user) await loadKPI()
})

watch(() => auth.user, (newUser) => {
  if (newUser) loadKPI()
})
</script>

<template>
  <!-- 🔥 FIX PRINCIPAL -->
  <div class="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:px-6 lg:px-10">

    <!-- HEADER -->
    <div class="mb-10">
      <p class="text-sm font-medium text-gray-400 capitalize tracking-wide mb-1">
        {{ today }}
      </p>

      <!-- 🔥 FIX TEXT RESPONSIVE -->
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
        {{ greeting }}, {{ auth.user?.nom }}
      </h1>

      <p class="text-gray-500 mt-1 text-base">
        Voici un aperçu de votre activité
      </p>
    </div>

    <!-- KPI CARDS -->
    <div class="mb-10">

      <!-- Employés -->
      <div
        v-if="auth.user?.role === 'EMPLOYE'"
        class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <DashboardCard title="Jours travaillés ce mois" :value="employeeKPI.days_worked_this_month" variant="primary"/>
        <DashboardCard title="Retards ce mois" :value="employeeKPI.monthly_lates" variant="secondary"/>
        <DashboardCard title="Heures sup ce mois" :value="employeeKPI.monthly_overtime + 'h'" variant="accent"/>
      </div>

      <!-- Manager -->
      <div
        v-if="isManager"
        class="grid gap-5 grid-cols-2 lg:grid-cols-4"
      >
        <DashboardCard title="Présents aujourd'hui" :value="managerKPI.present_today" variant="primary"/>
        <DashboardCard title="En retard" :value="managerKPI.late_today" variant="secondary"/>
        <DashboardCard title="Heures sup aujourd'hui" :value="managerKPI.overtime_today + 'h'" variant="accent"/>
        <DashboardCard title="Total employés" :value="managerKPI.total_employees" variant="primary"/>
      </div>

    </div>

    <!-- CHARTS -->
    <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">

      <!-- Employee Chart -->
      <div
        v-if="auth.user?.role === 'EMPLOYE'"
        class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
      >
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Activité mensuelle</h3>
          <p class="text-sm text-gray-400">Vos pointages sur le mois</p>
        </div>

        <div v-if="chartsLoading" class="flex items-center justify-center h-64">
          Chargement…
        </div>

        <!-- 🔥 FIX CHART -->
        <div v-else-if="employeeChartData" class="w-full overflow-hidden">
          <ChartWrapper type="line" :data="employeeChartData" :height="300"/>
        </div>

        <div v-else class="flex items-center justify-center h-64 text-gray-400">
          Aucune donnée
        </div>
      </div>

      <!-- Manager -->
      <template v-if="isManager">

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h3 class="text-lg font-semibold mb-4">Répartition de l'équipe</h3>

          <div v-if="chartsLoading" class="h-64 flex items-center justify-center">
            Chargement…
          </div>

          <div v-else-if="managerTeamChartData" class="w-full overflow-hidden">
            <ChartWrapper type="doughnut" :data="managerTeamChartData" :height="300"/>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h3 class="text-lg font-semibold mb-4">Tendance hebdomadaire</h3>

          <div v-if="chartsLoading" class="h-64 flex items-center justify-center">
            Chargement…
          </div>

          <div v-else-if="managerWeeklyTrendData" class="w-full overflow-hidden">
            <ChartWrapper type="line" :data="managerWeeklyTrendData" :height="300"/>
          </div>
        </div>

      </template>
    </div>

  </div>
</template>