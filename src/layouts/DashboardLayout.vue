<script setup lang="ts">
import { LayoutDashboard, Clock, Calendar, CalendarDays, BarChart3, Users, LogOut, PanelLeftClose, PanelLeftOpen, QrCode } from "lucide-vue-next"
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useAbsencesStore } from "@/stores/absences"
import { computed, ref } from "vue"
import digitalisLogo from "@/assets/logo-digitalis.png"
import LoadingSpinner from "@/components/LoadingSpinner.vue"

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const absencesStore = useAbsencesStore()
const logout = () => { auth.logout(); router.push("/login") }

const SIDEBAR_STORAGE_KEY = "ui:dashboardSidebarCollapsed"
const sidebarCollapsed = ref<boolean>(localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1")
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarCollapsed.value ? "1" : "0")
}

const pendingCount = computed(() => {
  if (!auth.user) return 0

  if (auth.user.role === "MANAGER") {
    return absencesStore.absences.filter(
      a => a.role === "EMPLOYE" && a.statut === "EN_ATTENTE"
    ).length
  }

  if (auth.user.role === "ADMIN") {
    return absencesStore.absences.filter(
      a => a.role === "MANAGER" && a.statut === "EN_ATTENTE"
    ).length
  }

  if (auth.user.role === "EMPLOYE") {
    return absencesStore.absences.filter(
      a => a.userId === auth.user?.id && a.statut === "EN_ATTENTE"
    ).length
  }

  return 0
})

const bottomNavItems = computed(() => {
  const isPrivileged = auth.isAdmin || auth.isManager
  if (isPrivileged) {
    return [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/absences", label: "Absences", icon: Calendar, badge: pendingCount.value },
      { to: "/mon-calendrier", label: "Calendrier", icon: CalendarDays },
      { to: "/employees", label: "Employés", icon: Users },
      { to: "/manager-pointage", label: "QR", icon: QrCode },
    ]
  }

  return [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/pointage", label: "Pointage", icon: Clock },
    { to: "/absences", label: "Absences", icon: Calendar, badge: pendingCount.value },
    { to: "/mon-calendrier", label: "Calendrier", icon: CalendarDays },
  ]
})
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

    <!-- Sidebar -->
    <aside
      class="hidden md:flex bg-white border-r border-gray-100 shadow-sm flex-col transition-all duration-300 sticky top-0 h-screen shrink-0"
      :class="sidebarCollapsed ? 'w-20' : 'w-64'"
    >

      <!-- Logo -->
      <div class="p-4 mb-2">
        <div class="flex items-center min-w-0" :class="sidebarCollapsed ? 'justify-center' : 'gap-3'">
          <div v-if="!sidebarCollapsed" class="shrink-0 min-w-0">
            <img
              :src="digitalisLogo"
              alt="Digitalis"
              class="object-contain max-w-full h-14 w-auto"
            />
          </div>
          <button
            type="button"
            @click="toggleSidebar"
            class="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 shrink-0"
            :class="sidebarCollapsed ? '' : 'ml-auto'"
            :aria-label="sidebarCollapsed ? 'Déplier la barre latérale' : 'Plier la barre latérale'"
            :title="sidebarCollapsed ? 'Déplier' : 'Plier'"
          >
            <component :is="sidebarCollapsed ? PanelLeftOpen : PanelLeftClose" :size="18" />
          </button>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 min-h-0 space-y-2 overflow-y-auto" :class="sidebarCollapsed ? 'px-2' : 'px-4'">

        <p v-show="!sidebarCollapsed" class="text-[10px] uppercase tracking-[1.2px] text-gray-400 font-medium px-1 pb-1">Principal</p>

        <!-- Dashboard -->
        <RouterLink
          to="/dashboard"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/dashboard'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
          ]"
          :title="sidebarCollapsed ? 'Dashboard' : undefined"
        >
          <LayoutDashboard :size="18" />
          <span v-show="!sidebarCollapsed">Dashboard</span>
          <div v-if="$route.path === '/dashboard'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

        <!-- Pointage -->
        <RouterLink
          to="/pointage"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/pointage'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
          ]"
          :title="sidebarCollapsed ? 'Pointage' : undefined"
        >
          <Clock :size="18" />
          <span v-show="!sidebarCollapsed">Pointage</span>
          <div v-if="$route.path === '/pointage'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

        <!-- Absences -->
        <RouterLink
          to="/absences"
          class="relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/absences'
              ? 'bg-accent text-white shadow-md'
              : 'text-gray-600 hover:bg-accent/10 hover:text-accent'
          ]"
          :title="sidebarCollapsed ? 'Absences' : undefined"
        >
          <div class="flex items-center gap-3" :class="sidebarCollapsed ? 'justify-center' : ''">
            <Calendar :size="18" />
            <span v-show="!sidebarCollapsed">Absences</span>
          </div>
          <span
            v-if="pendingCount > 0 && !sidebarCollapsed"
            class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-sm"
          >
            {{ pendingCount }}
          </span>
        </RouterLink>

        <!-- Mon calendrier -->
        <RouterLink
          to="/mon-calendrier"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/mon-calendrier'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
          ]"
          :title="sidebarCollapsed ? 'Mon calendrier' : undefined"
        >
          <CalendarDays :size="18" />
          <span v-show="!sidebarCollapsed">Mon calendrier</span>
          <div v-if="$route.path === '/mon-calendrier'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

        <p v-show="!sidebarCollapsed" class="text-[10px] uppercase tracking-[1.2px] text-gray-400 font-medium px-1 pt-3 pb-1">Gestion</p>

        <!-- Générer QR (Admin & Manager) -->
        <RouterLink
          v-if="auth.isAdmin || auth.user?.role === 'MANAGER'"
          to="/manager-pointage"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/manager-pointage'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
          ]"
          :title="sidebarCollapsed ? 'Générer QR' : undefined"
        >
          <QrCode :size="18" />
          <span v-show="!sidebarCollapsed">Générer QR</span>
          <div v-if="$route.path === '/manager-pointage'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

        <!-- Employés -->
        <RouterLink
          to="/employees"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/employees'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
          ]"
          :title="sidebarCollapsed ? 'Employés' : undefined"
        >
          <Users :size="18" />
          <span v-show="!sidebarCollapsed">Employés</span>
          <div v-if="$route.path === '/employees'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

        <!-- Rapports (Admin) -->
        <RouterLink
          v-if="auth.isAdmin"
          to="/reports"
          class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          :class="[
            sidebarCollapsed ? 'justify-center px-2' : '',
            $route.path === '/reports'
              ? 'bg-secondary text-white shadow-md'
              : 'text-gray-600 hover:bg-secondary/10 hover:text-secondary'
          ]"
          :title="sidebarCollapsed ? 'Rapports' : undefined"
        >
          <BarChart3 :size="18" />
          <span v-show="!sidebarCollapsed">Rapports</span>
          <div v-if="$route.path === '/reports'" class="absolute left-0 top-0 h-full w-1 bg-white/30 rounded-r-full" />
        </RouterLink>

      </nav>

      <!-- User footer -->
      <div class="p-4 mt-4 border-t border-gray-100">
        <div
          class="flex items-center gap-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
          :class="sidebarCollapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shrink-0">
            {{ auth.user?.nom?.charAt(0) }}
          </div>
          <div v-show="!sidebarCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-dark truncate">{{ auth.user?.nom }}</p>
            <p class="text-xs text-gray-400">{{ auth.user?.role }}</p>
          </div>
          <button
            @click="logout"
            class="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 shrink-0"
            :title="sidebarCollapsed ? 'Déconnexion' : 'Déconnexion'"
            :aria-label="sidebarCollapsed ? 'Déconnexion' : 'Déconnexion'"
          >
            <LogOut :size="16" />
          </button>
        </div>
      </div>

    </aside>

    <!-- Main content -->
    <div class="flex-1 relative">

      <!-- Loading overlay initialisation -->
      <div
        v-if="auth.isLoading"
        class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      >
        <LoadingSpinner message="Chargement de votre session..." />
      </div>

      <!-- Mobile header -->
      <div class="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <img :src="digitalisLogo" alt="Digitalis" class="h-9 w-auto shrink-0" />
            <div class="min-w-0">
              <p class="text-sm font-semibold text-dark truncate">{{ auth.user?.nom }}</p>
              <p class="text-[11px] text-gray-400 truncate">{{ auth.user?.role }}</p>
            </div>
          </div>
          <button
            @click="logout"
            class="inline-flex items-center justify-center rounded-xl p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <LogOut :size="18" />
          </button>
        </div>
      </div>

      <main class="p-4 md:p-10 pb-24 md:pb-10 transition-all duration-500 max-w-full overflow-x-hidden">
        <router-view />
      </main>

      <!-- Bottom navigation (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100">
        <div class="grid" :class="(auth.isAdmin || auth.isManager) ? 'grid-cols-5' : 'grid-cols-4'">
          <RouterLink
            v-for="item in bottomNavItems"
            :key="item.to"
            :to="item.to"
            class="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
            :class="route.path === item.to ? 'text-primary' : 'text-gray-500 hover:text-primary'"
          >
            <component :is="item.icon" :size="20" />
            <span class="leading-none">{{ item.label }}</span>
            <span
              v-if="item.badge && item.badge > 0"
              class="absolute top-1.5 right-4 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </div>
      </nav>

    </div>
  </div>
</template>