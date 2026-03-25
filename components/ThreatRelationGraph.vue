<script setup lang="ts">
import type { RelationCategory, RelationEdge, RelationNode } from '~/utils/types'

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 620

const props = defineProps<{
  categories: RelationCategory[]
  nodes: RelationNode[]
  edges: RelationEdge[]
}>()

const activeCategory = ref<string>('all')
const selectedNodeId = ref<string>(props.nodes[0]?.id ?? '')
const hoveredNodeId = ref<string>('')

const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })

const isPanning = ref(false)
const draggingNodeId = ref<string>('')
const pointerStart = ref({ x: 0, y: 0 })

const nodePositions = reactive<Record<string, { x: number; y: number }>>({})

for (const node of props.nodes) {
  nodePositions[node.id] = { x: node.x * 10, y: node.y * 6.2 }
}

const visibleNodes = computed(() => {
  const source =
    activeCategory.value === 'all'
      ? props.nodes
      : props.nodes.filter((node) => node.categoryId === activeCategory.value)

  return source.map((node) => ({
    ...node,
    drawX: nodePositions[node.id]?.x ?? node.x * 10,
    drawY: nodePositions[node.id]?.y ?? node.y * 6.2
  }))
})

const visibleNodeIds = computed(() => new Set(visibleNodes.value.map((node) => node.id)))

const visibleEdges = computed(() =>
  props.edges.filter((edge) => visibleNodeIds.value.has(edge.source) && visibleNodeIds.value.has(edge.target))
)

const nodeMap = computed(() => new Map(visibleNodes.value.map((node) => [node.id, node])))

const selectedNode = computed(() => {
  const found = nodeMap.value.get(selectedNodeId.value)
  return found ?? visibleNodes.value[0] ?? null
})

const focusedNodeId = computed(() => hoveredNodeId.value || selectedNode.value?.id || '')

const selectedConnections = computed(() => {
  if (!selectedNode.value) {
    return []
  }

  return visibleEdges.value
    .filter((edge) => edge.source === selectedNode.value?.id || edge.target === selectedNode.value?.id)
    .map((edge) => {
      const targetId = edge.source === selectedNode.value?.id ? edge.target : edge.source
      return {
        edge,
        node: nodeMap.value.get(targetId)
      }
    })
    .filter((item) => Boolean(item.node))
})

watch(visibleNodes, (value) => {
  if (!value.find((node) => node.id === selectedNodeId.value)) {
    selectedNodeId.value = value[0]?.id ?? ''
  }
})

const riskColor = (risk: RelationNode['threat']) => {
  if (risk === 'High') {
    return '#ef4444'
  }
  if (risk === 'Medium') {
    return '#f97316'
  }
  return '#22c55e'
}

const edgeIsFocused = (edge: RelationEdge): boolean => {
  if (!focusedNodeId.value) {
    return false
  }
  return edge.source === focusedNodeId.value || edge.target === focusedNodeId.value
}

const beginPan = (event: MouseEvent) => {
  if (draggingNodeId.value) {
    return
  }
  isPanning.value = true
  pointerStart.value = { x: event.clientX, y: event.clientY }
}

const beginNodeDrag = (nodeId: string, event: MouseEvent) => {
  draggingNodeId.value = nodeId
  selectedNodeId.value = nodeId
  pointerStart.value = { x: event.clientX, y: event.clientY }
}

const onPointerMove = (event: MouseEvent) => {
  const dx = event.clientX - pointerStart.value.x
  const dy = event.clientY - pointerStart.value.y

  if (draggingNodeId.value) {
    const current = nodePositions[draggingNodeId.value]
    if (!current) {
      return
    }
    current.x = Math.min(VIEW_WIDTH - 20, Math.max(20, current.x + dx / zoom.value))
    current.y = Math.min(VIEW_HEIGHT - 20, Math.max(20, current.y + dy / zoom.value))
    pointerStart.value = { x: event.clientX, y: event.clientY }
    return
  }

  if (isPanning.value) {
    pan.value = {
      x: pan.value.x + dx,
      y: pan.value.y + dy
    }
    pointerStart.value = { x: event.clientX, y: event.clientY }
  }
}

const stopPointerAction = () => {
  isPanning.value = false
  draggingNodeId.value = ''
}

const onWheelZoom = (event: WheelEvent) => {
  const direction = event.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.min(2.4, Math.max(0.75, Number((zoom.value + direction).toFixed(2))))
}

const resetView = () => {
  zoom.value = 1
  pan.value = { x: 0, y: 0 }
}
</script>

<template>
  <article class="dashboard-panel p-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
        Peta Relasi Ancaman
      </h3>
      <div class="flex items-center gap-2 text-xs">
        <button class="rounded-md border border-slate-700 px-2 py-1 hover:bg-slate-800" @click="zoom = Math.min(2.4, zoom + 0.1)">
          Zoom +
        </button>
        <button class="rounded-md border border-slate-700 px-2 py-1 hover:bg-slate-800" @click="zoom = Math.max(0.75, zoom - 0.1)">
          Zoom -
        </button>
        <button class="rounded-md border border-slate-700 px-2 py-1 hover:bg-slate-800" @click="resetView">
          Reset View
        </button>
      </div>
    </div>

    <div class="mt-3 flex flex-wrap gap-2 text-xs">
      <button
        class="rounded-lg px-2 py-1 font-semibold"
        :class="activeCategory === 'all' ? 'bg-slateBlue text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'"
        @click="activeCategory = 'all'"
      >
        Semua Kategori
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        class="rounded-lg border px-2 py-1 font-semibold"
        :style="{
          borderColor: category.color,
          color: activeCategory === category.id ? '#ffffff' : category.color,
          backgroundColor: activeCategory === category.id ? category.color : 'transparent'
        }"
        @click="activeCategory = category.id"
      >
        {{ category.label }}
      </button>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
      <div class="relative overflow-hidden rounded-2xl border border-cyan-900/60 bg-slate-950 p-2 shadow-[0_0_35px_rgba(8,145,178,0.2)]">
        <svg
          viewBox="0 0 1000 620"
          class="h-[470px] w-full"
          @mousedown="beginPan"
          @mousemove="onPointerMove"
          @mouseup="stopPointerAction"
          @mouseleave="stopPointerAction"
          @wheel.prevent="onWheelZoom"
        >
          <defs>
            <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0f4c81" stroke-opacity="0.22" stroke-width="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="1000" height="620" fill="url(#gridPattern)" />

          <g :transform="`translate(${pan.x} ${pan.y}) scale(${zoom})`">
            <line x1="0" y1="310" x2="1000" y2="310" stroke="#0f4c81" stroke-opacity="0.42" />
            <line x1="500" y1="0" x2="500" y2="620" stroke="#0f4c81" stroke-opacity="0.42" />

            <line
              v-for="edge in visibleEdges"
              :key="edge.id"
              :x1="nodeMap.get(edge.source)?.drawX ?? 0"
              :y1="nodeMap.get(edge.source)?.drawY ?? 0"
              :x2="nodeMap.get(edge.target)?.drawX ?? 0"
              :y2="nodeMap.get(edge.target)?.drawY ?? 0"
              :stroke="edgeIsFocused(edge) ? '#22d3ee' : '#64748b'"
              :stroke-width="edgeIsFocused(edge) ? Math.max(2, edge.strength * 4) : Math.max(1, edge.strength * 3)"
              :stroke-opacity="edgeIsFocused(edge) ? 0.95 : 0.5"
            />

            <g
              v-for="node in visibleNodes"
              :key="node.id"
              class="cursor-pointer"
              @mouseenter="hoveredNodeId = node.id"
              @mouseleave="hoveredNodeId = ''"
              @mousedown.stop="beginNodeDrag(node.id, $event)"
              @click.stop="selectedNodeId = node.id"
            >
              <circle
                :cx="node.drawX"
                :cy="node.drawY"
                :r="selectedNodeId === node.id ? 24 : hoveredNodeId === node.id ? 21 : 18"
                :fill="riskColor(node.threat)"
                :fill-opacity="selectedNodeId === node.id ? 0.42 : hoveredNodeId === node.id ? 0.34 : 0.24"
                :stroke="riskColor(node.threat)"
                :stroke-width="selectedNodeId === node.id ? 3 : 2"
              />
              <text
                :x="node.drawX"
                :y="node.drawY + 40"
                fill="#dbeafe"
                text-anchor="middle"
                font-size="13"
                font-weight="700"
              >
                {{ node.label }}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div class="rounded-2xl border border-cyan-900/50 bg-slate-950/80 p-4 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
        <template v-if="selectedNode">
          <h4 class="text-lg font-semibold text-cyan-200">{{ selectedNode.label }}</h4>
          <p class="mt-1 text-sm text-slate-400">{{ selectedNode.handle || '-' }}</p>
          <p class="mt-3 text-sm text-slate-300">Platform: <strong>{{ selectedNode.platform }}</strong></p>
          <p class="mt-1 text-sm text-slate-300">Threat Level: <strong>{{ selectedNode.threat }}</strong></p>
          <p class="mt-1 text-sm text-slate-300">Followers: <strong>{{ selectedNode.followers || '-' }}</strong></p>
          <p class="mt-3 text-sm text-slate-300">{{ selectedNode.description }}</p>

          <div class="mt-4">
            <h5 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Koneksi ({{ selectedConnections.length }})
            </h5>
            <ul class="mt-2 space-y-2 text-sm">
              <li
                v-for="item in selectedConnections"
                :key="item.edge.id"
                class="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/80 p-2 hover:border-cyan-500"
                @click="selectedNodeId = item.node?.id || selectedNodeId"
              >
                <p class="font-semibold text-slate-100">{{ item.node?.label }}</p>
                <p class="text-xs text-slate-400">{{ item.edge.note }}</p>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>
