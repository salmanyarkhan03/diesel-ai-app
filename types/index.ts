export type Plan = 'starter' | 'pro' | 'enterprise'
export type LocationStatus = 'active' | 'inactive'
export type InsightPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type AlertType = 'price' | 'inventory' | 'competitor' | 'system'

export interface Owner {
  id: string
  email: string
  name: string
  phone: string | null
  plan: Plan
  created_at: string
}

export interface Location {
  id: string
  owner_id: string
  name: string
  address: string
  status: LocationStatus
  created_at: string
}

export interface Report {
  id: string
  location_id: string
  date: string
  raw_data: Record<string, unknown>
  created_at: string
}

export interface Insight {
  id: string
  location_id: string
  report_id: string | null
  priority: InsightPriority
  title: string
  description: string
  action_label: string | null
  action_url: string | null
  created_at: string
}

export interface Alert {
  id: string
  location_id: string
  type: AlertType
  message: string
  resolved: boolean
  created_at: string
}
