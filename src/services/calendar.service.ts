import api from "./api"

export interface PointageRecord {
  id: number
  date: string
  heure_entree: string | null
  heure_sortie: string | null
  est_retard: boolean
  minutes_retard: number
  heures_sup: number
  typePointage: string | null
  user?: number | null
}

export interface AbsenceRecord {
  id: number
  dateDebut: string
  dateFin: string
  motif: string
  typeAbsence: string
  statut: "EN_ATTENTE" | "VALIDEE" | "REFUSEE"
  user?: number | null
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  pointage?: PointageRecord
  absences: AbsenceRecord[]
  isToday: boolean
}

function normalizeDate(d: unknown): string {
  if (typeof d !== "string") return ""
  return d.split("T")[0] || ""
}

function extractUserId(raw: any): number | null {
  const idRaw =
    raw?.user ??
    raw?.user_id ??
    raw?.utilisateur ??
    raw?.utilisateur_id ??
    raw?.employe ??
    raw?.employe_id ??
    raw?.employee ??
    raw?.employee_id
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw)
  return Number.isFinite(id) && id > 0 ? id : null
}

export const getMyPointages = async (userId?: number | null): Promise<PointageRecord[]> => {
  const response = await api.get("/pointages/", {
    params: userId ? { user: userId } : undefined,
  })
  const list = Array.isArray(response.data) ? response.data : response.data?.results ?? []
  const mapped = list.map((p: any): PointageRecord => ({
    id: Number(p.id) || 0,
    date: normalizeDate(p.date),
    heure_entree: p.heure_entree ?? null,
    heure_sortie: p.heure_sortie ?? null,
    est_retard: !!p.est_retard,
    minutes_retard: Number(p.minutes_retard) || 0,
    heures_sup: Number(p.heures_sup) || 0,
    typePointage: p.typePointage ?? null,
    user: extractUserId(p),
  }))
  return userId ? mapped.filter((p) => (p.user ? p.user === userId : true)) : mapped
}

export const getMyAbsences = async (userId?: number | null): Promise<AbsenceRecord[]> => {
  const response = await api.get("/absences/", {
    params: userId ? { user: userId } : undefined,
  })
  const list = Array.isArray(response.data) ? response.data : response.data?.results ?? []
  const mapped = list.map((a: any): AbsenceRecord => ({
    id: Number(a.id) || 0,
    dateDebut: normalizeDate(a.dateDebut),
    dateFin: normalizeDate(a.dateFin),
    motif: a.motif ?? "",
    typeAbsence: a.typeAbsence ?? "AUTRE",
    statut: a.statut ?? "EN_ATTENTE",
    user: extractUserId(a),
  }))
  return userId ? mapped.filter((a) => (a.user ? a.user === userId : true)) : mapped
}

export function buildCalendar(
  year: number,
  month: number,
  pointages: PointageRecord[],
  absences: AbsenceRecord[]
): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeek = new Date(firstDay)
  startWeek.setDate(startWeek.getDate() - ((firstDay.getDay() + 6) % 7))

  const endWeek = new Date(lastDay)
  endWeek.setDate(endWeek.getDate() + ((7 - endWeek.getDay()) % 7))

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const days: CalendarDay[] = []
  const cursor = new Date(startWeek)

  while (cursor <= endWeek) {
    const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`
    const pointage = pointages.find((p) => p.date === dateStr)
    const dayAbsences = absences.filter(
      (a) => dateStr >= a.dateDebut && dateStr <= a.dateFin
    )
    days.push({
      date: dateStr,
      day: cursor.getDate(),
      isCurrentMonth: cursor.getMonth() === month,
      pointage,
      absences: dayAbsences,
      isToday: dateStr === todayStr,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}
