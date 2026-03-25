<script setup lang="ts">
import type { RecommendationItem } from '~/utils/types'

defineProps<{
  data: RecommendationItem[]
}>()

const priorityClass = (priority: RecommendationItem['priority']) => {
  if (priority === 'Segera') {
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  }
  if (priority === 'Jangka Pendek') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
  }
  return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
}
</script>

<template>
  <article class="dashboard-panel p-4">
    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      Rekomendasi Strategis
    </h3>

    <div class="mt-4 grid gap-3 lg:grid-cols-3">
      <div
        v-for="item in data"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="priorityClass(item.priority)">
            {{ item.priority }}
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.confidence }}% confidence</span>
        </div>

        <h4 class="mt-3 font-semibold">{{ item.title }}</h4>
        <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ item.action }}</p>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Owner: {{ item.owner }}</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Impact: {{ item.impact }}</p>

        <ul class="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li v-for="evidence in item.evidence" :key="evidence">- {{ evidence }}</li>
        </ul>
      </div>
    </div>
  </article>
</template>
