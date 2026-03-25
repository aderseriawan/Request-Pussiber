<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color: string
}>()
</script>

<template>
  <article class="dashboard-panel p-4">
    <div class="flex items-center justify-between">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {{ title }}
      </p>
      <span
        class="rounded-lg px-2 py-1 text-sm font-semibold text-white"
        :style="{ backgroundColor: color }"
      >
        {{ icon }}
      </span>
    </div>
    <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ value }}</p>
  </article>
</template>
