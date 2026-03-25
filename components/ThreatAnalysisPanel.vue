<script setup lang="ts">
import type { RelationCategory, RelationEdge, RelationNode, ThreatSlice } from '~/utils/types'

defineProps<{
  categories: RelationCategory[]
  nodes: RelationNode[]
  edges: RelationEdge[]
  breakdown: ThreatSlice[]
}>()
</script>

<template>
  <section class="space-y-4">
    <div class="grid gap-4 md:grid-cols-3">
      <article
        v-for="slice in breakdown"
        :key="slice.label"
        class="dashboard-panel p-4"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {{ slice.label }} Threat
        </p>
        <p class="mt-2 text-3xl font-bold" :style="{ color: slice.color }">{{ slice.value }}</p>
      </article>
    </div>

    <ThreatRelationGraph :categories="categories" :nodes="nodes" :edges="edges" />
  </section>
</template>
