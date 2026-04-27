import { createRouter, createWebHistory } from "vue-router"

import DashboardLayout from "@/layouts/DashboardLayout.vue"
import AuthLayout from "@/layouts/AuthLayout.vue"

import LoginView from "@/views/LoginView.vue"
import DashboardView from "@/views/DashboardView.vue"
import PointageView from "@/views/PointageView.vue"
import AbsencesView from "@/views/AbsencesView.vue"
import ReportsView from "@/views/ReportsView.vue"
import { useAuthStore } from '@/stores/auth'
import EmployeesView from "@/views/EmployeesView.vue"
import ManagerPointageView from "@/views/ManagerPointageView.vue"
import MonCalendrierView from "@/views/MonCalendrierView.vue"




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "login",
          component: LoginView,
        },
      ],
    },

    {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      { path: "dashboard", component: DashboardView },
      { path: "pointage", component: PointageView },
      { path: "absences", component: AbsencesView },
      { path: "mon-calendrier", component: MonCalendrierView },
      { 
        path: "reports",
        component: ReportsView,
        meta: { role: ["ADMIN", "MANAGER"] }
      },
      { 
        path: "employees",
        component: EmployeesView,
        meta: { role: ["ADMIN", "MANAGER"] }
      },
      { 
        path: "manager-pointage",
        component: ManagerPointageView,
        meta: { role: ["ADMIN", "MANAGER"] }
      }
    ]
    },
          ],
})



router.beforeEach((to, from, next) => {

  const auth = useAuthStore()

  // vérifier si login requis
  if (to.meta.requiresAuth && !auth.token) {
    return next("/login")
  }

  // vérifier les rôles
  if (to.meta.role) {

    const allowedRoles = to.meta.role as string[]

    if (!auth.user) {
      return next("/login")
    }

    if (!allowedRoles.includes(auth.user.role)) {
      return next("/dashboard")
    }

  }

  next()

})

 
export default router
