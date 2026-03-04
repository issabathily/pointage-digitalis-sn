<script setup lang="ts">
import { ref } from "vue"
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)
import type { ChartOptions } from "chart.js"

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
}
import { onMounted } from "vue"
import { computed } from "vue"
import { useEmployeesStore } from "@/stores/employees"

const employeesStore = useEmployeesStore()
const stats = computed(() => {
  const presents = employeesStore.employees.filter(e => e.statut === "PRESENT").length
  const retards = employeesStore.employees.filter(e => e.statut === "RETARD").length
  const absents = employeesStore.employees.filter(e => e.statut === "ABSENT").length

  const total = employeesStore.employees.length

  const tauxPonctualite = total > 0
    ? ((presents / total) * 100).toFixed(1)
    : 0

  return {
    presents,
    retards,
    absents,
    tauxPonctualite
  }
})




onMounted(() => {
  employeesStore.fetchEmployees()
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
    head: [["Nom", "Rôle", "Statut"]],
    body: employeesStore.employees.map(emp => [
      emp.nom,
      emp.role,
      emp.statut
    ]),
  })

  doc.save("rapport-pointage.pdf")
}


// Données simulées (backend viendra après)
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
  <div class="flex justify-between items-center mb-4">
  <h1 class="text-2xl font-bold text-dark">Rapports</h1>

  <button
    @click="exportPDF"
    class="bg-primary text-white px-4 py-2 rounded-lg
           hover:bg-secondary transition-all duration-200"
  >
    Exporter en PDF
  </button>
</div>

  <div class="space-y-6">

    <div>
      <h1 class="text-2xl font-bold text-dark">
        Rapports & Statistiques
      </h1>
      <p class="text-gray-500">
        Analyse des absences et retards
      </p>
    </div>
  <div class="grid grid-cols-4 gap-6 mb-6">

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
      {{ stats.tauxPonctualite }}%
    </h2>
  </div>

</div>

    <div class="bg-white rounded-2xl shadow-sm p-6">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

  </div>
</template>
