<script setup lang="ts">
import type { AgendaDemoItem } from '~/utils/types'

defineProps<{
  data: AgendaDemoItem[]
}>()

const riskClass = (risk: AgendaDemoItem['risk']) => {
  if (risk === 'High') {
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  }
  if (risk === 'Medium') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
  }
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
}
</script>

<template>
  <article class="dashboard-panel p-4">
    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      Agenda Demo
    </h3>

    <div class="mt-4 grid gap-3 lg:grid-cols-2">
      <div
        v-for="item in data"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="font-semibold">{{ item.title }}</h4>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.city }} - {{ item.date }}</p>
          </div>
          <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="riskClass(item.risk)">
            {{ item.risk }}
          </span>
        </div>

        <p class="mt-2 text-sm text-slate-700 dark:text-slate-300">{{ item.summary }}</p>

        <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span class="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">{{ item.participants }} peserta</span>
          <span class="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">{{ item.status }}</span>
        </div>

        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Sumber: {{ item.sourceAccounts.join(', ') }}
        </p>
      </div>
    </div>
  </article>
</template>
