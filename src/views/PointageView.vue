<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import QrcodeVue from "qrcode.vue"
import { useAuthStore } from "@/stores/auth"
import { QrCode, Sunrise, Sunset } from "lucide-vue-next"
import api from "@/services/api"

const auth = useAuthStore()
const today = new Date().toISOString().split("T")[0]

const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1024)
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}
onMounted(() => {
  updateViewportWidth()
  window.addEventListener("resize", updateViewportWidth, { passive: true })
  fetchActiveSession("ENTREE")
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateViewportWidth)
})

const qrSize = computed(() => {
  if (viewportWidth.value < 380) return 210
  if (viewportWidth.value < 640) return 240
  return 280
})

const managerSession = ref<any>(null)
const loadingSession = ref(true)
const sessionError = ref("")
const currentType = ref<"ENTREE" | "SORTIE">("ENTREE")

const hasActiveSession = computed(() => {
  return managerSession.value && managerSession.value.date === today && managerSession.value.session_id
})

const employeeQrPayload = computed(() => {
  if (!managerSession.value) return ""
  // Simplifier le payload pour le QR code
  const payload = {
    k: "E", // kind: EMPLOYEE
    s: managerSession.value.session_id,
    d: today,
    e: auth.user?.id ?? 0,
    n: auth.user?.nom ?? "Employe",
    t: currentType.value,
  }
  return JSON.stringify(payload)
})

const fetchActiveSession = async (type: "ENTREE" | "SORTIE") => {
  loadingSession.value = true
  sessionError.value = ""
  currentType.value = type
  try {
    const response = await api.get(`/qr/manager/session/active/?type=${type}`)
    managerSession.value = response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      sessionError.value = `Aucune session ${type.toLowerCase()} active pour aujourd'hui`
    } else {
      console.error("Erreur lors de la récupération de la session:", error)
      sessionError.value = "Erreur de connexion au serveur"
    }
  } finally {
    loadingSession.value = false
  }
}
</script>

<template>
  <div class="space-y-6 sm:space-y-8 px-0 sm:px-1">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h1 class="text-xl font-bold text-dark">Mon QR de Presence</h1>
        <p class="text-sm text-gray-400">Montrez ce QR au manager pour validation</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8">
      <div v-if="loadingSession" class="text-center space-y-3">
        <p class="text-sm text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="!hasActiveSession" class="text-center space-y-3">
        <p class="text-sm font-semibold text-amber-600">{{ sessionError || "Aucun QR manager actif pour aujourd'hui." }}</p>
        <p class="text-sm text-gray-500">
          Demande au manager de generer le code du jour depuis la page "Generer QR".
        </p>
      </div>

      <div v-else class="flex flex-col items-center text-center gap-4">
        <!-- Boutons de sélection du type -->
        <div class="grid grid-cols-2 gap-3 w-full max-w-xs">
          <button
            @click="fetchActiveSession('ENTREE')"
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all"
            :class="currentType === 'ENTREE' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/30'"
          >
            <Sunrise :size="24" />
            <span class="text-sm font-semibold">Entrée (8h)</span>
          </button>
          <button
            @click="fetchActiveSession('SORTIE')"
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all"
            :class="currentType === 'SORTIE' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-gray-200 text-gray-500 hover:border-secondary/30'"
          >
            <Sunset :size="24" />
            <span class="text-sm font-semibold">Sortie (17h)</span>
          </button>
        </div>

        <div class="p-4 bg-white border rounded-3xl shadow-xl" 
             :class="currentType === 'ENTREE' ? 'border-primary/20' : 'border-secondary/20'">
          <QrcodeVue :value="employeeQrPayload" :size="qrSize" level="H" render-as="canvas" />
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <QrCode class="w-4 h-4 text-primary" />
          QR {{ currentType === 'ENTREE' ? "d'entrée" : "de sortie" }} - {{ today }}
        </div>
        <button
          @click="fetchActiveSession(currentType)"
          class="text-xs text-primary hover:text-primary/80 underline"
        >
          Rafraîchir la session
        </button>
        <p class="text-sm text-gray-500 max-w-md">
          Presente ce QR au manager. Il doit le scanner pour confirmer ta {{ currentType === 'ENTREE' ? "présence" : "sortie" }}.
        </p>
      </div>
    </div>

  </div>
</template>