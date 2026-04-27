<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  type: 'line' | 'bar' | 'doughnut'
  data: any
  options?: any
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  height: 300
})

const chartComponent = computed(() => {
  switch (props.type) {
    case 'line': return Line
    case 'bar': return Bar
    case 'doughnut': return Doughnut
    default: return Line
  }
})

const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif"
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif"
      }
    }
  },
  scales: props.type !== 'doughnut' ? {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif"
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11,
          family: "'Inter', sans-serif"
        }
      }
    }
  } : {},
  ...props.options
}))
</script>

<template>
  <div :style="{ height: `${height}px` }" class="w-full">
    <component
      :is="chartComponent"
      :data="data"
      :options="defaultOptions"
    />
  </div>
</template>
