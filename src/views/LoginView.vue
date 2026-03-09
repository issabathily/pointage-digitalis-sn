<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")

async function handleLogin() {

  try {

    await auth.login(email.value, password.value)

    router.push("/dashboard")

  } catch (e) {

    error.value = "Email ou mot de passe incorrect"

  }

}
</script>

<template>
<div class="min-h-screen flex items-center justify-center bg-gray-100">

<div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

<h1 class="text-2xl font-bold text-center mb-6">
Connexion
</h1>

<form @submit.prevent="handleLogin" class="space-y-4">

<input
v-model="email"
type="email"
placeholder="Email"
class="w-full border rounded-lg p-2"
/>

<input
v-model="password"
type="password"
placeholder="Mot de passe"
class="w-full border rounded-lg p-2"
/>

<p v-if="error" class="text-red-500 text-sm">
{{ error }}
</p>

<button
type="submit"
class="w-full bg-purple-600 text-white py-2 rounded-lg hover:opacity-90"
>
Se connecter
</button>

</form>

</div>

</div>
</template>