<script setup lang="ts">
import type { ThreatFilter, WatchAccount } from '~/utils/types'

defineProps<{
  accounts: WatchAccount[]
  activeFilter: ThreatFilter
}>()

const emit = defineEmits<{
  (e: 'update:filter', value: ThreatFilter): void
}>()

const filters: Array<{ label: string; value: ThreatFilter }> = [
  { label: 'Semua', value: 'all' },
  { label: 'Kritikal', value: 'critical' },
  { label: 'Aktivis', value: 'activist' },
  { label: 'Observer', value: 'observer' }
]

const formatFollowers = (value: number): string => {
  return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)
}
</script>

<template>
  <aside class="dashboard-panel h-full p-4">
    <div class="mb-5">
      <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
        Watchlist Prioritas
      </h2>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Pantau akun kritikal dan pergerakan narasi ancaman.
      </p>
    </div>

    <div class="mb-5 grid grid-cols-2 gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="rounded-xl px-3 py-2 text-xs font-semibold transition"
        :class="
          activeFilter === filter.value
            ? 'bg-slateBlue text-white shadow'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
        "
        @click="emit('update:filter', filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="account in accounts"
        :key="account.handle"
        class="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold">{{ account.handle }}</p>
          <span class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ account.platform }}</span>
        </div>
        <div class="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{{ formatFollowers(account.followers) }} followers</span>
          <span class="rounded-full bg-slate-200 px-2 py-0.5 capitalize dark:bg-slate-700">{{ account.status }}</span>
        </div>
      </li>
    </ul>
  </aside>
</template>
