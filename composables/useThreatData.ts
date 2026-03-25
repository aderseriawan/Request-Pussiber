import type {
  AgendaDemoItem,
  PlatformResponse,
  RecommendationItem,
  RelationCategory,
  RelationEdge,
  RelationNode,
  ThreatRecord,
  ThreatSlice,
  TimelinePoint,
  TrendingTag
} from '~/utils/types'

const COLOR_MAP: Record<string, string> = {
  High: '#dc2626',
  Medium: '#ea580c',
  Low: '#16a34a'
}

const RELATION_CATEGORIES: RelationCategory[] = [
  { id: 'mega', label: 'Mega-Influencer (Pembentuk Opini)', color: '#f97316' },
  { id: 'amplifier', label: 'Amplifier Kritis (Narasi & Framing)', color: '#ef4444' },
  { id: 'advocacy', label: 'Organisasi HAM & Advokasi', color: '#06b6d4' },
  { id: 'student', label: 'Gerakan Mahasiswa & Sipil', color: '#22c55e' },
  { id: 'media', label: 'Media Mainstream (Amplifier Masif)', color: '#facc15' },
  { id: 'global', label: 'Aktor Internasional (Tekanan Diplomatik)', color: '#a855f7' },
  { id: 'funding', label: 'Funding Hub (Penyalur Dana Internasional)', color: '#ec4899' }
]

const RELATION_NODES: RelationNode[] = [
  {
    id: 'pandji',
    label: 'Pandji Pragiwaksono',
    handle: '@pandji',
    type: 'account',
    platform: 'twitter',
    followers: 1700000,
    threat: 'High',
    categoryId: 'mega',
    x: 48,
    y: 37,
    description: 'Amplifier opini publik dengan engagement tinggi pada isu kebijakan dan aksi massa.'
  },
  {
    id: 'niwseir',
    label: 'Iwin (niwseir)',
    handle: '@niwseir',
    type: 'account',
    platform: 'instagram',
    followers: 420000,
    threat: 'High',
    categoryId: 'amplifier',
    x: 57,
    y: 38,
    description: 'Penguat visual campaign lintas platform dengan efek viral cepat.'
  },
  {
    id: 'bem',
    label: 'BEM Seluruh Indonesia',
    type: 'movement',
    platform: 'web',
    threat: 'Medium',
    categoryId: 'student',
    x: 49,
    y: 62,
    description: 'Node mobilisasi lapangan untuk agenda demonstrasi nasional.'
  },
  {
    id: 'kontras',
    label: 'KontraS',
    handle: '@KontraSupdates',
    type: 'organization',
    platform: 'twitter',
    followers: 190000,
    threat: 'Medium',
    categoryId: 'advocacy',
    x: 39,
    y: 51,
    description: 'Pusat advokasi isu HAM dan dokumentasi insiden di lapangan.'
  },
  {
    id: 'ylbhi',
    label: 'YLBHI',
    handle: '@YLBHI',
    type: 'organization',
    platform: 'twitter',
    followers: 130000,
    threat: 'Medium',
    categoryId: 'advocacy',
    x: 56,
    y: 56,
    description: 'Koordinasi bantuan hukum dan amplifikasi risiko represif.'
  },
  {
    id: 'tempo',
    label: 'Tempo.co',
    type: 'website',
    platform: 'web',
    threat: 'Low',
    categoryId: 'media',
    x: 62,
    y: 58,
    description: 'Sumber rujukan media untuk framing isu menjadi konsumsi publik luas.'
  },
  {
    id: 'cnn',
    label: 'CNN Indonesia',
    type: 'website',
    platform: 'web',
    threat: 'Low',
    categoryId: 'media',
    x: 33,
    y: 64,
    description: 'Amplifier pemberitaan isu keamanan dengan audience nasional.'
  },
  {
    id: 'logos',
    label: 'Logos Indonesia',
    handle: '@logos_id',
    type: 'account',
    platform: 'instagram',
    followers: 117000,
    threat: 'Medium',
    categoryId: 'amplifier',
    x: 62,
    y: 44,
    description: 'Distribusi visual campaign dan narasi tematik berbasis hashtag.'
  },
  {
    id: 'safenet',
    label: 'SAFEnet',
    handle: '@safenetvoice',
    type: 'organization',
    platform: 'instagram',
    followers: 198000,
    threat: 'Low',
    categoryId: 'advocacy',
    x: 58,
    y: 51,
    description: 'Edukasi keamanan digital dan narasi mitigasi risiko partisipan aksi.'
  },
  {
    id: 'intl',
    label: 'Amnesty International',
    type: 'organization',
    platform: 'web',
    threat: 'Medium',
    categoryId: 'global',
    x: 70,
    y: 66,
    description: 'Aktor tekanan diplomatik jika eskalasi isu meningkat.'
  }
]

const RELATION_EDGES: RelationEdge[] = [
  { id: 'e1', source: 'pandji', target: 'niwseir', strength: 0.92, note: 'Amplifikasi lintas platform' },
  { id: 'e2', source: 'pandji', target: 'bem', strength: 0.88, note: 'Dorongan solidaritas publik' },
  { id: 'e3', source: 'bem', target: 'kontras', strength: 0.73, note: 'Koordinasi advokasi lapangan' },
  { id: 'e4', source: 'kontras', target: 'ylbhi', strength: 0.77, note: 'Jalur bantuan hukum' },
  { id: 'e5', source: 'ylbhi', target: 'tempo', strength: 0.66, note: 'Distribusi rilis insiden' },
  { id: 'e6', source: 'cnn', target: 'pandji', strength: 0.59, note: 'Penguatan exposure media' },
  { id: 'e7', source: 'niwseir', target: 'logos', strength: 0.81, note: 'Konsolidasi konten visual' },
  { id: 'e8', source: 'logos', target: 'safenet', strength: 0.62, note: 'Penyebaran narasi keamanan digital' },
  { id: 'e9', source: 'safenet', target: 'intl', strength: 0.53, note: 'Kanal monitoring internasional' },
  { id: 'e10', source: 'tempo', target: 'intl', strength: 0.44, note: 'Pemberitaan global potential' }
]

const AGENDA_DEMO: AgendaDemoItem[] = [
  {
    id: 'ag-1',
    title: 'Aksi Tolak Revisi Kebijakan Keamanan',
    city: 'Jakarta',
    date: '2026-04-01',
    risk: 'High',
    participants: 4500,
    status: 'Planned',
    sourceAccounts: ['@pandji', '@dandhy_laksono', '@BivitriS'],
    summary: 'Seruan lintas kampus dan influencer meningkat dengan intensitas tinggi.'
  },
  {
    id: 'ag-2',
    title: 'Mimbar Bebas Mahasiswa',
    city: 'Bandung',
    date: '2026-04-02',
    risk: 'Medium',
    participants: 1700,
    status: 'Planned',
    sourceAccounts: ['@BEM_UI', '@KontraSupdates'],
    summary: 'Koordinasi terfokus pada isu transparansi dan kebebasan sipil.'
  },
  {
    id: 'ag-3',
    title: 'Long March Koalisi Sipil',
    city: 'Yogyakarta',
    date: '2026-04-03',
    risk: 'High',
    participants: 2800,
    status: 'Escalated',
    sourceAccounts: ['@niwseir', '@GUSDURians'],
    summary: 'Narasi ajakan meluas ke jaringan regional dan komunitas kampus.'
  },
  {
    id: 'ag-4',
    title: 'Diskusi Publik HAM & Keamanan Digital',
    city: 'Surabaya',
    date: '2026-04-04',
    risk: 'Low',
    participants: 500,
    status: 'Ongoing',
    sourceAccounts: ['@safenetvoice', '@YLBHI'],
    summary: 'Dominan edukatif, namun berpotensi menjadi titik koordinasi lanjutan.'
  }
]

const RECOMMENDATION_SEED: RecommendationItem[] = [
  {
    id: 'rc-1',
    priority: 'Segera',
    title: 'Aktifkan early-warning untuk akun amplifier kritis',
    action: 'Pasang alert 15 menit untuk lonjakan mention pada @pandji, @niwseir, @dandhy_laksono.',
    owner: 'Tim SOC Media',
    impact: 'Mempercepat deteksi eskalasi narasi sebelum puncak agenda demo.',
    confidence: 92,
    evidence: ['Engagement High cluster', 'Relasi kuat ke node gerakan mahasiswa']
  },
  {
    id: 'rc-2',
    priority: 'Jangka Pendek',
    title: 'Konsolidasi counter-narrative terverifikasi',
    action: 'Terbitkan konten klarifikasi berbasis data pada kanal media resmi dan mitra verifikator.',
    owner: 'Tim Komunikasi Strategis',
    impact: 'Menurunkan propagasi framing negatif di Twitter Feed dan Instagram Monitor.',
    confidence: 84,
    evidence: ['Sentimen negatif dominan', 'Trending hashtag meningkat >20%']
  },
  {
    id: 'rc-3',
    priority: 'Jangka Menengah',
    title: 'Bangun peta relasi aktor lintas platform',
    action: 'Rilis knowledge graph mingguan untuk mengidentifikasi broker utama dan jalur amplifikasi.',
    owner: 'Analis Intel Siber',
    impact: 'Memperkuat akurasi threat analysis dan perencanaan intervensi.',
    confidence: 79,
    evidence: ['Node media dan advokasi makin terhubung', 'Cluster global mulai aktif']
  }
]

const mergeTimeline = (points: TimelinePoint[]): TimelinePoint[] => {
  const map = new Map<string, number>()

  for (const point of points) {
    map.set(point.date, (map.get(point.date) ?? 0) + point.value)
  }

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const mergeBreakdown = (records: ThreatRecord[]): ThreatSlice[] => {
  const categories = ['High', 'Medium', 'Low'] as const

  return categories.map((label) => ({
    label,
    value: records.filter((record) => record.category === label).length,
    color: COLOR_MAP[label]
  }))
}

const mergeTrending = (tags: TrendingTag[]): TrendingTag[] => {
  const map = new Map<string, number>()

  for (const tag of tags) {
    map.set(tag.label, (map.get(tag.label) ?? 0) + tag.value)
  }

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, platform: 'twitter' as const }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
}

export const useThreatData = () => {
  const twitter = useFetch<PlatformResponse>('/api/twitter')
  const instagram = useFetch<PlatformResponse>('/api/instagram')

  const pending = computed(() => twitter.pending.value || instagram.pending.value)
  const error = computed(() => twitter.error.value || instagram.error.value)

  const records = computed<ThreatRecord[]>(() => {
    const merged = [...(twitter.data.value?.records ?? []), ...(instagram.data.value?.records ?? [])]
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const twitterFeed = computed<ThreatRecord[]>(() =>
    records.value
      .filter((record) => record.platform === 'twitter')
      .sort((a, b) => b.engagement - a.engagement)
  )

  const instagramFeed = computed<ThreatRecord[]>(() =>
    records.value
      .filter((record) => record.platform === 'instagram')
      .sort((a, b) => b.engagement - a.engagement)
  )

  const threatBreakdown = computed<ThreatSlice[]>(() => mergeBreakdown(records.value))
  const timeline = computed<TimelinePoint[]>(() =>
    mergeTimeline([...(twitter.data.value?.timeline ?? []), ...(instagram.data.value?.timeline ?? [])])
  )

  const trending = computed<TrendingTag[]>(() =>
    mergeTrending([...(twitter.data.value?.trending ?? []), ...(instagram.data.value?.trending ?? [])])
  )

  const totalAccounts = computed(() => new Set(records.value.map((record) => record.account)).size)
  const totalThreats = computed(() => records.value.length)
  const totalDemo = computed(() => records.value.filter((record) => /(demo|aksi|long march)/i.test(record.text)).length)
  const totalMentions = computed(() => records.value.reduce((sum, record) => sum + record.engagement, 0))

  const percentages = computed(() => {
    const total = Math.max(1, totalThreats.value)
    return threatBreakdown.value.map((item) => ({
      ...item,
      percentage: Number(((item.value / total) * 100).toFixed(1))
    }))
  })

  const agendaDemo = computed<AgendaDemoItem[]>(() =>
    AGENDA_DEMO.map((item) => {
      const linkedRecords = records.value.filter((record) =>
        item.sourceAccounts.some((account) => record.account.toLowerCase().includes(account.replace('@', '').toLowerCase()))
      )

      if (linkedRecords.length >= 2 && item.risk !== 'Low') {
        return {
          ...item,
          status: 'Escalated' as const
        }
      }

      return item
    })
  )

  const recommendations = computed<RecommendationItem[]>(() => {
    const highCount = records.value.filter((record) => record.category === 'High').length

    return RECOMMENDATION_SEED.map((item) => {
      if (item.id === 'rc-1') {
        return {
          ...item,
          confidence: Math.min(99, item.confidence + Math.round(highCount / 2))
        }
      }

      return item
    })
  })

  const relationCategories = computed(() => RELATION_CATEGORIES)
  const relationNodes = computed(() => RELATION_NODES)
  const relationEdges = computed(() => RELATION_EDGES)

  const sourceInfo = computed(() => ({
    twitter: twitter.data.value?.source ?? 'dummy',
    instagram: instagram.data.value?.source ?? 'dummy'
  }))

  const refreshAll = async () => {
    await Promise.all([twitter.refresh(), instagram.refresh()])
  }

  return {
    pending,
    error,
    records,
    twitterFeed,
    instagramFeed,
    threatBreakdown,
    timeline,
    trending,
    percentages,
    totalAccounts,
    totalThreats,
    totalDemo,
    totalMentions,
    agendaDemo,
    recommendations,
    relationCategories,
    relationNodes,
    relationEdges,
    sourceInfo,
    refreshAll
  }
}
