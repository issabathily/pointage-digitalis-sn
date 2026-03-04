<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()

const loginAs = (role: 'ADMIN' | 'MANAGER' | 'EMPLOYE') => {
  auth.devLogin(role)
  router.push("/dashboard")
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
      
      <h1 class="text-2xl font-bold mb-6">
        Mode Développement
      </h1>

      <p class="text-gray-500 mb-6">
        Choisir un profil pour tester l’interface
      </p>

      <div class="space-y-3">
        <button
          @click="loginAs('ADMIN')"
          class="w-full bg-purple-600 text-white py-2 rounded-lg hover:opacity-90">
          Se connecter en ADMIN
        </button>

        <button
          @click="loginAs('MANAGER')"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90">
          Se connecter en MANAGER
        </button>

        <button
          @click="loginAs('EMPLOYE')"
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:opacity-90">
          Se connecter en EMPLOYE
        </button>
      </div>

    </div>
  </div>
</template>