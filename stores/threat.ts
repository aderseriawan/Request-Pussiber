import type { ThreatFilter, WatchAccount } from '~/utils/types'

const DEFAULT_ACCOUNTS: WatchAccount[] = [
  { handle: '@dandhy_laksono', platform: 'twitter', followers: 650000, status: 'critical' },
  { handle: '@AlissaWahid', platform: 'twitter', followers: 420000, status: 'activist' },
  { handle: '@pandji', platform: 'twitter', followers: 1800000, status: 'critical' },
  { handle: '@BivitriS', platform: 'twitter', followers: 290000, status: 'activist' },
  { handle: '@niwseir', platform: 'instagram', followers: 210000, status: 'critical' },
  { handle: '@safenetvoice', platform: 'instagram', followers: 198000, status: 'observer' },
  { handle: '@logos_id', platform: 'instagram', followers: 117000, status: 'observer' }
]

export const useThreatStore = defineStore('threat-store', {
  state: () => ({
    accounts: DEFAULT_ACCOUNTS,
    activeFilter: 'all' as ThreatFilter
  }),
  getters: {
    filteredAccounts: (state) => {
      if (state.activeFilter === 'all') {
        return state.accounts
      }

      return state.accounts.filter((account) => account.status === state.activeFilter)
    }
  },
  actions: {
    setFilter(nextFilter: ThreatFilter) {
      this.activeFilter = nextFilter
    }
  }
})
