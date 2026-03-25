<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ThreatSlice } from '~/utils/types'

const props = defineProps<{
  title: string
  data: ThreatSlice[]
}>()

const total = computed(() => Math.max(1, props.data.reduce((sum, item) => sum + item.value, 0)))

const chartData = computed(() => ({
  labels: props.data.map((item) => item.label),
  datasets: [
    {
      data: props.data.map((item) => item.value),
      backgroundColor: props.data.map((item) => item.color),
      borderWidth: 0,
      borderRadius: 8
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { label: string; parsed: number }) => {
          const percentage = ((context.parsed / total.value) * 100).toFixed(1)
          return `${context.label}: ${context.parsed} (${percentage}%)`
        }
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

    <div class="mt-4 h-56">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <ul class="mt-4 space-y-2">
      <li v-for="slice in data" :key="slice.label" class="flex items-center justify-between text-sm">
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: slice.color }" />
          {{ slice.label }}
        </span>
        <span class="font-semibold">
          {{ ((slice.value / total) * 100).toFixed(1) }}%
        </span>
      </li>
    </ul>
  </article>
</template>
