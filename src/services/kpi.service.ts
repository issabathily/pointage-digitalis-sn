import api from "./api"

export interface EmployeeKPI {
  days_worked_this_month: number
  monthly_lates: number
  monthly_overtime: number
}

export interface ManagerKPI {
  present_today: number
  late_today: number
  overtime_today: number
  total_employees: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

export const kpiService = {
  async getEmployeeKPI(): Promise<EmployeeKPI> {
    const response = await api.get("/kpi/employee/")
    return response.data
  },

  async getManagerKPI(): Promise<ManagerKPI> {
    const response = await api.get("/kpi/manager/")
    return response.data
  },

  async getEmployeeMonthlyChart(): Promise<ChartData> {
    const response = await api.get("/kpi/employee_monthly_chart/")
    return response.data
  },

  async getManagerTeamChart(): Promise<ChartData> {
    const response = await api.get("/kpi/manager_team_chart/")
    return response.data
  },

  async getManagerWeeklyTrend(): Promise<ChartData> {
    const response = await api.get("/kpi/manager_weekly_trend/")
    return response.data
  }
}
