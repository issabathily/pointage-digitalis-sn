<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import QrcodeVue from "qrcode.vue"
import { QrCode, Sunrise, Sunset, RefreshCw } from "lucide-vue-next"
import QRScanner from "@/components/QRScanner.vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { usePointageStore } from "@/stores/pointages"
import api from "@/services/api"

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
  try {
    const response = await api.post("/qr/manager/session/create/", { type })
    const sessionData = response.data
    
    // Simplifier le payload pour le QR code
    const payload = {
      s: sessionData.session_id,
      t: sessionData.type,
      d: sessionData.date,
    }
    currentQrData.value = JSON.stringify(payload)
    qrType.value = type
    sessionStorage.setItem("manager:qr:session", JSON.stringify(sessionData))
    scanResult.value = ""
    scanError.value = ""
  } catch (error) {
    console.error("Erreur lors de la génération du QR:", error)
    scanError.value = "Erreur lors de la génération du QR code."
  } finally {
    loadingQR.value = false
  }
}

// Générer le QR d'entrée par défaut (8h)
generateQR("ENTREE")

const formatTime = (timeStr: string | null) => {
  if (!timeStr) return "--:--"
  // Format: "14:03:44.395631" -> "14:03"
  const parts = timeStr.split(":")
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return timeStr
}

const handleEmployeeScan = async (decodedText: string) => {
  scanError.value = ""
  scanResult.value = ""

  let parsed: any
  let managerSessionData: any

  try {
    parsed = JSON.parse(decodedText)
    managerSessionData = JSON.parse(sessionStorage.getItem("manager:qr:session") || "{}")
  } catch {
    scanError.value = "QR invalide: format non reconnu."
    return
  }

  // Vérifier le nouveau format simplifié
  if (parsed?.k !== "E") {
    scanError.value = "Ce QR n'est pas un QR employe."
    return
  }

  if (parsed?.d !== managerSessionData?.date) {
    scanError.value = "Date invalide: QR employe hors session du jour."
    return
  }

  if (!parsed?.s || parsed.s !== managerSessionData?.session_id) {
    scanError.value = "Session invalide: demande a l'employe de recharger son QR."
    return
  }

  await pointageStore.confirmerPointageDepuisScan({
    employeeId: Number(parsed.e) || 0,
    employeeNom: parsed.n ?? "Employe",
    type: parsed.t === "SORTIE" ? "SORTIE" : "ENTREE",
    date: parsed.d,
  })

  scanResult.value = `Presence confirmee pour ${parsed.n ?? "Employe"}.`
  showScanner.value = false
  
  // Rafraîchir la liste des pointages après un scan réussi
  await pointageStore.fetchTodayPointages()
}

// Charger les pointages du jour au montage
onMounted(() => {
  updateViewportWidth()
  window.addEventListener("resize", updateViewportWidth, { passive: true })
  generateQR("ENTREE")
  pointageStore.fetchTodayPointages()
})

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
        <QrcodeVue :value="currentQrData" :size="qrSize" level="H" render-as="canvas" />
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

    <!-- Liste des pointages du jour -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
      <h3 class="text-base font-bold text-dark mb-4">Pointages du jour</h3>
      <div v-if="pointageStore.pointages.length === 0" class="text-center py-6">
        <p class="text-sm text-gray-500">Aucun pointage enregistre aujourd'hui</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="pointage in pointageStore.pointages"
          :key="pointage.id"
          class="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-sm font-semibold text-primary">
                {{ (pointage.user_nom || pointage.userNom || '?').charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="text-sm font-semibold text-dark">
                {{ pointage.user_nom || pointage.userNom || 'Employé' }} {{ pointage.user_prenom || '' }}
              </p>
              <p class="text-xs text-gray-500">
                Entrée: {{ formatTime(pointage.heure_entree) }}
                <span v-if="pointage.heure_sortie">| Sortie: {{ formatTime(pointage.heure_sortie) }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="pointage.est_retard"
              class="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700"
            >
              Retard
            </span>
            <span
              v-if="pointage.heures_sup > 0"
              class="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700"
            >
              +{{ pointage.heures_sup }}min
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
