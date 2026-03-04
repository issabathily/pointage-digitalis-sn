<script setup lang="ts">
import { LayoutDashboard, Clock, Calendar, BarChart3 } from "lucide-vue-next"
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useAbsencesStore } from "@/stores/absences"
import { computed } from "vue"
import { a } from "vue-router/dist/index-Cu9B0wDz.mjs"


const auth = useAuthStore()
const router = useRouter()
const absencesStore = useAbsencesStore()
const logout = () => {auth.logout(); router.push("/login")};

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



</script>

<template>
  
<div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 shadow-sm p-4">

      <div class="mb-8">
        <h1 class="text-xl font-bold text-dark">
          Digitalis HR
        </h1>
        <p class="text-xs text-gray-400">Gestion RH</p>
      </div>

      <nav class="space-y-2">

        <!-- Dashboard -->
        <RouterLink
          to="/dashboard" class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group" :class="$route.path === '/dashboard' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-primary/10 hover:text-primary'">
          <LayoutDashboard size="18" />
          Dashboard

          <div v-if="$route.path === '/dashboard'"class="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full">
          </div>
        </RouterLink>

        <!-- Pointage -->
        <RouterLink
          to="/pointage" class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group" :class="$route.path === '/pointage' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-primary/10 hover:text-primary'">
          <Clock size="18" />
          Pointage

          <div v-if="$route.path === '/pointage'"class="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full">
          </div>
        </RouterLink>

        <!-- Absences -->
        <RouterLink
          to="/absences"  class="relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group" :class="$route.path === '/absences'  ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-accent/10 hover:text-accent'">
          <div class="flex items-center gap-3">
            <Calendar size="18" />
            Absences
          </div>

          <span
            v-if="pendingCount > 0"
            class="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full
                  animate-pulse shadow-sm"
          >
            {{ pendingCount }}
          </span>
        </RouterLink>

        <!-- Rapports (Admin) -->
        <RouterLink
          v-if="auth.isAdmin"
          to="/reports" class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group" :class="$route.path === '/reports' ? 'bg-secondary text-white shadow-md' : 'text-gray-600 hover:bg-secondary/10 hover:text-secondary'">
          <BarChart3 size="18" />
          Rapports

          <div v-if="$route.path === '/reports'"class="absolute left-0 top-0 h-full w-1 bg-secondary rounded-r-full">
          </div>
        </RouterLink>

        <!-- Employés -->
        <RouterLink
          to="/employees" class="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group" :class="$route.path === '/employees' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-primary/10 hover:text-primary'">
          Employés

          <div v-if="$route.path === '/employees'"class="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full">
          </div>
        </RouterLink>

      </nav>

    </aside>
    <!-- Main content -->
    <div class="flex-1">
      <!-- Navbar -->
      <header class="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between">

  <div>
    <h2 class="text-lg font-semibold text-dark">
      Tableau de bord
    </h2>
  </div>

  <div class="flex items-center gap-6">

    <!-- Avatar -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br
                  from-primary to-secondary
                  flex items-center justify-center text-white font-bold shadow-md">
        {{ auth.user?.nom?.charAt(0) }}
      </div>
      <div class="text-sm">
        <p class="font-semibold text-dark">
          {{ auth.user?.nom }}
        </p>
        <p class="text-gray-400 text-xs">
          {{ auth.user?.role }}
        </p>
      </div>
    </div>
      <button
        @click="logout"
        class="bg-primary text-white px-4 py-2 rounded-lg">
        Déconnexion
      </button>
  </div>
      </header>

      <main class="p-10 transition-all duration-500">
        <router-view />
      </main>
    </div>
  </div>
</template>
