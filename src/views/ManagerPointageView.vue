<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import QrcodeVue from "qrcode.vue"
import { QrCode, Sunrise, Sunset, RefreshCw } from "lucide-vue-next"
import QRScanner from "@/components/QRScanner.vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { usePointageStore } from "@/stores/pointages"

const pointageStore = usePointageStore()

const currentQrData = ref("")
const qrType = ref("")
const showScanner = ref(false)
const scanResult = ref("")
const scanError = ref("")
const loadingQR = ref(false)

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
  return 300
})

const generateQR = async (type: "ENTREE" | "SORTIE") => {
  loadingQR.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  const today = new Date().toISOString().split("T")[0]
  const payload = {
    kind: "MANAGER_DAILY_QR",
    type,
    date: today,
    sessionId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
  }
  currentQrData.value = JSON.stringify(payload)
  qrType.value = type
  sessionStorage.setItem("manager:qr:session", JSON.stringify(payload))
  scanResult.value = ""
  scanError.value = ""
  loadingQR.value = false
}

// Générer le QR d'entrée par défaut (8h)
generateQR("ENTREE")

const handleEmployeeScan = async (decodedText: string) => {
  scanError.value = ""
  scanResult.value = ""

  let parsed: any
  let managerPayload: any

  try {
    parsed = JSON.parse(decodedText)
    managerPayload = JSON.parse(currentQrData.value)
  } catch {
    scanError.value = "QR invalide: format non reconnu."
    return
  }

  if (parsed?.kind !== "EMPLOYEE_ATTENDANCE_QR") {
    scanError.value = "Ce QR n'est pas un QR employe."
    return
  }

  if (parsed?.date !== managerPayload?.date) {
    scanError.value = "Date invalide: QR employe hors session du jour."
    return
  }

  if (!parsed?.sessionId || parsed.sessionId !== managerPayload?.sessionId) {
    scanError.value = "Session invalide: demande a l'employe de recharger son QR."
    return
  }

  await pointageStore.confirmerPointageDepuisScan({
    employeeId: Number(parsed.employeeId) || 0,
    employeeNom: parsed.employeeNom ?? "Employe",
    type: parsed.type === "SORTIE" ? "SORTIE" : "ENTREE",
    date: parsed.date,
  })

  scanResult.value = `Presence confirmee pour ${parsed.employeeNom ?? "Employe"}.`
  showScanner.value = false
}

</script>

<template>
  <div class="space-y-6 sm:space-y-8 px-0 sm:px-1">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
        <QrCode class="w-5 h-5 text-primary" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-dark">Générer Code QR</h1>
        <p class="text-sm text-gray-400">Le manager genere puis scanne les QR employes</p>
      </div>
    </div>

    <!-- Actions (Sélection du type) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <button
        @click="generateQR('ENTREE')"
        class="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
        :class="qrType === 'ENTREE' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-500 hover:border-primary/30 hover:bg-gray-50'"
      >
        <div class="p-3 rounded-full" :class="qrType === 'ENTREE' ? 'bg-primary/10' : 'bg-gray-100'">
          <Sunrise :size="28" />
        </div>
        <div class="text-center">
          <p class="font-bold text-lg">Entrée (8h00)</p>
          <p class="text-sm text-current opacity-75">Pointage du matin</p>
        </div>
      </button>

      <button
        @click="generateQR('SORTIE')"
        class="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
        :class="qrType === 'SORTIE' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-100 bg-white text-gray-500 hover:border-secondary/30 hover:bg-gray-50'"
      >
        <div class="p-3 rounded-full" :class="qrType === 'SORTIE' ? 'bg-secondary/10' : 'bg-gray-100'">
          <Sunset :size="28" />
        </div>
        <div class="text-center">
          <p class="font-bold text-lg">Sortie (17h00)</p>
          <p class="text-sm text-current opacity-75">Pointage du soir</p>
        </div>
      </button>
    </div>

    <!-- Zone d'affichage du QR Code -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8 flex flex-col items-center justify-center text-center gap-5 sm:gap-6 relative overflow-hidden">

      <!-- Déco fond -->
      <div
        class="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 pointer-events-none blur-3xl transition-colors duration-500"
        :class="qrType === 'ENTREE' ? 'bg-primary' : 'bg-secondary'"
      ></div>

      <div class="space-y-1 z-10">
        <h2 class="text-2xl font-black text-dark tracking-tight uppercase">
          SCAN {{ qrType === 'ENTREE' ? "D'ENTRÉE" : 'DE SORTIE' }}
        </h2>
        <p class="text-gray-500 font-medium">Les employes affichent leur QR lie a ce code du jour</p>
      </div>

      <!-- Loader -->
      <div v-if="loadingQR" class="z-10 py-8">
        <LoadingSpinner message="Génération du QR code..." />
      </div>

      <!-- QR Code lui-même -->
      <div
        v-else
        class="p-4 bg-white border rounded-3xl shadow-xl transition-all duration-300 z-10"
        :class="qrType === 'ENTREE' ? 'border-primary/20 shadow-primary/10' : 'border-secondary/20 shadow-secondary/10'"
      >
        <QrcodeVue :value="currentQrData" :size="qrSize" level="H" render-as="svg" />
      </div>

      <!-- Bouton d'actualisation (générer un nouvel ID pour forcer la sécurité temporaire) -->
      <button 
        @click="generateQR(qrType as 'ENTREE' | 'SORTIE')"
        class="flex items-center gap-2 mt-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all z-10"
        :class="qrType === 'ENTREE' ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-secondary bg-secondary/10 hover:bg-secondary/20'"
      >
        <RefreshCw :size="16" />
        Regénérer le code (Rafraîchir)
      </button>

      <button
        @click="showScanner = !showScanner"
        class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-all z-10"
      >
        {{ showScanner ? "Fermer le scanner" : "Scanner le QR employe" }}
      </button>

      <div v-if="scanResult" class="text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-xl">
        {{ scanResult }}
      </div>
      <div v-if="scanError" class="text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-xl">
        {{ scanError }}
      </div>

      <!-- Tip info -->
      <div class="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2 mt-4 z-10 border border-gray-100">
        <QrCode class="w-3.5 h-3.5 text-gray-400 shrink-0" />
        Ce QR code contient la date, le type et un identifiant de session.
      </div>
      
    </div>

    <div v-if="showScanner" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
      <h3 class="text-base font-bold text-dark mb-3">Scanner QR employe</h3>
      <QRScanner @scanned="handleEmployeeScan" />
      <p class="text-xs text-gray-400 mt-3">
        Le QR employe doit correspondre a la session du code manager genere aujourd'hui.
      </p>
    </div>

  </div>
</template>
