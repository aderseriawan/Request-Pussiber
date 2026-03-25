import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'

let chartRegistered = false

export default defineNuxtPlugin(() => {
  if (!chartRegistered) {
    ChartJS.register(
      ArcElement,
      BarElement,
      CategoryScale,
      Filler,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      Title,
      Tooltip
    )
    chartRegistered = true
  }
})
