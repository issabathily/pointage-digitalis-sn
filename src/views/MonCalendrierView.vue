<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { onMounted } from "vue"
import {
  getMyPointages,
  getMyAbsences,
  buildCalendar,
  type CalendarDay,
  type PointageRecord,
  type AbsenceRecord,
} from "@/services/calendar.service"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { ChevronLeft, ChevronRight, Clock, CalendarX, CalendarCheck } from "lucide-vue-next"
import { useAuthStore } from "@/stores/auth"
import { getEmployees, type Employee } from "@/services/employees.service"

const currentDate = ref(new Date())
const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())
const auth = useAuthStore()

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]
const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const pointages = ref<PointageRecord[]>([])
const absences = ref<AbsenceRecord[]>([])
const loading = ref(false)
const error = ref("")

const canViewOthers = computed(() => auth.isAdmin || auth.isManager)
const employees = ref<Employee[]>([])
const employeesLoading = ref(false)
const employeesError = ref("")
const selectedUserId = ref<number | null>(null)

const selectedEmployeeName = computed(() => {
  if (!canViewOthers.value) return auth.user?.nom ?? "Moi"
  if (!selectedUserId.value) return "Sélectionnez un employé"
  return employees.value.find((e) => e.id === selectedUserId.value)?.nom ?? "Employé"
})

async function fetchEmployeesList() {
  employeesLoading.value = true
  employeesError.value = ""
  try {
    const list = await getEmployees()
    employees.value = list
    if (!selectedUserId.value) {
      selectedUserId.value = list[0]?.id ?? auth.user?.id ?? null
    }
  } catch (e: any) {
    employeesError.value = e?.message || "Erreur de chargement des employés."
  } finally {
    employeesLoading.value = false
  }
}

async function fetchData() {
  loading.value = true
  error.value = ""
  try {
    const userId = canViewOthers.value ? selectedUserId.value : auth.user?.id ?? null
    const [p, a] = await Promise.all([getMyPointages(userId), getMyAbsences(userId)])
    pointages.value = p
    absences.value = a
  } catch (e: any) {
    error.value = e?.message || "Erreur de chargement."
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (canViewOthers.value) {
    await fetchEmployeesList()
  } else {
    selectedUserId.value = auth.user?.id ?? null
  }
  await fetchData()
})

watch(
  () => auth.user?.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) fetchData()
  }
)

watch(
  () => selectedUserId.value,
  (newId, oldId) => {
    if (!canViewOthers.value) return
    if (newId && newId !== oldId) fetchData()
  }
)

const calendarDays = computed<CalendarDay[]>(() =>
  buildCalendar(year.value, month.value, pointages.value, absences.value)
)

const weeks = computed(() => {
  const w: CalendarDay[][] = []
  for (let i = 0; i < calendarDays.value.length; i += 7) {
    w.push(calendarDays.value.slice(i, i + 7))
  }
  return w
})

function prevMonth() {
  currentDate.value = new Date(year.value, month.value - 1, 1)
}
function nextMonth() {
  currentDate.value = new Date(year.value, month.value + 1, 1)
}
function goToday() {
  currentDate.value = new Date()
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function monthKey(y: number, m: number) {
  return `${y}-${pad2(m + 1)}`
}

const stats = computed(() => {
  // KPI basés uniquement sur les données backend chargées (pointages/absences)
  const ym = monthKey(year.value, month.value)

  const pointagesInMonth = pointages.value.filter((p) => p.date?.startsWith(ym))
  const retard = pointagesInMonth.filter((p) => !!p.est_retard).length

  // Absences: compter les jours du mois couverts par au moins une absence
  const firstDay = `${ym}-01`
  const last = new Date(year.value, month.value + 1, 0).getDate()
  const daysAbsent = new Set<string>()

  for (const a of absences.value) {
    const start = a.dateDebut || ""
    const end = a.dateFin || ""
    if (!start || !end) continue

    // intersection avec le mois courant
    const rangeStart = start > firstDay ? start : firstDay
    const rangeEnd = end < `${ym}-${pad2(last)}` ? end : `${ym}-${pad2(last)}`
    if (rangeStart > rangeEnd) continue

    // itérer jour par jour dans l'intersection
    const d = new Date(rangeStart + "T00:00:00")
    const endD = new Date(rangeEnd + "T00:00:00")
    while (d <= endD) {
      const ds = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
      daysAbsent.add(ds)
      d.setDate(d.getDate() + 1)
    }
  }

  const absent = daysAbsent.size

  // Présents: jours avec pointage, en excluant les jours marqués absents
  const presentDays = new Set(pointagesInMonth.map((p) => p.date).filter(Boolean))
  for (const day of daysAbsent) presentDays.delete(day)
  const present = presentDays.size

  return { present, absent, retard }
})

const selectedDay = ref<CalendarDay | null>(null)

function selectDay(day: CalendarDay) {
  if (!day.isCurrentMonth) return
  selectedDay.value = day
}
</script>

<template>
  <div class="space-y-6 max-w-full overflow-x-hidden">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-dark">
          {{ canViewOthers ? "Calendrier employés" : "Mon calendrier" }}
        </h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Pointages et absences du mois
          <span v-if="canViewOthers" class="text-gray-500">— {{ selectedEmployeeName }}</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="canViewOthers" class="w-full sm:w-auto sm:min-w-[260px]">
          <select
            v-model.number="selectedUserId"
            class="w-full px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            :disabled="employeesLoading || !!employeesError"
          >
            <option :value="null" disabled>Sélectionnez un employé</option>
            <option v-for="e in employees.filter(e => e.role === 'EMPLOYE')" :key="e.id" :value="e.id" class="cursor-pointer">
              {{ e.nom }}
            </option>
          </select>
        </div>
        <button
          @click="goToday"
          class="px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          Aujourd'hui
        </button>
        <button
          @click="prevMonth"
          class="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft :size="18" />
        </button>
        <span class="text-sm font-semibold text-dark min-w-[120px] sm:min-w-[140px] text-center">
          {{ monthNames[month] }} {{ year }}
        </span>
        <button
          @click="nextMonth"
          class="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
          <CalendarCheck :size="20" />
        </div>
        <div>
          <p class="text-2xl font-bold text-dark">{{ stats.present }}</p>
          <p class="text-xs text-gray-400">Jours présents</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <CalendarX :size="20" />
        </div>
        <div>
          <p class="text-2xl font-bold text-dark">{{ stats.absent }}</p>
          <p class="text-xs text-gray-400">Jours absents</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <Clock :size="20" />
        </div>
        <div>
          <p class="text-2xl font-bold text-dark">{{ stats.retard }}</p>
          <p class="text-xs text-gray-400">Retards</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-20 flex justify-center">
      <LoadingSpinner message="Chargement de votre calendrier..." />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl">
      {{ error }}
    </div>

    <div
      v-else-if="canViewOthers && employeesError"
      class="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl"
    >
      {{ employeesError }}
    </div>

    <!-- Calendar -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto w-full max-w-full">
        <div class="w-full max-w-full">
      <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        <div
          v-for="d in dayNames"
          :key="d"
          class="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {{ d }}
        </div>
      </div>

      <div v-for="(week, wi) in weeks" :key="wi" class="grid grid-cols-7">
        <div
          v-for="day in week"
          :key="day.date"
          @click="selectDay(day)"
          class="min-h-[72px] sm:min-h-[100px] border-b border-r border-gray-100 p-1.5 sm:p-2 transition-all cursor-pointer relative group"
          :class="{
            'bg-gray-50/50': !day.isCurrentMonth,
            'bg-primary/5 hover:bg-primary/10': day.isCurrentMonth && day.pointage && day.absences.length === 0,
            'bg-orange-50 hover:bg-orange-100': day.isCurrentMonth && day.absences.length > 0,
            'ring-2 ring-primary ring-inset z-10': selectedDay?.date === day.date,
          }"
        >
          <span
            class="text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full"
            :class="{
              'bg-primary text-white': day.isToday,
              'text-gray-300': !day.isCurrentMonth,
              'text-dark': day.isCurrentMonth && !day.isToday,
            }"
          >
            {{ day.day }}
          </span>

          <!-- Indicators -->
          <div v-if="day.isCurrentMonth" class="mt-1 flex flex-wrap gap-1">
            <div
              v-if="day.pointage"
              class="w-2 h-2 rounded-full"
              :class="day.pointage.est_retard ? 'bg-red-500' : 'bg-green-500'"
              :title="day.pointage.est_retard ? 'Retard' : 'Présent'"
            />
            <div
              v-for="abs in day.absences"
              :key="abs.id"
              class="w-2 h-2 rounded-full bg-orange-500"
              :title="abs.typeAbsence"
            />
          </div>

          <!-- Tooltip on hover -->
          <div
            v-if="day.isCurrentMonth && (day.pointage || day.absences.length)"
            class="absolute bottom-1 left-1 right-1 text-[10px] text-gray-500 opacity-0 sm:group-hover:opacity-100 transition-opacity truncate"
          >
            <span v-if="day.pointage?.heure_entree" class="text-green-600">
              {{ day.pointage.heure_entree.slice(0, 5) }}
            </span>
            <span v-if="day.pointage?.heure_sortie" class="text-gray-400">
              –{{ day.pointage.heure_sortie.slice(0, 5) }}
            </span>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>

    <!-- Detail panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="selectedDay && selectedDay.isCurrentMonth"
        class="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8 space-y-6"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <CalendarCheck :size="24" class="text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-dark">
                {{ selectedDay.day }} {{ monthNames[month] }} {{ year }}
              </h3>
              <p class="text-xs text-gray-400">Détails de la journée</p>
            </div>
          </div>
          <button
            @click="selectedDay = null"
            class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Pointage Section -->
        <div v-if="selectedDay.pointage" class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Clock :size="20" />
            </div>
            <div>
              <h4 class="font-semibold text-dark">Pointage</h4>
              <p class="text-xs text-gray-400">Horaires enregistrés</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-500">Entrée</span>
              </div>
              <span class="text-sm font-semibold text-dark">
                {{ selectedDay.pointage.heure_entree?.slice(0, 5) || '--:--' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-sm text-gray-500">Sortie</span>
              </div>
              <span class="text-sm font-semibold text-dark">
                {{ selectedDay.pointage.heure_sortie?.slice(0, 5) || '--:--' }}
              </span>
            </div>
            <div v-if="selectedDay.pointage.est_retard" class="pt-2 border-t border-gray-200">
              <div class="flex items-center gap-2 text-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">Retard de {{ selectedDay.pointage.minutes_retard }} min</span>
              </div>
            </div>
            <div v-if="selectedDay.pointage.heures_sup > 0" class="pt-2 border-t border-gray-200">
              <div class="flex items-center gap-2 text-blue-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">{{ selectedDay.pointage.heures_sup }} min supplémentaires</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Absence Section -->
        <div v-if="selectedDay.absences.length" class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CalendarX :size="20" />
            </div>
            <div>
              <h4 class="font-semibold text-dark">Absence</h4>
              <p class="text-xs text-gray-400">Demande enregistrée</p>
            </div>
          </div>
          <div
            v-for="abs in selectedDay.absences"
            :key="abs.id"
            class="bg-orange-50 rounded-2xl p-4 border-l-4 border-orange-400"
          >
            <div class="flex items-start justify-between mb-2">
              <p class="font-semibold text-dark">{{ abs.typeAbsence }}</p>
              <span
                class="text-[10px] font-semibold px-2 py-1 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': abs.statut === 'EN_ATTENTE',
                  'bg-green-100 text-green-700': abs.statut === 'VALIDEE',
                  'bg-red-100 text-red-700': abs.statut === 'REFUSEE',
                }"
              >
                {{ abs.statut.replace("_", " ") }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ abs.motif }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!selectedDay.pointage && !selectedDay.absences.length"
          class="text-center py-8"
        >
          <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <CalendarX :size="32" class="text-gray-400" />
          </div>
          <p class="text-sm text-gray-500 font-medium">Aucun événement ce jour</p>
          <p class="text-xs text-gray-400 mt-1">Aucun pointage ou absence enregistré</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
