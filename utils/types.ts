export type ThreatCategory = 'High' | 'Medium' | 'Low'
export type ThreatSentiment = 'Negatif' | 'Netral' | 'Positif'
export type ThreatFilter = 'all' | 'critical' | 'activist' | 'observer'
export type DashboardTab =
  | 'ringkasan'
  | 'agenda-demo'
  | 'twitter-feed'
  | 'instagram-monitor'
  | 'analisis-ancaman'
  | 'rekomendasi'

export interface ThreatRecord {
  id: string
  account: string
  text: string
  date: string
  category: ThreatCategory
  sentiment: ThreatSentiment
  platform: 'twitter' | 'instagram'
  engagement: number
  url?: string
}

export interface TrendingTag {
  label: string
  value: number
  platform: 'twitter' | 'instagram'
}

export interface ThreatSlice {
  label: ThreatCategory
  value: number
  color: string
}

export interface TimelinePoint {
  date: string
  value: number
}

export interface PlatformSummary {
  totalAccounts: number
  totalThreats: number
  totalDemo: number
  totalMentions: number
}

export interface PlatformResponse {
  platform: 'twitter' | 'instagram'
  source: 'live' | 'dummy'
  generatedAt: string
  summary: PlatformSummary
  records: ThreatRecord[]
  trending: TrendingTag[]
  timeline: TimelinePoint[]
  threatBreakdown: ThreatSlice[]
  monitoredAccounts: string[]
  note?: string
}

export interface WatchAccount {
  handle: string
  platform: 'twitter' | 'instagram'
  followers: number
  status: Exclude<ThreatFilter, 'all'>
}

export interface AgendaDemoItem {
  id: string
  title: string
  city: string
  date: string
  risk: ThreatCategory
  participants: number
  status: 'Planned' | 'Ongoing' | 'Escalated' | 'Resolved'
  sourceAccounts: string[]
  summary: string
}

export interface RecommendationItem {
  id: string
  priority: 'Segera' | 'Jangka Pendek' | 'Jangka Menengah'
  title: string
  action: string
  owner: string
  impact: string
  confidence: number
  evidence: string[]
}

export interface RelationCategory {
  id: string
  label: string
  color: string
}

export interface RelationNode {
  id: string
  label: string
  handle?: string
  type: 'account' | 'organization' | 'website' | 'movement' | 'media'
  platform: 'twitter' | 'instagram' | 'web'
  followers?: number
  threat: ThreatCategory
  categoryId: string
  x: number
  y: number
  description: string
}

export interface RelationEdge {
  id: string
  source: string
  target: string
  strength: number
  note: string
}
