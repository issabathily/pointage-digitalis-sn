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
    { 
      path: "reports",
      component: ReportsView,
      meta: { role: ["ADMIN", "MANAGER"] }
    },
    { 
      path: "employees",
      component: EmployeesView,
      meta: { role: ["ADMIN", "MANAGER"] }
    }
  ]
},
  ],
})



router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.path === "/login") {
    return next()
  }

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe()
    } catch (error) {
      auth.logout()
      return next("/login")
    }
  }

  if (to.meta.requiresAuth && !auth.token) {
    return next("/login")
  }

  if (to.meta.role) {
    const allowedRoles = to.meta.role as string[]

    if (!auth.user || !allowedRoles.includes(auth.user.role)) {
      return next("/dashboard")
    }
  }

  next()
})

 
export default router
