<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  variant: "primary" | "secondary" | "accent"
}>()

const variants = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    bar: "bg-primary"
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    bar: "bg-secondary"
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    bar: "bg-accent"
  }
}

const icons: Record<string, string> = {
  "Demandes en attente": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  "Congés restants": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>`,
  "Heures ce mois": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
  "Présents aujourd'hui": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`,
  "En retard": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>`,
  "Absents": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>`,
}

const defaultIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`
</script>

<template>
  <div
    class="relative overflow-hidden bg-white rounded-3xl p-6
           shadow-sm border border-gray-100
           transition-all duration-300
           hover:shadow-xl hover:-translate-y-1"
  >
    <!-- Bande latérale premium -->
    <div
      class="absolute left-0 top-0 h-full w-1"
      :class="variants[variant].bar"
    ></div>

    <div class="flex justify-between items-center">

      <div>
        <p class="text-sm text-gray-500 mb-2">{{ title }}</p>
        <h2 class="text-3xl font-bold text-dark">{{ value }}</h2>
      </div>

      <!-- Badge avec icône SVG -->
      <div
        class="w-14 h-14 flex items-center justify-center rounded-2xl"
        :class="[variants[variant].bg, variants[variant].text]"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          v-html="icons[title] ?? defaultIcon"
        />
      </div>

    </div>
  </div>
</template>