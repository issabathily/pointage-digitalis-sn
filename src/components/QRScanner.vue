<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { Html5Qrcode } from "html5-qrcode"

const scannerRef = ref<HTMLDivElement | null>(null)
let scanner: Html5Qrcode | null = null

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
      scanner?.stop()
    },
    (errorMessage) => {
      console.log("Scan error:", errorMessage)
    }
  )
})

onBeforeUnmount(async () => {
  if (scanner) {
    await scanner.stop()
    await scanner.clear()
  }
})

</script>

<template>
  <div class="bg-white p-3 sm:p-4 rounded-xl shadow overflow-hidden">
    <div id="qr-reader" ref="scannerRef" class="w-full max-w-full"></div>
  </div>
</template>
