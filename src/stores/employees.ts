import { defineStore } from "pinia"
import { getEmployees } from "@/services/employees.service"

export const useEmployeesStore = defineStore("employees", {
  state: () => ({
    employees: [] as any[],
  }),

  actions: {
    async fetchEmployees() {
      this.employees = await getEmployees() as any[]
    }
  }
})
