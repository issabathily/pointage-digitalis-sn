<!--<script setup lang="ts">-->
<!--import { ref } from "vue"-->
<!--import { useAuthStore } from "@/stores/auth"-->
<!--import { useRouter } from "vue-router"-->
<!--import digitalisLogo from "@/assets/logo-digitalis.png"-->
<!--import LoadingSpinner from "@/components/LoadingSpinner.vue"-->
<!--const auth = useAuthStore()-->
<!--const router = useRouter()-->

<!--const email = ref("")-->
<!--const password = ref("")-->
<!--const error = ref("")-->

<!--async function handleLogin() {-->
<!--  try {-->
<!--    await auth.login(email.value, password.value)-->
<!--    if (auth.user?.role === "MANAGER") {-->
<!--      router.push("/manager-pointage")-->
<!--      return-->
<!--    }-->

<!--    if (auth.user?.role === "ADMIN") {-->
<!--      router.push("/reports")-->
<!--      return-->
<!--    }-->

<!--    router.push("/dashboard")-->
<!--  } catch (err) {-->
<!--    console.error(err)-->
<!--    error.value = "Identifiants invalides ou compte non autorise."-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div class="min-h-screen flex items-center justify-center ">-->

<!--    <div class="relative   p-10 w-full max-w-md">-->

<!--      &lt;!&ndash; Header &ndash;&gt;-->
<!--      <div class="flex flex-col items-center mb-8">-->
<!--        <div class=" flex items-center justify-center text-white font-bold text-xl mb-4">-->
<!--         <img-->
<!--              :src="digitalisLogo"-->
<!--              alt="Digitalis"-->
<!--              class="object-contain transition-all duration-300 max-w-full h-14 w-auto"-->
<!--            />-->
<!--        </div>-->
<!--        <h1 class="text-2xl font-bold text-dark">Digitalis HR</h1>-->
<!--        <p class="text-sm text-gray-400 mt-1">Connectez-vous à votre espace</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Form &ndash;&gt;-->
<!--      <form @submit.prevent="handleLogin" class="space-y-4">-->

<!--        &lt;!&ndash; Email &ndash;&gt;-->
<!--        <div class="space-y-1.5">-->
<!--          <label class="text-sm font-medium text-gray-700">Email</label>-->
<!--          <input-->
<!--            v-model="email"-->
<!--            type="email"-->
<!--            placeholder="vous@exemple.com"-->
<!--            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; Password &ndash;&gt;-->
<!--        <div class="space-y-1.5">-->
<!--          <label class="text-sm font-medium text-gray-700">Mot de passe</label>-->
<!--          <input-->
<!--            v-model="password"-->
<!--            type="password"-->
<!--            placeholder="••••••••"-->
<!--            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; Error &ndash;&gt;-->
<!--        <p v-if="error" class="text-red-500 text-sm flex items-center gap-1.5">-->
<!--          <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>-->
<!--          {{ error }}-->
<!--        </p>-->

<!--        &lt;!&ndash; Submit &ndash;&gt;-->
<!--        <button-->
<!--          type="submit"-->
<!--          :disabled="auth.isLoading"-->
<!--          class="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed"-->
<!--        >-->
<!--          <span v-if="auth.isLoading" class="flex items-center justify-center gap-2">-->
<!--            <LoadingSpinner :size="18" />-->
<!--            Connexion...-->
<!--          </span>-->
<!--          <span v-else>Se connecter</span>-->
<!--        </button>-->

<!--      </form>-->

<!--      &lt;!&ndash; Loader overlay &ndash;&gt;-->
<!--      <div-->
<!--        v-if="auth.isLoading"-->
<!--        class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10"-->
<!--      >-->
<!--        <LoadingSpinner message="Connexion en cours..." />-->
<!--      </div>-->

<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"
import digitalisLogo from "@/assets/logo-digitalis.png"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
const auth = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)
    if (auth.user?.role === "MANAGER") {
      router.push("/manager-pointage")
      return
    }

    if (auth.user?.role === "ADMIN") {
      router.push("/reports")
      return
    }

    router.push("/dashboard")
  } catch (err) {
    console.error(err)
    error.value = "Identifiants invalides ou compte non autorise."
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">

    <div class="relative p-12 w-full max-w-lg">

      <!-- Header -->
      <div class="flex flex-col items-center mb-10">
        <div class="flex items-center justify-center text-white font-bold text-xl mb-5">
          <img
            :src="digitalisLogo"
            alt="Digitalis"
            class="object-contain transition-all duration-300 max-w-full h-20 w-auto"
          />
        </div>
        <h1 class="text-3xl font-bold text-dark">Digitalis HR</h1>
        <p class="text-base text-gray-400 mt-2">Connectez-vous à votre espace</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-base font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="vous@exemple.com"
            :class="['w-full border rounded-xl px-5 py-4 text-base text-dark placeholder-gray-400 focus:outline-none focus:ring-2 transition-all', error ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-primary/30 focus:border-primary']"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-base font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            :class="['w-full border rounded-xl px-5 py-4 text-base text-dark placeholder-gray-400 focus:outline-none focus:ring-2 transition-all', error ? 'border-red-500 focus:ring-red-300' : 'border-gray-200 focus:ring-primary/30 focus:border-primary']"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-500 text-sm flex items-center gap-1.5">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
          {{ error }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="auth.isLoading"
          class="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="auth.isLoading" class="flex items-center justify-center gap-2">
            <LoadingSpinner :size="20" />
            Connexion...
          </span>
          <span v-else>Se connecter</span>
        </button>

      </form>

      <!-- Loader overlay -->
      <div
        v-if="auth.isLoading"
        class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10"
      >
        <LoadingSpinner message="Connexion en cours..." />
      </div>

    </div>
  </div>
</template>

