<script setup lang="ts">
import type { ThreatRecord } from '~/utils/types'

const props = defineProps<{
  data: ThreatRecord[]
}>()

const rows = computed(() => props.data.slice(0, 12))
</script>

<template>
  <article class="dashboard-panel p-4">
    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      Twitter Feed Intelligence
    </h3>
    <div class="mt-4 space-y-3">
      <div
        v-for="row in rows"
        :key="row.id"
        class="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-semibold">{{ row.account }}</p>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(row.engagement) }} interactions
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ row.text }}</p>
        <div class="mt-2 flex flex-wrap gap-2 text-xs">
          <span class="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">{{ row.category }}</span>
          <span class="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">{{ row.sentiment }}</span>
          <span class="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">{{ row.date.slice(0, 10) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
