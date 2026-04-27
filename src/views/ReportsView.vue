<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js"
import { Bar } from "vue-chartjs"
import type { ChartOptions } from "chart.js"
import { reportsService, type AttendanceStats } from "@/services/reports.service"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
}

const stats = ref<AttendanceStats>({
  total_employees: 0,
  presents: 0,
  retards: 0,
  absents: 0,
  taux_ponctualite: 0
})

const loading = ref(true)
const error = ref("")

onMounted(async () => {
  try {
    stats.value = await reportsService.getAttendanceStats()
  } catch (e: any) {
    error.value = "Impossible de charger les statistiques."
    console.error(e)
  } finally {
    loading.value = false
  }
})

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const exportPDF = () => {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text("Rapport de présence - Digitalis HR", 14, 20)

  doc.setFontSize(12)
  doc.text("Date : " + new Date().toLocaleDateString(), 14, 30)

  autoTable(doc, {
    startY: 40,
    head: [["Statut", "Nombre"]],
    body: [
      ["Présents", stats.value.presents.toString()],
      ["Retards", stats.value.retards.toString()],
      ["Absents", stats.value.absents.toString()],
      ["Taux ponctualité", stats.value.taux_ponctualite + "%"]
    ],
  })

  doc.save("rapport-pointage.pdf")
}

const chartData = computed(() => ({
  labels: ["Présents", "Retards", "Absents"],
  datasets: [
    {
      label: "Statistiques RH",
      data: [
        stats.value.presents,
        stats.value.retards,
        stats.value.absents
      ],
      backgroundColor: [
        "#239ad4", // secondary
        "#e07e27", // accent
        "#e21c57"  // primary
      ]
    }
  ]
}))
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-dark">Rapports</h1>
        <p class="text-gray-500 text-sm mt-1">Analyse des absences et retards</p>
      </div>
      <button
        @click="exportPDF"
        :disabled="loading"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Exporter en PDF
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl">
      {{ error }}
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-2xl shadow-sm">
        <p class="text-gray-500 text-sm">Présents</p>
        <h2 class="text-2xl font-bold text-secondary">
          {{ stats.presents }}
        </h2>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm">
        <p class="text-gray-500 text-sm">Retards</p>
        <h2 class="text-2xl font-bold text-accent">
          {{ stats.retards }}
        </h2>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm">
        <p class="text-gray-500 text-sm">Absents</p>
        <h2 class="text-2xl font-bold text-primary">
          {{ stats.absents }}
        </h2>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm">
        <p class="text-gray-500 text-sm">Taux ponctualité</p>
        <h2 class="text-2xl font-bold text-dark">
          {{ stats.taux_ponctualite }}%
        </h2>
      </div>
    </div>

    <!-- Chart -->
    <div v-if="!loading" class="bg-white rounded-2xl shadow-sm p-6">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

  </div>
</template>
