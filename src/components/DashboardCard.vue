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
        <p class="text-sm text-gray-500 mb-2">
          {{ title }}
        </p>

        <h2 class="text-3xl font-bold text-dark">
          {{ value }}
        </h2>
      </div>

      <!-- Badge rond moderne -->
      <div
        class="w-14 h-14 flex items-center justify-center
               rounded-2xl"
        :class="[variants[variant].bg, variants[variant].text]"
      >
        ●
      </div>

    </div>
  </div>
</template>