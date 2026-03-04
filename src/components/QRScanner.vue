<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { Html5Qrcode } from "html5-qrcode"

const scannerRef = ref<HTMLDivElement | null>(null)
let scanner: Html5Qrcode | null = null

const emit = defineEmits(["scanned"])

onMounted(() => {
  if (!scannerRef.value) return

  scanner = new Html5Qrcode("qr-reader")

  scanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: 250,
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
  <div class="bg-white p-4 rounded-xl shadow">
    <div id="qr-reader" ref="scannerRef"></div>
  </div>
</template>
