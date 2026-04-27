import api from "./api"

export interface AttendanceStats {
  total_employees: number
  presents: number
  retards: number
  absents: number
  taux_ponctualite: number
}

export const reportsService = {
  async getAttendanceStats(): Promise<AttendanceStats> {
    const response = await api.get("/kpi/attendance_stats/")
    return response.data
  }
}
