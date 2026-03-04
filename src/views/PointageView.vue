<script setup lang="ts">
import { ref } from "vue"
import QRScanner from "@/components/QRScanner.vue"

const showScanner = ref(false)

const handleScan = async (data: string) => {
  if (QRScanner) {
    await QRScanner.stop()
    await QRScanner.clear()
  }

  alert("Pointage enregistré pour : " + data)
  showScanner.value = false
}

</script>

<template>
  <div class="space-y-6">

    <h1 class="text-2xl font-bold text-dark">
      Pointage
    </h1>

    <div class="bg-white rounded-2xl shadow-sm p-6">
      <p class="text-gray-500 mb-4">
        Scanner le QR Code pour pointer
      </p>

      <button
        @click="showScanner = true"
        class="bg-primary text-white px-6 py-3 rounded-lg
               hover:bg-secondary transition-all duration-200"
      >
        Ouvrir le scanner
      </button>

      <div v-if="showScanner" class="mt-6">
        <QRScanner @scanned="handleScan" />
      </div>

    </div>

  </div>
</template>
