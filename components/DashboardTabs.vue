<script setup lang="ts">
import type { DashboardTab } from '~/utils/types'

const props = defineProps<{
  modelValue: DashboardTab
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DashboardTab): void
}>()

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'agenda-demo', label: 'Agenda Demo' },
  { id: 'twitter-feed', label: 'Twitter Feed' },
  { id: 'instagram-monitor', label: 'Instagram Monitor' },
  { id: 'analisis-ancaman', label: 'Analisis Ancaman' },
  { id: 'rekomendasi', label: 'Rekomendasi' }
]
</script>

<template>
  <div class="dashboard-panel overflow-x-auto border border-cyan-900/40 p-2">
    <div class="flex min-w-max gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="rounded-lg px-3 py-2 text-sm font-semibold transition"
        :class="
          props.modelValue === tab.id
            ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_0_16px_rgba(56,189,248,0.45)]'
            : 'text-slate-300 hover:bg-slate-800'
        "
        @click="emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
