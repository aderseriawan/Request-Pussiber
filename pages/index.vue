<script setup lang="ts">
import type { DashboardTab, ThreatRecord } from '~/utils/types'

const store = useThreatStore()
const {
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
} = useThreatData()

const activeTab = ref<DashboardTab>('ringkasan')

const summaryCards = computed(() => [
  { title: 'Total Akun Dipantau', value: totalAccounts.value, icon: 'AC', color: '#0f766e' },
  { title: 'Total Ancaman', value: totalThreats.value, icon: 'TH', color: '#dc2626' },
  { title: 'Total Agenda Demo', value: totalDemo.value, icon: 'DM', color: '#ea580c' },
  {
    title: 'Total Mention',
    value: new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalMentions.value),
    icon: 'MN',
    color: '#2563eb'
  }
])

const filteredRecords = computed<ThreatRecord[]>(() => {
  if (store.activeFilter === 'all') {
    return records.value
  }

  if (store.activeFilter === 'critical') {
    return records.value.filter((record) => record.category === 'High')
  }

  if (store.activeFilter === 'activist') {
    return records.value.filter((record) => /(aksi|demo|massa)/i.test(record.text))
  }

  return records.value.filter((record) => record.category === 'Low')
})
</script>

<template>
  <section class="space-y-4">
    <div class="dashboard-panel p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-xl font-bold sm:text-2xl">Dashboard Pemantauan Ancaman Media Sosial</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Data X dan Instagram dari API internal Nuxt, dengan mode dummy-ready untuk pengembangan aman.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-slate-200 px-3 py-1 font-semibold dark:bg-slate-800">
            X: {{ sourceInfo.twitter }}
          </span>
          <span class="rounded-full bg-slate-200 px-3 py-1 font-semibold dark:bg-slate-800">
            IG: {{ sourceInfo.instagram }}
          </span>
          <button class="rounded-lg bg-slateBlue px-3 py-1.5 font-semibold text-white" @click="refreshAll">
            Refresh Data
          </button>
        </div>
      </div>
    </div>

    <DashboardTabs v-model="activeTab" />

    <LoadingSpinner v-if="pending" />

    <div v-else-if="error" class="dashboard-panel p-4 text-sm text-red-600 dark:text-red-300">
      Gagal memuat data API. Silakan cek konfigurasi `.env` dan coba `Refresh Data`.
    </div>

    <template v-else>
      <template v-if="activeTab === 'ringkasan'">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            v-for="card in summaryCards"
            :key="card.title"
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :color="card.color"
          />
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
          <ThreatDonutChart title="Persentase Kategori Ancaman" :data="threatBreakdown" />
          <TrendingBarChart class="xl:col-span-2" title="Top Hashtag Trending (X + Instagram)" :data="trending" />
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
          <TimelineLineChart class="xl:col-span-2" title="Timeline Ancaman Harian" :data="timeline" />
          <article class="dashboard-panel p-4">
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Distribusi Persentase
            </h3>
            <ul class="mt-4 space-y-3 text-sm">
              <li v-for="item in percentages" :key="item.label" class="flex items-center justify-between">
                <span>{{ item.label }}</span>
                <span class="font-semibold">{{ item.percentage }}%</span>
              </li>
            </ul>
          </article>
        </div>

        <ThreatFlowDiagram />
        <ThreatTable :data="filteredRecords" />
      </template>

      <AgendaDemoPanel v-else-if="activeTab === 'agenda-demo'" :data="agendaDemo" />

      <TwitterFeedPanel v-else-if="activeTab === 'twitter-feed'" :data="twitterFeed" />

      <InstagramMonitorPanel v-else-if="activeTab === 'instagram-monitor'" :data="instagramFeed" />

      <ThreatAnalysisPanel
        v-else-if="activeTab === 'analisis-ancaman'"
        :categories="relationCategories"
        :nodes="relationNodes"
        :edges="relationEdges"
        :breakdown="threatBreakdown"
      />

      <RecommendationPanel v-else :data="recommendations" />
    </template>
  </section>
</template>
