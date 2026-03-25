import { render, screen } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

vi.mock('vue-chartjs', () => ({
  Doughnut: defineComponent({
    name: 'MockDoughnut',
    setup() {
      return () => h('div', { 'data-testid': 'doughnut-chart' })
    }
  })
}))

import ThreatDonutChart from '../components/ThreatDonutChart.vue'

describe('ThreatDonutChart', () => {
  it('renders threat labels and percentages', () => {
    render(ThreatDonutChart, {
      props: {
        title: 'Persentase Ancaman',
        data: [
          { label: 'High', value: 6, color: '#dc2626' },
          { label: 'Medium', value: 3, color: '#ea580c' },
          { label: 'Low', value: 1, color: '#16a34a' }
        ]
      }
    })

    expect(screen.getByText('Persentase Ancaman')).toBeTruthy()
    expect(screen.getByText('High')).toBeTruthy()
    expect(screen.getByText('60.0%')).toBeTruthy()
    expect(screen.getByTestId('doughnut-chart')).toBeTruthy()
  })
})
