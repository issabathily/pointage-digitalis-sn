<!--&lt;!&ndash;<script setup lang="ts">&ndash;&gt;-->
<!--&lt;!&ndash;import { ref, computed } from "vue"&ndash;&gt;-->
<!--&lt;!&ndash;import { onMounted } from "vue"&ndash;&gt;-->
<!--&lt;!&ndash;import { getEmployees, createEmployee, type Employee, type NewEmployee } from "@/services/employees.service"&ndash;&gt;-->
<!--&lt;!&ndash;import { useAuthStore } from "@/stores/auth"&ndash;&gt;-->
<!--&lt;!&ndash;import LoadingSpinner from "@/components/LoadingSpinner.vue"&ndash;&gt;-->
<!--&lt;!&ndash;import { Pencil, Trash2 } from "lucide-vue-next"&ndash;&gt;-->

<!--&lt;!&ndash;const auth = useAuthStore()&ndash;&gt;-->

<!--&lt;!&ndash;const search = ref("")&ndash;&gt;-->
<!--&lt;!&ndash;const currentPage = ref(1)&ndash;&gt;-->
<!--&lt;!&ndash;const perPage = 5&ndash;&gt;-->

<!--&lt;!&ndash;const sortKey = ref<keyof Employee>("nom")&ndash;&gt;-->
<!--&lt;!&ndash;const sortAsc = ref(true)&ndash;&gt;-->

<!--&lt;!&ndash;const showModal = ref(false)&ndash;&gt;-->
<!--&lt;!&ndash;const newEmployee = ref<NewEmployee>({&ndash;&gt;-->
<!--&lt;!&ndash;  nom: "",&ndash;&gt;-->
<!--&lt;!&ndash;  prenom: "",&ndash;&gt;-->
<!--&lt;!&ndash;  email: "",&ndash;&gt;-->
<!--&lt;!&ndash;  role: "EMPLOYE",&ndash;&gt;-->
<!--&lt;!&ndash;  statut: "ACTIF",&ndash;&gt;-->
<!--&lt;!&ndash;  password: "",&ndash;&gt;-->
<!--&lt;!&ndash;})&ndash;&gt;-->
<!--&lt;!&ndash;const createError = ref("")&ndash;&gt;-->
<!--&lt;!&ndash;const creating = ref(false)&ndash;&gt;-->

<!--&lt;!&ndash;function openModal() {&ndash;&gt;-->
<!--&lt;!&ndash;  newEmployee.value = {&ndash;&gt;-->
<!--&lt;!&ndash;    nom: "",&ndash;&gt;-->
<!--&lt;!&ndash;    prenom: "",&ndash;&gt;-->
<!--&lt;!&ndash;    email: "",&ndash;&gt;-->
<!--&lt;!&ndash;    role: "EMPLOYE",&ndash;&gt;-->
<!--&lt;!&ndash;    statut: "ACTIF",&ndash;&gt;-->
<!--&lt;!&ndash;    password: "",&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  createError.value = ""&ndash;&gt;-->
<!--&lt;!&ndash;  showModal.value = true&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;function closeModal() {&ndash;&gt;-->
<!--&lt;!&ndash;  showModal.value = false&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;async function submitCreate() {&ndash;&gt;-->
<!--&lt;!&ndash;  createError.value = ""&ndash;&gt;-->
<!--&lt;!&ndash;  if (!newEmployee.value.nom || !newEmployee.value.prenom || !newEmployee.value.email || !newEmployee.value.password) {&ndash;&gt;-->
<!--&lt;!&ndash;    createError.value = "Tous les champs obligatoires doivent être remplis."&ndash;&gt;-->
<!--&lt;!&ndash;    return&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  creating.value = true&ndash;&gt;-->
<!--&lt;!&ndash;  try {&ndash;&gt;-->
<!--&lt;!&ndash;    const created = await createEmployee(newEmployee.value)&ndash;&gt;-->
<!--&lt;!&ndash;    employees.value.unshift(created)&ndash;&gt;-->
<!--&lt;!&ndash;    closeModal()&ndash;&gt;-->
<!--&lt;!&ndash;  } catch (e: any) {&ndash;&gt;-->
<!--&lt;!&ndash;    createError.value = e?.response?.data?.detail || e?.message || "Erreur lors de la création."&ndash;&gt;-->
<!--&lt;!&ndash;  } finally {&ndash;&gt;-->
<!--&lt;!&ndash;    creating.value = false&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const sortedEmployees = computed(() => {&ndash;&gt;-->
<!--&lt;!&ndash;  return [...filteredEmployees.value].sort((a, b) => {&ndash;&gt;-->
<!--&lt;!&ndash;    const valueA = a[sortKey.value]&ndash;&gt;-->
<!--&lt;!&ndash;    const valueB = b[sortKey.value]&ndash;&gt;-->
<!--&lt;!&ndash;    if (valueA < valueB) return sortAsc.value ? -1 : 1&ndash;&gt;-->
<!--&lt;!&ndash;    if (valueA > valueB) return sortAsc.value ? 1 : -1&ndash;&gt;-->
<!--&lt;!&ndash;    return 0&ndash;&gt;-->
<!--&lt;!&ndash;  })&ndash;&gt;-->
<!--&lt;!&ndash;})&ndash;&gt;-->

<!--&lt;!&ndash;const employees = ref<Employee[]>([])&ndash;&gt;-->
<!--&lt;!&ndash;const loading = ref(false)&ndash;&gt;-->
<!--&lt;!&ndash;const error = ref("")&ndash;&gt;-->

<!--&lt;!&ndash;onMounted(async () => {&ndash;&gt;-->
<!--&lt;!&ndash;  loading.value = true&ndash;&gt;-->
<!--&lt;!&ndash;  error.value = ""&ndash;&gt;-->
<!--&lt;!&ndash;  try {&ndash;&gt;-->
<!--&lt;!&ndash;    employees.value = await getEmployees()&ndash;&gt;-->
<!--&lt;!&ndash;  } catch (e: any) {&ndash;&gt;-->
<!--&lt;!&ndash;    error.value =&ndash;&gt;-->
<!--&lt;!&ndash;      e?.response?.status === 403&ndash;&gt;-->
<!--&lt;!&ndash;        ? "Acces refuse par le backend pour la liste des employes."&ndash;&gt;-->
<!--&lt;!&ndash;        : "Impossible de charger la liste des employes."&ndash;&gt;-->
<!--&lt;!&ndash;  } finally {&ndash;&gt;-->
<!--&lt;!&ndash;    loading.value = false&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;})&ndash;&gt;-->

<!--&lt;!&ndash;const filteredEmployees = computed(() =>&ndash;&gt;-->
<!--&lt;!&ndash;  employees.value.filter(e =>&ndash;&gt;-->
<!--&lt;!&ndash;    e.nom.toLowerCase().includes(search.value.toLowerCase())&ndash;&gt;-->
<!--&lt;!&ndash;  )&ndash;&gt;-->
<!--&lt;!&ndash;)&ndash;&gt;-->

<!--&lt;!&ndash;const totalPages = computed(() =>&ndash;&gt;-->
<!--&lt;!&ndash;  Math.max(1, Math.ceil(filteredEmployees.value.length / perPage))&ndash;&gt;-->
<!--&lt;!&ndash;)&ndash;&gt;-->

<!--&lt;!&ndash;const paginatedEmployees = computed(() => {&ndash;&gt;-->
<!--&lt;!&ndash;  const start = (currentPage.value - 1) * perPage&ndash;&gt;-->
<!--&lt;!&ndash;  return sortedEmployees.value.slice(start, start + perPage)&ndash;&gt;-->
<!--&lt;!&ndash;})&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->

<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <div class="space-y-6 max-w-full overflow-x-hidden">&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; Header &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="min-w-0">&ndash;&gt;-->
<!--&lt;!&ndash;        <h1 class="text-xl sm:text-2xl font-bold text-dark">Gestion des employés</h1>&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="text-sm text-gray-400 mt-0.5">{{ filteredEmployees.length }} employé{{ filteredEmployees.length > 1 ? 's' : '' }} trouvé{{ filteredEmployees.length > 1 ? 's' : '' }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <button&ndash;&gt;-->
<!--&lt;!&ndash;        v-if="auth.isAdmin"&ndash;&gt;-->
<!--&lt;!&ndash;        @click="openModal"&ndash;&gt;-->
<!--&lt;!&ndash;        class="w-full sm:w-auto justify-center flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;        Ajouter un employé&ndash;&gt;-->
<!--&lt;!&ndash;      </button>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; Recherche &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="relative w-full md:w-72">&ndash;&gt;-->
<!--&lt;!&ndash;      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">&ndash;&gt;-->
<!--&lt;!&ndash;        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>&ndash;&gt;-->
<!--&lt;!&ndash;      </svg>&ndash;&gt;-->
<!--&lt;!&ndash;      <input&ndash;&gt;-->
<!--&lt;!&ndash;        v-model="search"&ndash;&gt;-->
<!--&lt;!&ndash;        type="text"&ndash;&gt;-->
<!--&lt;!&ndash;        placeholder="Rechercher un employé..."&ndash;&gt;-->
<!--&lt;!&ndash;        class="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; Table &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="!loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="relative">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="overflow-x-auto w-full max-w-full">&ndash;&gt;-->
<!--&lt;!&ndash;          <table class="w-full text-left">&ndash;&gt;-->
<!--&lt;!&ndash;        <thead>&ndash;&gt;-->
<!--&lt;!&ndash;          <tr class="bg-gray-50 border-b border-gray-100">&ndash;&gt;-->
<!--&lt;!&ndash;            <th&ndash;&gt;-->
<!--&lt;!&ndash;              class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"&ndash;&gt;-->
<!--&lt;!&ndash;              @click="sortKey='nom'; sortAsc=!sortAsc"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center gap-1.5">&ndash;&gt;-->
<!--&lt;!&ndash;                Nom&ndash;&gt;-->
<!--&lt;!&ndash;                <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </th>&ndash;&gt;-->
<!--&lt;!&ndash;            <th&ndash;&gt;-->
<!--&lt;!&ndash;              class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"&ndash;&gt;-->
<!--&lt;!&ndash;              @click="sortKey='role'; sortAsc=!sortAsc"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center gap-1.5">&ndash;&gt;-->
<!--&lt;!&ndash;                Rôle&ndash;&gt;-->
<!--&lt;!&ndash;                <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </th>&ndash;&gt;-->
<!--&lt;!&ndash;            <th&ndash;&gt;-->
<!--&lt;!&ndash;              class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"&ndash;&gt;-->
<!--&lt;!&ndash;              @click="sortKey='statut'; sortAsc=!sortAsc"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center gap-1.5">&ndash;&gt;-->
<!--&lt;!&ndash;                Statut&ndash;&gt;-->
<!--&lt;!&ndash;                <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </th>&ndash;&gt;-->
<!--&lt;!&ndash;            <th class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">Actions</th>&ndash;&gt;-->
<!--&lt;!&ndash;          </tr>&ndash;&gt;-->
<!--&lt;!&ndash;        </thead>&ndash;&gt;-->

<!--&lt;!&ndash;        <tbody>&ndash;&gt;-->
<!--&lt;!&ndash;          <tr&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="employee in paginatedEmployees"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="employee.id"&ndash;&gt;-->
<!--&lt;!&ndash;            class="border-t border-gray-50 hover:bg-primary/5 transition-all duration-150"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <td class="px-4 sm:px-5 py-4 whitespace-nowrap">&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center gap-3">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ employee.nom.charAt(0).toUpperCase() }}&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--&lt;!&ndash;                <span class="font-medium text-dark text-sm">{{ employee.nom }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </td>&ndash;&gt;-->

<!--&lt;!&ndash;            <td class="px-4 sm:px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{{ employee.role }}</td>&ndash;&gt;-->

<!--&lt;!&ndash;            <td class="px-4 sm:px-5 py-4 whitespace-nowrap">&ndash;&gt;-->
<!--&lt;!&ndash;              <span&ndash;&gt;-->
<!--&lt;!&ndash;                :class="[&ndash;&gt;-->
<!--&lt;!&ndash;                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',&ndash;&gt;-->
<!--&lt;!&ndash;                  employee.statut === 'Actif'&ndash;&gt;-->
<!--&lt;!&ndash;                    ? 'bg-green-50 text-green-600'&ndash;&gt;-->
<!--&lt;!&ndash;                    : employee.statut === 'Absent'&ndash;&gt;-->
<!--&lt;!&ndash;                    ? 'bg-red-50 text-red-500'&ndash;&gt;-->
<!--&lt;!&ndash;                    : 'bg-yellow-50 text-yellow-600'&ndash;&gt;-->
<!--&lt;!&ndash;                ]"&ndash;&gt;-->
<!--&lt;!&ndash;              >&ndash;&gt;-->
<!--&lt;!&ndash;                <span&ndash;&gt;-->
<!--&lt;!&ndash;                  :class="[&ndash;&gt;-->
<!--&lt;!&ndash;                    'w-1.5 h-1.5 rounded-full mr-1.5',&ndash;&gt;-->
<!--&lt;!&ndash;                    employee.statut === 'Actif' ? 'bg-green-500' :&ndash;&gt;-->
<!--&lt;!&ndash;                    employee.statut === 'Absent' ? 'bg-red-400' : 'bg-yellow-500'&ndash;&gt;-->
<!--&lt;!&ndash;                  ]"&ndash;&gt;-->
<!--&lt;!&ndash;                ></span>&ndash;&gt;-->
<!--&lt;!&ndash;                {{ employee.statut }}&ndash;&gt;-->
<!--&lt;!&ndash;              </span>&ndash;&gt;-->
<!--&lt;!&ndash;            </td>&ndash;&gt;-->

<!--&lt;!&ndash;            <td class="px-4 sm:px-5 py-4 whitespace-nowrap">&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center gap-2">&ndash;&gt;-->
<!--&lt;!&ndash;                <button&ndash;&gt;-->
<!--&lt;!&ndash;                  type="button"&ndash;&gt;-->
<!--&lt;!&ndash;                  class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-200"&ndash;&gt;-->
<!--&lt;!&ndash;                  aria-label="Modifier"&ndash;&gt;-->
<!--&lt;!&ndash;                  title="Modifier"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  <Pencil :size="16" />&ndash;&gt;-->
<!--&lt;!&ndash;                </button>&ndash;&gt;-->
<!--&lt;!&ndash;                <button&ndash;&gt;-->
<!--&lt;!&ndash;                  type="button"&ndash;&gt;-->
<!--&lt;!&ndash;                  class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"&ndash;&gt;-->
<!--&lt;!&ndash;                  aria-label="Supprimer"&ndash;&gt;-->
<!--&lt;!&ndash;                  title="Supprimer"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  <Trash2 :size="16" />&ndash;&gt;-->
<!--&lt;!&ndash;                </button>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </td>&ndash;&gt;-->
<!--&lt;!&ndash;          </tr>&ndash;&gt;-->

<!--&lt;!&ndash;          &lt;!&ndash; Empty state &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          <tr v-if="!loading && !error && paginatedEmployees.length === 0">&ndash;&gt;-->
<!--&lt;!&ndash;            <td colspan="4" class="px-4 sm:px-5 py-12 text-center text-sm text-gray-400">&ndash;&gt;-->
<!--&lt;!&ndash;              Aucun employé trouvé&ndash;&gt;-->
<!--&lt;!&ndash;            </td>&ndash;&gt;-->
<!--&lt;!&ndash;          </tr>&ndash;&gt;-->
<!--&lt;!&ndash;        </tbody>&ndash;&gt;-->
<!--&lt;!&ndash;      </table>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash; Indicateur visuel que le tableau scrolle horizontalement sur mobile &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    <div v-if="loading" class="py-12 flex justify-center">&ndash;&gt;-->
<!--&lt;!&ndash;      <LoadingSpinner message="Chargement des employés..." />&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; Pagination &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="!loading" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">&ndash;&gt;-->
<!--&lt;!&ndash;      <span class="text-sm text-gray-400">&ndash;&gt;-->
<!--&lt;!&ndash;        Page <span class="font-medium text-dark">{{ currentPage }}</span> sur <span class="font-medium text-dark">{{ totalPages }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;      </span>&ndash;&gt;-->

<!--&lt;!&ndash;      <div class="flex items-center gap-2 flex-wrap">&ndash;&gt;-->
<!--&lt;!&ndash;        <button&ndash;&gt;-->
<!--&lt;!&ndash;          @click="currentPage&#45;&#45;"&ndash;&gt;-->
<!--&lt;!&ndash;          :disabled="currentPage === 1"&ndash;&gt;-->
<!--&lt;!&ndash;          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;          Précédent&ndash;&gt;-->
<!--&lt;!&ndash;        </button>&ndash;&gt;-->

<!--&lt;!&ndash;        <button&ndash;&gt;-->
<!--&lt;!&ndash;          @click="currentPage++"&ndash;&gt;-->
<!--&lt;!&ndash;          :disabled="currentPage === totalPages"&ndash;&gt;-->
<!--&lt;!&ndash;          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          Suivant&ndash;&gt;-->
<!--&lt;!&ndash;          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;        </button>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; Modal création employé &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="closeModal">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-8 space-y-5 mx-3">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="flex items-center justify-between">&ndash;&gt;-->
<!--&lt;!&ndash;          <h2 class="text-xl font-bold text-dark">Nouvel employé</h2>&ndash;&gt;-->
<!--&lt;!&ndash;          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">&ndash;&gt;-->
<!--&lt;!&ndash;            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>&ndash;&gt;-->
<!--&lt;!&ndash;          </button>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--&lt;!&ndash;        <div v-if="createError" class="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">&ndash;&gt;-->
<!--&lt;!&ndash;          {{ createError }}&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--&lt;!&ndash;        <div class="space-y-4">&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">&ndash;&gt;-->
<!--&lt;!&ndash;            <div>&ndash;&gt;-->
<!--&lt;!&ndash;              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom *</label>&ndash;&gt;-->
<!--&lt;!&ndash;              <input v-model="newEmployee.nom" type="text" placeholder="Ndiaye" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div>&ndash;&gt;-->
<!--&lt;!&ndash;              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prénom *</label>&ndash;&gt;-->
<!--&lt;!&ndash;              <input v-model="newEmployee.prenom" type="text" placeholder="Moussa" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>&ndash;&gt;-->
<!--&lt;!&ndash;            <input v-model="newEmployee.email" type="email" placeholder="moussa.ndiaye@digitalis.sn" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rôle</label>&ndash;&gt;-->
<!--&lt;!&ndash;            <select v-model="newEmployee.role" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white">&ndash;&gt;-->
<!--&lt;!&ndash;              <option value="EMPLOYE">Employé</option>&ndash;&gt;-->
<!--&lt;!&ndash;              <option value="MANAGER">Manager</option>&ndash;&gt;-->
<!--&lt;!&ndash;              <option value="ADMIN">Admin</option>&ndash;&gt;-->
<!--&lt;!&ndash;            </select>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe *</label>&ndash;&gt;-->
<!--&lt;!&ndash;            <input v-model="newEmployee.password" type="password" placeholder="••••••••" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--&lt;!&ndash;        <div class="flex gap-3 pt-2">&ndash;&gt;-->
<!--&lt;!&ndash;          <button @click="closeModal" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">&ndash;&gt;-->
<!--&lt;!&ndash;            Annuler&ndash;&gt;-->
<!--&lt;!&ndash;          </button>&ndash;&gt;-->
<!--&lt;!&ndash;          <button&ndash;&gt;-->
<!--&lt;!&ndash;            @click="submitCreate"&ndash;&gt;-->
<!--&lt;!&ndash;            :disabled="creating"&ndash;&gt;-->
<!--&lt;!&ndash;            class="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            {{ creating ? "Création..." : "Créer" }}&ndash;&gt;-->
<!--&lt;!&ndash;          </button>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--<script setup lang="ts">-->
<!--import { ref, computed } from "vue"-->
<!--import { onMounted } from "vue"-->
<!--import { getEmployees, createEmployee, type Employee, type NewEmployee } from "@/services/employees.service"-->
<!--import { useAuthStore } from "@/stores/auth"-->
<!--import LoadingSpinner from "@/components/LoadingSpinner.vue"-->
<!--import { Pencil, Trash2 } from "lucide-vue-next"-->

<!--const auth = useAuthStore()-->

<!--const search = ref("")-->
<!--const currentPage = ref(1)-->
<!--const perPage = 5-->

<!--const sortKey = ref<keyof Employee>("nom")-->
<!--const sortAsc = ref(true)-->

<!--const showModal = ref(false)-->
<!--const newEmployee = ref<NewEmployee>({-->
<!--  nom: "",-->
<!--  prenom: "",-->
<!--  email: "",-->
<!--  role: "EMPLOYE",-->
<!--  statut: "ACTIF",-->
<!--  password: "",-->
<!--})-->
<!--const createError = ref("")-->
<!--const creating = ref(false)-->

<!--function openModal() {-->
<!--  newEmployee.value = {-->
<!--    nom: "",-->
<!--    prenom: "",-->
<!--    email: "",-->
<!--    role: "EMPLOYE",-->
<!--    statut: "ACTIF",-->
<!--    password: "",-->
<!--  }-->
<!--  createError.value = ""-->
<!--  showModal.value = true-->
<!--}-->

<!--function closeModal() {-->
<!--  showModal.value = false-->
<!--}-->

<!--async function submitCreate() {-->
<!--  createError.value = ""-->
<!--  if (!newEmployee.value.nom || !newEmployee.value.prenom || !newEmployee.value.email || !newEmployee.value.password) {-->
<!--    createError.value = "Tous les champs obligatoires doivent être remplis."-->
<!--    return-->
<!--  }-->
<!--  creating.value = true-->
<!--  try {-->
<!--    const created = await createEmployee(newEmployee.value)-->
<!--    employees.value.unshift(created)-->
<!--    closeModal()-->
<!--  } catch (e: any) {-->
<!--    createError.value = e?.response?.data?.detail || e?.message || "Erreur lors de la création."-->
<!--  } finally {-->
<!--    creating.value = false-->
<!--  }-->
<!--}-->

<!--const sortedEmployees = computed(() => {-->
<!--  return [...filteredEmployees.value].sort((a, b) => {-->
<!--    const valueA = a[sortKey.value]-->
<!--    const valueB = b[sortKey.value]-->
<!--    if (valueA < valueB) return sortAsc.value ? -1 : 1-->
<!--    if (valueA > valueB) return sortAsc.value ? 1 : -1-->
<!--    return 0-->
<!--  })-->
<!--})-->

<!--const employees = ref<Employee[]>([])-->
<!--const loading = ref(false)-->
<!--const error = ref("")-->

<!--onMounted(async () => {-->
<!--  loading.value = true-->
<!--  error.value = ""-->
<!--  try {-->
<!--    employees.value = await getEmployees()-->
<!--  } catch (e: any) {-->
<!--    error.value =-->
<!--      e?.response?.status === 403-->
<!--        ? "Acces refuse par le backend pour la liste des employes."-->
<!--        : "Impossible de charger la liste des employes."-->
<!--  } finally {-->
<!--    loading.value = false-->
<!--  }-->
<!--})-->

<!--const filteredEmployees = computed(() =>-->
<!--  employees.value.filter(e =>-->
<!--    e.nom.toLowerCase().includes(search.value.toLowerCase())-->
<!--  )-->
<!--)-->

<!--const totalPages = computed(() =>-->
<!--  Math.max(1, Math.ceil(filteredEmployees.value.length / perPage))-->
<!--)-->

<!--const paginatedEmployees = computed(() => {-->
<!--  const start = (currentPage.value - 1) * perPage-->
<!--  return sortedEmployees.value.slice(start, start + perPage)-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  &lt;!&ndash; ✅ Retiré overflow-x-hidden qui bloquait le scroll du tableau &ndash;&gt;-->
<!--  <div class="space-y-6">-->

<!--    &lt;!&ndash; Header &ndash;&gt;-->
<!--    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">-->
<!--      <div class="min-w-0">-->
<!--        <h1 class="text-xl sm:text-2xl font-bold text-dark">Gestion des employés</h1>-->
<!--        <p class="text-sm text-gray-400 mt-0.5">-->
<!--          {{ filteredEmployees.length }} employé{{ filteredEmployees.length > 1 ? 's' : '' }} trouvé{{ filteredEmployees.length > 1 ? 's' : '' }}-->
<!--        </p>-->
<!--      </div>-->
<!--      <button-->
<!--        v-if="auth.isAdmin"-->
<!--        @click="openModal"-->
<!--        class="w-full sm:w-auto justify-center flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"-->
<!--      >-->
<!--        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>-->
<!--        </svg>-->
<!--        Ajouter un employé-->
<!--      </button>-->
<!--    </div>-->

<!--    &lt;!&ndash; Recherche &ndash;&gt;-->
<!--    <div class="relative w-full md:w-72">-->
<!--      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">-->
<!--        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>-->
<!--      </svg>-->
<!--      <input-->
<!--        v-model="search"-->
<!--        type="text"-->
<!--        placeholder="Rechercher un employé..."-->
<!--        class="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"-->
<!--      />-->
<!--    </div>-->

<!--    &lt;!&ndash; Table &ndash;&gt;-->
<!--    <div v-if="!loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">-->
<!--      &lt;!&ndash; ✅ Wrapper avec overflow-x:auto + -webkit-overflow-scrolling pour iOS + position:relative pour le dégradé &ndash;&gt;-->
<!--      <div class="relative">-->
<!--        <div-->
<!--          class="overflow-x-auto w-full"-->
<!--          style="-webkit-overflow-scrolling: touch;"-->
<!--        >-->
<!--          &lt;!&ndash; ✅ min-width sur la table pour forcer le scroll au lieu de déborder &ndash;&gt;-->
<!--          <table class="w-full text-left" style="min-width: 600px;">-->
<!--            <thead>-->
<!--              <tr class="bg-gray-50 border-b border-gray-100">-->
<!--                <th-->
<!--                  class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"-->
<!--                  @click="sortKey='nom'; sortAsc=!sortAsc"-->
<!--                >-->
<!--                  <div class="flex items-center gap-1.5">-->
<!--                    Nom-->
<!--                    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>-->
<!--                  </div>-->
<!--                </th>-->
<!--                <th-->
<!--                  class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"-->
<!--                  @click="sortKey='role'; sortAsc=!sortAsc"-->
<!--                >-->
<!--                  <div class="flex items-center gap-1.5">-->
<!--                    Rôle-->
<!--                    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>-->
<!--                  </div>-->
<!--                </th>-->
<!--                <th-->
<!--                  class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap"-->
<!--                  @click="sortKey='statut'; sortAsc=!sortAsc"-->
<!--                >-->
<!--                  <div class="flex items-center gap-1.5">-->
<!--                    Statut-->
<!--                    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>-->
<!--                  </div>-->
<!--                </th>-->
<!--                <th class="px-4 sm:px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">-->
<!--                  Actions-->
<!--                </th>-->
<!--              </tr>-->
<!--            </thead>-->

<!--            <tbody>-->
<!--              <tr-->
<!--                v-for="employee in paginatedEmployees"-->
<!--                :key="employee.id"-->
<!--                class="border-t border-gray-50 hover:bg-primary/5 transition-all duration-150"-->
<!--              >-->
<!--                <td class="px-4 sm:px-5 py-4 whitespace-nowrap">-->
<!--                  <div class="flex items-center gap-3">-->
<!--                    <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">-->
<!--                      {{ employee.nom.charAt(0).toUpperCase() }}-->
<!--                    </div>-->
<!--                    <span class="font-medium text-dark text-sm">{{ employee.nom }}</span>-->
<!--                  </div>-->
<!--                </td>-->

<!--                <td class="px-4 sm:px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{{ employee.role }}</td>-->

<!--                <td class="px-4 sm:px-5 py-4 whitespace-nowrap">-->
<!--                  <span-->
<!--                    :class="[-->
<!--                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',-->
<!--                      employee.statut === 'Actif'-->
<!--                        ? 'bg-green-50 text-green-600'-->
<!--                        : employee.statut === 'Absent'-->
<!--                        ? 'bg-red-50 text-red-500'-->
<!--                        : 'bg-yellow-50 text-yellow-600'-->
<!--                    ]"-->
<!--                  >-->
<!--                    <span-->
<!--                      :class="[-->
<!--                        'w-1.5 h-1.5 rounded-full mr-1.5',-->
<!--                        employee.statut === 'Actif' ? 'bg-green-500' :-->
<!--                        employee.statut === 'Absent' ? 'bg-red-400' : 'bg-yellow-500'-->
<!--                      ]"-->
<!--                    ></span>-->
<!--                    {{ employee.statut }}-->
<!--                  </span>-->
<!--                </td>-->

<!--                <td class="px-4 sm:px-5 py-4 whitespace-nowrap">-->
<!--                  <div class="flex items-center gap-2">-->
<!--                    <button-->
<!--                      type="button"-->
<!--                      class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-200"-->
<!--                      aria-label="Modifier"-->
<!--                      title="Modifier"-->
<!--                    >-->
<!--                      <Pencil :size="16" />-->
<!--                    </button>-->
<!--                    <button-->
<!--                      type="button"-->
<!--                      class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"-->
<!--                      aria-label="Supprimer"-->
<!--                      title="Supprimer"-->
<!--                    >-->
<!--                      <Trash2 :size="16" />-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </td>-->
<!--              </tr>-->

<!--              &lt;!&ndash; Empty state &ndash;&gt;-->
<!--              <tr v-if="!loading && !error && paginatedEmployees.length === 0">-->
<!--                <td colspan="4" class="px-4 sm:px-5 py-12 text-center text-sm text-gray-400">-->
<!--                  Aucun employé trouvé-->
<!--                </td>-->
<!--              </tr>-->
<!--            </tbody>-->
<!--          </table>-->
<!--        </div>-->

<!--        &lt;!&ndash; ✅ Dégradé indicateur de scroll — visible uniquement sur mobile, en dehors du conteneur scrollable &ndash;&gt;-->
<!--        <div class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden"></div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div v-if="loading" class="py-12 flex justify-center">-->
<!--      <LoadingSpinner message="Chargement des employés..." />-->
<!--    </div>-->
<!--    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>-->

<!--    &lt;!&ndash; Pagination &ndash;&gt;-->
<!--    <div v-if="!loading" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">-->
<!--      <span class="text-sm text-gray-400">-->
<!--        Page <span class="font-medium text-dark">{{ currentPage }}</span> sur <span class="font-medium text-dark">{{ totalPages }}</span>-->
<!--      </span>-->

<!--      <div class="flex items-center gap-2 flex-wrap">-->
<!--        <button-->
<!--          @click="currentPage&#45;&#45;"-->
<!--          :disabled="currentPage === 1"-->
<!--          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"-->
<!--        >-->
<!--          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>-->
<!--          Précédent-->
<!--        </button>-->

<!--        <button-->
<!--          @click="currentPage++"-->
<!--          :disabled="currentPage === totalPages"-->
<!--          class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"-->
<!--        >-->
<!--          Suivant-->
<!--          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Modal création employé &ndash;&gt;-->
<!--    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="closeModal">-->
<!--      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-8 space-y-5 mx-3">-->
<!--        <div class="flex items-center justify-between">-->
<!--          <h2 class="text-xl font-bold text-dark">Nouvel employé</h2>-->
<!--          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">-->
<!--            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>-->
<!--          </button>-->
<!--        </div>-->

<!--        <div v-if="createError" class="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">-->
<!--          {{ createError }}-->
<!--        </div>-->

<!--        <div class="space-y-4">-->
<!--          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">-->
<!--            <div>-->
<!--              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom *</label>-->
<!--              <input v-model="newEmployee.nom" type="text" placeholder="Ndiaye" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />-->
<!--            </div>-->
<!--            <div>-->
<!--              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prénom *</label>-->
<!--              <input v-model="newEmployee.prenom" type="text" placeholder="Moussa" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div>-->
<!--            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>-->
<!--            <input v-model="newEmployee.email" type="email" placeholder="moussa.ndiaye@digitalis.sn" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />-->
<!--          </div>-->

<!--          <div>-->
<!--            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rôle</label>-->
<!--            <select v-model="newEmployee.role" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white">-->
<!--              <option value="EMPLOYE">Employé</option>-->
<!--              <option value="MANAGER">Manager</option>-->
<!--              <option value="ADMIN">Admin</option>-->
<!--            </select>-->
<!--          </div>-->

<!--          <div>-->
<!--            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe *</label>-->
<!--            <input v-model="newEmployee.password" type="password" placeholder="••••••••" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="flex gap-3 pt-2">-->
<!--          <button @click="closeModal" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">-->
<!--            Annuler-->
<!--          </button>-->
<!--          <button-->
<!--            @click="submitCreate"-->
<!--            :disabled="creating"-->
<!--            class="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"-->
<!--          >-->
<!--            {{ creating ? "Création..." : "Créer" }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--  </div>-->
<!--</template>-->

<script setup lang="ts">
import { ref, computed } from "vue"
import { onMounted } from "vue"
import { getEmployees, createEmployee, type Employee, type NewEmployee } from "@/services/employees.service"
import { useAuthStore } from "@/stores/auth"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { Pencil, Trash2 } from "lucide-vue-next"

const auth = useAuthStore()

const search = ref("")
const currentPage = ref(1)
const perPage = 5

const sortKey = ref<keyof Employee>("nom")
const sortAsc = ref(true)

const showModal = ref(false)
const newEmployee = ref<NewEmployee>({
  nom: "",
  prenom: "",
  email: "",
  role: "EMPLOYE",
  statut: "ACTIF",
  password: "",
})
const createError = ref("")
const creating = ref(false)

function openModal() {
  newEmployee.value = { nom: "", prenom: "", email: "", role: "EMPLOYE", statut: "ACTIF", password: "" }
  createError.value = ""
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitCreate() {
  createError.value = ""
  if (!newEmployee.value.nom || !newEmployee.value.prenom || !newEmployee.value.email || !newEmployee.value.password) {
    createError.value = "Tous les champs obligatoires doivent être remplis."
    return
  }
  creating.value = true
  try {
    const created = await createEmployee(newEmployee.value)
    employees.value.unshift(created)
    closeModal()
  } catch (e: any) {
    createError.value = e?.response?.data?.detail || e?.message || "Erreur lors de la création."
  } finally {
    creating.value = false
  }
}

const employees = ref<Employee[]>([])
const loading = ref(false)
const error = ref("")

onMounted(async () => {
  loading.value = true
  error.value = ""
  try {
    employees.value = await getEmployees()
  } catch (e: any) {
    error.value =
      e?.response?.status === 403
        ? "Acces refuse par le backend pour la liste des employes."
        : "Impossible de charger la liste des employes."
  } finally {
    loading.value = false
  }
})

const filteredEmployees = computed(() =>
  employees.value.filter(e => e.nom.toLowerCase().includes(search.value.toLowerCase()))
)

const sortedEmployees = computed(() =>
  [...filteredEmployees.value].sort((a, b) => {
    const vA = a[sortKey.value], vB = b[sortKey.value]
    if (vA < vB) return sortAsc.value ? -1 : 1
    if (vA > vB) return sortAsc.value ? 1 : -1
    return 0
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / perPage)))

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedEmployees.value.slice(start, start + perPage)
})
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-dark">Gestion des employés</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ filteredEmployees.length }} employé{{ filteredEmployees.length > 1 ? 's' : '' }} trouvé{{ filteredEmployees.length > 1 ? 's' : '' }}
        </p>
      </div>
      <button
        v-if="auth.isAdmin"
        @click="openModal"
        class="w-full sm:w-auto justify-center flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter un employé
      </button>
    </div>

    <!-- Recherche -->
    <div class="relative w-full md:w-72">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un employé..."
        class="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>

    <!-- ✅ VUE MOBILE : Cards (visible uniquement sur mobile) -->
    <div v-if="!loading" class="sm:hidden space-y-3">
      <div
        v-for="employee in paginatedEmployees"
        :key="employee.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
      >
        <div class="flex items-center justify-between">
          <!-- Nom + avatar -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {{ employee.nom.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-dark text-sm truncate">{{ employee.nom }}</p>
              <p class="text-xs text-gray-400">{{ employee.role }}</p>
            </div>
          </div>

          <!-- Statut -->
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
              employee.statut === 'Actif' ? 'bg-green-50 text-green-600' :
              employee.statut === 'Absent' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
            ]"
          >
            <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', employee.statut === 'Actif' ? 'bg-green-500' : employee.statut === 'Absent' ? 'bg-red-400' : 'bg-yellow-500']"></span>
            {{ employee.statut }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all text-xs font-medium"
          >
            <Pencil :size="14" /> Modifier
          </button>
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-medium"
          >
            <Trash2 :size="14" /> Supprimer
          </button>
        </div>
      </div>

      <!-- Empty state mobile -->
      <div v-if="paginatedEmployees.length === 0" class="py-12 text-center text-sm text-gray-400">
        Aucun employé trouvé
      </div>
    </div>

    <!-- ✅ VUE DESKTOP : Tableau (caché sur mobile) -->
    <div v-if="!loading" class="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap" @click="sortKey='nom'; sortAsc=!sortAsc">
              <div class="flex items-center gap-1.5">Nom <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg></div>
            </th>
            <th class="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap" @click="sortKey='role'; sortAsc=!sortAsc">
              <div class="flex items-center gap-1.5">Rôle <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg></div>
            </th>
            <th class="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap" @click="sortKey='statut'; sortAsc=!sortAsc">
              <div class="flex items-center gap-1.5">Statut <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg></div>
            </th>
            <th class="px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id" class="border-t border-gray-50 hover:bg-primary/5 transition-all duration-150">
            <td class="px-5 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {{ employee.nom.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium text-dark text-sm">{{ employee.nom }}</span>
              </div>
            </td>
            <td class="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{{ employee.role }}</td>
            <td class="px-5 py-4 whitespace-nowrap">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', employee.statut === 'Actif' ? 'bg-green-50 text-green-600' : employee.statut === 'Absent' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600']">
                <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', employee.statut === 'Actif' ? 'bg-green-500' : employee.statut === 'Absent' ? 'bg-red-400' : 'bg-yellow-500']"></span>
                {{ employee.statut }}
              </span>
            </td>
            <td class="px-5 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-200" title="Modifier">
                  <Pencil :size="16" />
                </button>
                <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200" title="Supprimer">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedEmployees.length === 0">
            <td colspan="4" class="px-5 py-12 text-center text-sm text-gray-400">Aucun employé trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="py-12 flex justify-center">
      <LoadingSpinner message="Chargement des employés..." />
    </div>
    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

    <!-- Pagination -->
    <div v-if="!loading" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <span class="text-sm text-gray-400">
        Page <span class="font-medium text-dark">{{ currentPage }}</span> sur <span class="font-medium text-dark">{{ totalPages }}</span>
      </span>
      <div class="flex items-center gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Précédent
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
          Suivant
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-8 space-y-5 mx-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-dark">Nouvel employé</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div v-if="createError" class="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">{{ createError }}</div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom *</label>
              <input v-model="newEmployee.nom" type="text" placeholder="Ndiaye" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Prénom *</label>
              <input v-model="newEmployee.prenom" type="text" placeholder="Moussa" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
            <input v-model="newEmployee.email" type="email" placeholder="moussa.ndiaye@digitalis.sn" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rôle</label>
            <select v-model="newEmployee.role" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white">
              <option value="EMPLOYE">Employé</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe *</label>
            <input v-model="newEmployee.password" type="password" placeholder="••••••••" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="closeModal" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">Annuler</button>
          <button @click="submitCreate" :disabled="creating" class="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm">
            {{ creating ? "Création..." : "Créer" }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>




