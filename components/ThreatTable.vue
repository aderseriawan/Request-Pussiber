<script setup lang="ts">
import type { ThreatRecord } from '~/utils/types'

defineProps<{
  data: ThreatRecord[]
}>()

const categoryClass = (category: ThreatRecord['category']) => {
  if (category === 'High') {
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  }
  if (category === 'Medium') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
  }
  return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
}

const sentimentClass = (sentiment: ThreatRecord['sentiment']) => {
  if (sentiment === 'Negatif') {
    return 'text-red-600 dark:text-red-300'
  }
  if (sentiment === 'Positif') {
    return 'text-green-600 dark:text-green-300'
  }
  return 'text-slate-600 dark:text-slate-300'
}
</script>

<template>
  <article class="dashboard-panel overflow-hidden">
    <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Threat Feed Table
      </h3>
      <span class="text-xs text-slate-500 dark:text-slate-400">{{ data.length }} record</span>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-slate-100/80 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th class="px-4 py-3">Akun</th>
            <th class="px-4 py-3">Isi Teks</th>
            <th class="px-4 py-3">Tanggal</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Sentimen</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in data"
            :key="row.id"
            class="border-b border-slate-200/80 align-top dark:border-slate-800"
          >
            <td class="px-4 py-3 font-semibold">{{ row.account }}</td>
            <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ row.text }}</td>
            <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ row.date.slice(0, 10) }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="categoryClass(row.category)">
                {{ row.category }}
              </span>
            </td>
            <td class="px-4 py-3 font-semibold" :class="sentimentClass(row.sentiment)">{{ row.sentiment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
