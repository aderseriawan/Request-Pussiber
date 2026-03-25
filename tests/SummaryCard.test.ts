import { render, screen } from '@testing-library/vue'
import SummaryCard from '../components/SummaryCard.vue'

describe('SummaryCard', () => {
  it('renders title and value', () => {
    render(SummaryCard, {
      props: {
        title: 'Total Ancaman',
        value: 42,
        icon: 'TH',
        color: '#dc2626'
      }
    })

    expect(screen.getByText('Total Ancaman')).toBeTruthy()
    expect(screen.getByText('42')).toBeTruthy()
    expect(screen.getByText('TH')).toBeTruthy()
  })
})
