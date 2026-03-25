import type {
  PlatformResponse,
  ThreatCategory,
  ThreatRecord,
  ThreatSentiment,
  ThreatSlice,
  TimelinePoint,
  TrendingTag
} from './types'

interface InstagramOptions {
  token?: string
  apiBase?: string
  businessId?: string
  forceDummy?: boolean
}

interface InstagramMediaResponse {
  data?: Array<{
    id: string
    caption?: string
    timestamp?: string
    like_count?: number
    comments_count?: number
    permalink?: string
    username?: string
  }>
}

const FALLBACK_POSTS: ThreatRecord[] = [
  {
    id: 'ig-1',
    account: '@niwseir',
    text: 'Mobilisasi massa menjelang unjuk rasa akhir pekan. #AksiMassa #SupremasiSipil',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'High',
    sentiment: 'Negatif',
    platform: 'instagram',
    engagement: 12400,
    url: 'https://instagram.com/niwseir'
  },
  {
    id: 'ig-2',
    account: '@logos_id',
    text: 'Liputan visual tentang titik kumpul aksi mahasiswa. #TolakUUTNI',
    date: new Date(Date.now() - 86400000).toISOString(),
    category: 'Medium',
    sentiment: 'Netral',
    platform: 'instagram',
    engagement: 9320,
    url: 'https://instagram.com/logos_id'
  },
  {
    id: 'ig-3',
    account: '@safenetvoice',
    text: 'Edukasi keamanan digital untuk peserta aksi damai. #KeamananDigital #Demokrasi',
    date: new Date().toISOString(),
    category: 'Low',
    sentiment: 'Positif',
    platform: 'instagram',
    engagement: 5110,
    url: 'https://instagram.com/safenetvoice'
  }
]

const FALLBACK_TRENDING: TrendingTag[] = [
  { label: '#AksiMassa', value: 28700, platform: 'instagram' },
  { label: '#TolakUUTNI', value: 25400, platform: 'instagram' },
  { label: '#Demokrasi', value: 20200, platform: 'instagram' },
  { label: '#KeamananDigital', value: 14700, platform: 'instagram' },
  { label: '#SupremasiSipil', value: 11900, platform: 'instagram' }
]

const THREAT_COLORS: Record<ThreatCategory, string> = {
  High: '#dc2626',
  Medium: '#ea580c',
  Low: '#16a34a'
}

const normalizeDate = (value: string): string => new Date(value).toISOString().slice(0, 10)

const classifyCategory = (text: string): ThreatCategory => {
  const content = text.toLowerCase()
  if (/(darurat|serang|rusuh|konflik|ancam)/.test(content)) {
    return 'High'
  }
  if (/(aksi|demo|boikot|kampanye|kritik)/.test(content)) {
    return 'Medium'
  }
  return 'Low'
}

const classifySentiment = (text: string): ThreatSentiment => {
  const content = text.toLowerCase()
  if (/(benci|khawatir|tolak|krisis|cemas)/.test(content)) {
    return 'Negatif'
  }
  if (/(damai|edukasi|solidaritas|kolaborasi)/.test(content)) {
    return 'Positif'
  }
  return 'Netral'
}

const parseHashtags = (text: string): string[] => {
  return Array.from(text.matchAll(/#([\w-]+)/g)).map((item) => `#${item[1]}`)
}

const toThreatBreakdown = (records: ThreatRecord[]): ThreatSlice[] => {
  const high = records.filter((record) => record.category === 'High').length
  const medium = records.filter((record) => record.category === 'Medium').length
  const low = records.filter((record) => record.category === 'Low').length

  return [
    { label: 'High', value: high, color: THREAT_COLORS.High },
    { label: 'Medium', value: medium, color: THREAT_COLORS.Medium },
    { label: 'Low', value: low, color: THREAT_COLORS.Low }
  ]
}

const toTimeline = (records: ThreatRecord[]): TimelinePoint[] => {
  const map = new Map<string, number>()

  for (const record of records) {
    const key = normalizeDate(record.date)
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const toTrending = (records: ThreatRecord[]): TrendingTag[] => {
  const hashtagMap = new Map<string, number>()

  for (const record of records) {
    for (const tag of parseHashtags(record.text)) {
      hashtagMap.set(tag, (hashtagMap.get(tag) ?? 0) + Math.max(1, Math.round(record.engagement / 200)))
    }
  }

  const dynamic = Array.from(hashtagMap.entries())
    .map(([label, value]) => ({ label, value, platform: 'instagram' as const }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  return dynamic.length > 0 ? dynamic : FALLBACK_TRENDING
}

const toSummary = (records: ThreatRecord[]) => {
  const accounts = new Set(records.map((record) => record.account))
  const totalMentions = records.reduce((sum, record) => sum + record.engagement, 0)
  const totalDemo = records.filter((record) => /(demo|aksi)/i.test(record.text)).length

  return {
    totalAccounts: accounts.size,
    totalThreats: records.length,
    totalDemo,
    totalMentions
  }
}

const buildDummyResponse = (note: string): PlatformResponse => {
  return {
    platform: 'instagram',
    source: 'dummy',
    generatedAt: new Date().toISOString(),
    summary: toSummary(FALLBACK_POSTS),
    records: FALLBACK_POSTS,
    trending: FALLBACK_TRENDING,
    timeline: toTimeline(FALLBACK_POSTS),
    threatBreakdown: toThreatBreakdown(FALLBACK_POSTS),
    monitoredAccounts: Array.from(new Set(FALLBACK_POSTS.map((record) => record.account))),
    note
  }
}

export const fetchInstagramDashboardData = async (
  options: InstagramOptions
): Promise<PlatformResponse> => {
  if (options.forceDummy) {
    return buildDummyResponse('Mode dummy-only aktif. Data live Instagram API dinonaktifkan.')
  }

  const token = options.token?.trim()
  const apiBase = options.apiBase?.trim() || 'https://graph.instagram.com'

  if (!token) {
    return buildDummyResponse('Token Instagram Graph API tidak tersedia. Menggunakan data dummy.')
  }

  try {
    const endpoint = `${apiBase}/me/media?fields=id,caption,timestamp,like_count,comments_count,permalink,username&limit=25&access_token=${encodeURIComponent(token)}`
    const response = await $fetch<InstagramMediaResponse>(endpoint)

    if (!response.data?.length) {
      return buildDummyResponse('Instagram API tidak mengembalikan data. Menampilkan data dummy.')
    }

    const records: ThreatRecord[] = response.data.map((post) => {
      const caption = post.caption || 'Posting tanpa caption'
      const account = post.username ? `@${post.username}` : '@instagram_account'
      const engagement = (post.like_count ?? 0) + (post.comments_count ?? 0)

      return {
        id: post.id,
        account,
        text: caption,
        date: post.timestamp ?? new Date().toISOString(),
        category: classifyCategory(caption),
        sentiment: classifySentiment(caption),
        platform: 'instagram',
        engagement,
        url: post.permalink
      }
    })

    return {
      platform: 'instagram',
      source: 'live',
      generatedAt: new Date().toISOString(),
      summary: toSummary(records),
      records,
      trending: toTrending(records),
      timeline: toTimeline(records),
      threatBreakdown: toThreatBreakdown(records),
      monitoredAccounts: Array.from(new Set(records.map((record) => record.account)))
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data Instagram API.'
    return buildDummyResponse(`${message} Menampilkan data dummy.`)
  }
}
