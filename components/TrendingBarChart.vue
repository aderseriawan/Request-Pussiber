<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { TrendingTag } from '~/utils/types'

const props = defineProps<{
  title: string
  data: TrendingTag[]
}>()

const labels = computed(() => props.data.map((tag) => tag.label))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Jumlah Mention',
      data: props.data.map((tag) => tag.value),
      borderRadius: 8,
      backgroundColor: ['#334155', '#0f766e', '#0284c7', '#7c3aed', '#ea580c', '#dc2626', '#14b8a6', '#0369a1', '#4f46e5', '#f59e0b']
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  scales: {
    x: { beginAtZero: true, ticks: { color: '#64748b' } },
    y: { ticks: { color: '#64748b' } }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { parsed: { x: number } }) => `${new Intl.NumberFormat('id-ID').format(context.parsed.x)} mention`
      }
    }
  }
}))
</script>

<template>
  <article class="dashboard-panel p-4">
    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      {{ title }}
    </h3>
    <div class="mt-4 h-72">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </article>
</template>
