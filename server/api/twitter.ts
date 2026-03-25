import { fetchTwitterDashboardData } from '~/utils/twitter'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const forceDummy = String(config.useDummyOnly).toLowerCase() === 'true'

  return fetchTwitterDashboardData({
    forceDummy,
    token: config.xBearerToken,
    apiBase: config.xApiBase
  })
})
