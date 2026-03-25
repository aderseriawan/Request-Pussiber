import type {
  PlatformResponse,
  ThreatCategory,
  ThreatRecord,
  ThreatSentiment,
  ThreatSlice,
  TimelinePoint,
  TrendingTag
} from './types'

interface TwitterOptions {
  token?: string
  apiBase?: string
  forceDummy?: boolean
}

interface TwitterSearchResponse {
  data?: Array<{
    id: string
    text: string
    created_at?: string
    author_id?: string
    public_metrics?: {
      like_count?: number
      retweet_count?: number
      reply_count?: number
      quote_count?: number
    }
  }>
}

const FALLBACK_RECORDS: ThreatRecord[] = [
  {
    id: 'tw-1',
    account: '@dandhy_laksono',
    text: 'Aksi besar menolak kebijakan baru diperkirakan terjadi pada akhir pekan.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'High',
    sentiment: 'Negatif',
    platform: 'twitter',
    engagement: 18200,
    url: 'https://x.com/dandhy_laksono'
  },
  {
    id: 'tw-2',
    account: '@GUSDURians',
    text: 'Koordinasi lapangan untuk menjaga aksi tetap damai dan tertib.',
    date: new Date(Date.now() - 86400000).toISOString(),
    category: 'Medium',
    sentiment: 'Netral',
    platform: 'twitter',
    engagement: 9630,
    url: 'https://x.com/GUSDURians'
  },
  {
    id: 'tw-3',
    account: '@pandji',
    text: 'Tagar #TolakUUTNI naik tajam dengan sentimen kritis dari berbagai akun.',
    date: new Date().toISOString(),
    category: 'High',
    sentiment: 'Negatif',
    platform: 'twitter',
    engagement: 21740,
    url: 'https://x.com/pandji'
  },
  {
    id: 'tw-4',
    account: '@BivitriS',
    text: 'Diskusi publik mendorong pendekatan damai dan dialog lintas komunitas.',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'Low',
    sentiment: 'Positif',
    platform: 'twitter',
    engagement: 4150,
    url: 'https://x.com/BivitriS'
  }
]

const FALLBACK_TRENDING: TrendingTag[] = [
  { label: '#SupremasiSipil', value: 72300, platform: 'twitter' },
  { label: '#TolakUUTNI', value: 65800, platform: 'twitter' },
  { label: '#AksiMassa', value: 44100, platform: 'twitter' },
  { label: '#Demokrasi', value: 33600, platform: 'twitter' },
  { label: '#Reformasi', value: 22900, platform: 'twitter' }
]

const THREAT_COLORS: Record<ThreatCategory, string> = {
  High: '#dc2626',
  Medium: '#ea580c',
  Low: '#16a34a'
}

const normalizeDate = (value: string): string => {
  return new Date(value).toISOString().slice(0, 10)
}

const classifyCategory = (text: string): ThreatCategory => {
  const content = text.toLowerCase()
  if (/(darurat|serang|rusuh|konflik|krisis|ancam)/.test(content)) {
    return 'High'
  }
  if (/(aksi|demo|boikot|konsolidasi|kritik)/.test(content)) {
    return 'Medium'
  }
  return 'Low'
}

const classifySentiment = (text: string): ThreatSentiment => {
  const content = text.toLowerCase()
  if (/(marah|tolak|ancam|khawatir|gagal|krisis)/.test(content)) {
    return 'Negatif'
  }
  if (/(dukung|damai|kolaborasi|solid)/.test(content)) {
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
      hashtagMap.set(tag, (hashtagMap.get(tag) ?? 0) + Math.max(1, Math.round(record.engagement / 250)))
    }
  }

  const dynamic = Array.from(hashtagMap.entries())
    .map(([label, value]) => ({ label, value, platform: 'twitter' as const }))
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
    platform: 'twitter',
    source: 'dummy',
    generatedAt: new Date().toISOString(),
    summary: toSummary(FALLBACK_RECORDS),
    records: FALLBACK_RECORDS,
    trending: FALLBACK_TRENDING,
    timeline: toTimeline(FALLBACK_RECORDS),
    threatBreakdown: toThreatBreakdown(FALLBACK_RECORDS),
    monitoredAccounts: Array.from(new Set(FALLBACK_RECORDS.map((record) => record.account))),
    note
  }
}

export const fetchTwitterDashboardData = async (options: TwitterOptions): Promise<PlatformResponse> => {
  if (options.forceDummy) {
    return buildDummyResponse('Mode dummy-only aktif. Data live X API dinonaktifkan.')
  }

  const token = options.token?.trim()
  const apiBase = options.apiBase?.trim() || 'https://api.x.com/2'

  if (!token) {
    return buildDummyResponse('Token X API tidak tersedia. Menggunakan data dummy.')
  }

  try {
    const query = encodeURIComponent('(demo OR aksi OR ancaman OR keamanan) lang:id -is:retweet')
    const endpoint = `${apiBase}/tweets/search/recent?query=${query}&max_results=25&tweet.fields=created_at,author_id,public_metrics`
    const response = await $fetch<TwitterSearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.data?.length) {
      return buildDummyResponse('X API tidak mengembalikan data. Menampilkan data dummy.')
    }

    const records: ThreatRecord[] = response.data.map((tweet) => {
      const metrics = tweet.public_metrics ?? {}
      const engagement =
        (metrics.like_count ?? 0) +
        (metrics.retweet_count ?? 0) +
        (metrics.reply_count ?? 0) +
        (metrics.quote_count ?? 0)

      return {
        id: tweet.id,
        account: tweet.author_id ? `@acct_${tweet.author_id.slice(-6)}` : '@unknown',
        text: tweet.text,
        date: tweet.created_at ?? new Date().toISOString(),
        category: classifyCategory(tweet.text),
        sentiment: classifySentiment(tweet.text),
        platform: 'twitter',
        engagement,
        url: `https://x.com/i/web/status/${tweet.id}`
      }
    })

    return {
      platform: 'twitter',
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
    const message = error instanceof Error ? error.message : 'Gagal mengambil data X API.'
    return buildDummyResponse(`${message} Menampilkan data dummy.`)
  }
}
