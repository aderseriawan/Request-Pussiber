<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { TimelinePoint } from '~/utils/types'

const props = defineProps<{
  title: string
  data: TimelinePoint[]
}>()

const chartData = computed(() => ({
  labels: props.data.map((point) => point.date),
  datasets: [
    {
      label: 'Jumlah Ancaman',
      data: props.data.map((point) => point.value),
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.2)',
      fill: true,
      tension: 0.32,
      pointRadius: 4,
      pointBackgroundColor: '#0f172a'
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0, color: '#64748b' }
    },
    x: {
      ticks: { color: '#64748b' }
    }
  },
  plugins: {
    legend: { display: false }
  }
}))
</script>

<template>
  <article class="dashboard-panel p-4">
    <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      {{ title }}
    </h3>
    <div class="mt-4 h-72">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </article>
</template>
