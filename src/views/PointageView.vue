<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import QrcodeVue from "qrcode.vue"
import { useAuthStore } from "@/stores/auth"
import { QrCode } from "lucide-vue-next"

const auth = useAuthStore()
const today = new Date().toISOString().split("T")[0]

const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1024)
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}
onMounted(() => {
  updateViewportWidth()
  window.addEventListener("resize", updateViewportWidth, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateViewportWidth)
})

const qrSize = computed(() => {
  if (viewportWidth.value < 380) return 210
  if (viewportWidth.value < 640) return 240
  return 280
})

const managerSessionRaw =
  sessionStorage.getItem("manager:qr:session") || localStorage.getItem("manager:qr:session")
let managerSession: any = null
try {
  managerSession = managerSessionRaw ? JSON.parse(managerSessionRaw) : null
} catch {
  managerSession = null
}

const hasActiveSession = computed(() => {
  return managerSession && managerSession.date === today && managerSession.sessionId
})

const employeeQrPayload = computed(() => {
  const payload = {
    kind: "EMPLOYEE_ATTENDANCE_QR",
    sessionId: managerSession?.sessionId ?? null,
    date: today,
    employeeId: auth.user?.id ?? 0,
    employeeNom: auth.user?.nom ?? "Employe",
    type: managerSession?.type ?? "ENTREE",
  }
  return JSON.stringify(payload)
})
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
      <div v-if="!hasActiveSession" class="text-center space-y-3">
        <p class="text-sm font-semibold text-amber-600">Aucun QR manager actif pour aujourd'hui.</p>
        <p class="text-sm text-gray-500">
          Demande au manager de generer le code du jour depuis la page "Generer QR".
        </p>
      </div>

      <div v-else class="flex flex-col items-center text-center gap-4">
        <div class="p-4 bg-white border rounded-3xl shadow-xl border-primary/20">
          <QrcodeVue :value="employeeQrPayload" :size="qrSize" level="H" render-as="svg" />
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <QrCode class="w-4 h-4 text-primary" />
          QR lie a la session du {{ today }} ({{ managerSession?.type }})
        </div>
        <p class="text-sm text-gray-500 max-w-md">
          Presente ce QR au manager. Il doit le scanner pour confirmer ta presence.
        </p>
      </div>
    </div>

  </div>
</template>