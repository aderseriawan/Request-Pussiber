<script setup lang="ts">
const threatStore = useThreatStore()

const sidebarOpen = ref(false)
const isDark = useState('theme-dark', () => true)

watch(isDark, (value) => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', value)
  }
})

onMounted(() => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})
</script>

<template>
  <div class="min-h-screen pb-6 text-slate-100">
    <header class="sticky top-0 z-30 border-b border-cyan-900/40 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div class="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button
            class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold md:hidden dark:border-slate-700"
            @click="sidebarOpen = !sidebarOpen"
          >
            MENU
          </button>
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-cyan-300/80">PUSSIBERAD</p>
            <h1 class="cyber-title text-sm font-bold sm:text-base">Dashboard Monitoring Media Sosial</h1>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs">
          <span class="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 font-semibold text-red-200">
            THREAT LEVEL: HIGH
          </span>
          <button
            class="rounded-lg border border-cyan-700/40 bg-slate-900/70 px-3 py-1 font-semibold text-cyan-200"
            @click="isDark = !isDark"
          >
            {{ isDark ? 'Light' : 'Dark' }}
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto mt-4 grid max-w-[1440px] grid-cols-1 gap-4 px-4 md:grid-cols-[320px_minmax(0,1fr)]">
      <div class="fixed inset-0 z-20 bg-slate-950/50 md:hidden" :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false" />

      <div
        class="z-30 md:static"
        :class="sidebarOpen ? 'fixed left-4 right-4 top-20 block' : 'hidden md:block'"
      >
        <Sidebar
          :accounts="threatStore.filteredAccounts"
          :active-filter="threatStore.activeFilter"
          @update:filter="threatStore.setFilter"
        />
      </div>

      <main class="space-y-4">
        <slot />
      </main>
    </div>
  </div>
</template>
