<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { Html5Qrcode } from "html5-qrcode"

const scannerRef = ref<HTMLDivElement | null>(null)
let scanner: Html5Qrcode | null = null
let isRunning = false

const emit = defineEmits(["scanned"])

onMounted(() => {
  if (!scannerRef.value) return

  scanner = new Html5Qrcode("qr-reader")

  const viewport = Math.min(window.innerWidth || 360, 480)
  const qrSize = Math.max(180, Math.min(260, viewport - 80))

  scanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: qrSize, height: qrSize },
    },
    (decodedText) => {
      emit("scanned", decodedText)
      stopScanner()
    },
    (errorMessage) => {
      // Ignorer les erreurs de scan normales
    }
  ).then(() => {
    isRunning = true
  }).catch((err) => {
    console.error("Erreur de démarrage du scanner:", err)
  })
})

const stopScanner = async () => {
  if (scanner && isRunning) {
    try {
      await scanner.stop()
      isRunning = false
    } catch (err) {
      console.error("Erreur lors de l'arrêt du scanner:", err)
    }
  }
}

onBeforeUnmount(async () => {
  await stopScanner()
  if (scanner) {
    try {
      await scanner.clear()
    } catch (err) {
      console.error("Erreur lors du nettoyage du scanner:", err)
    }
  }
})

</script>

<template>
  <div class="bg-white p-3 sm:p-4 rounded-xl shadow overflow-hidden">
    <div id="qr-reader" ref="scannerRef" class="w-full max-w-full"></div>
  </div>
</template>
