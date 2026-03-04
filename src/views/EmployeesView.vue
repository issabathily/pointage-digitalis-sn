<script setup lang="ts">
import { ref, computed } from "vue"
import { onMounted } from "vue"
import { getEmployees } from "@/services/employees.service"


interface Employee {
  id: number
  nom: string
  role: string
  statut: string
}

const search = ref("")
const currentPage = ref(1)
const perPage = 5

const sortKey = ref<keyof Employee>("nom")
const sortAsc = ref(true)

const sortedEmployees = computed(() => {
  return [...filteredEmployees.value].sort((a, b) => {
    const valueA = a[sortKey.value]
    const valueB = b[sortKey.value]

    if (valueA < valueB) return sortAsc.value ? -1 : 1
    if (valueA > valueB) return sortAsc.value ? 1 : -1
    return 0
  })
})


// Données simulées
const employees = ref<Employee[]>([])

onMounted(async () => {
  employees.value = await getEmployees() as Employee[]
})

// 🔎 Filtrage
const filteredEmployees = computed(() =>
  employees.value.filter(e =>
    e.nom.toLowerCase().includes(search.value.toLowerCase())
  )
)

// 📄 Pagination
const totalPages = computed(() =>
  Math.ceil(filteredEmployees.value.length / perPage)
)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedEmployees.value.slice(start, start + perPage)
})

</script>

<template>
  <div class="space-y-6">

    <h1 class="text-2xl font-bold text-dark">
      Gestion des employés
    </h1>

    <!-- Recherche -->
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher un employé..."
      class="border p-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
    />

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th class="p-4 cursor-pointer" @click="sortKey='nom'; sortAsc=!sortAsc">
            Nom
            </th>

            <th class="p-4 cursor-pointer" @click="sortKey='role'; sortAsc=!sortAsc">
            Rôle
            </th>

            <th class="p-4 cursor-pointer" @click="sortKey='statut'; sortAsc=!sortAsc">
            Statut
            </th>
            <th class="p-4">Actions</th>
            



          </tr>
        </thead>

        <tbody>
          <tr
            v-for="employee in paginatedEmployees"
            :key="employee.id"
            class="border-t hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01]">

            <td class="p-4 font-medium">{{ employee.nom }}</td>
            <td class="p-4">{{ employee.role }}</td>
            <td class="p-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  employee.statut === 'Actif'
                    ? 'bg-green-100 text-green-600'
                    : employee.statut === 'Absent'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                ]"
              >
                {{ employee.statut }}
              </span>
            </td>
                <td class="p-4 space-x-2">
                <button class="px-2 py-1 text-xs bg-secondary text-white rounded hover:opacity-90">
                    Modifier
                </button>

                <button class="px-2 py-1 text-xs bg-primary text-white rounded hover:opacity-90">
                    Supprimer
                </button>
                </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500">
        Page {{ currentPage }} / {{ totalPages }}
      </span>

      <div class="space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-primary text-white hover:bg-secondary disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>

  </div>
</template>
