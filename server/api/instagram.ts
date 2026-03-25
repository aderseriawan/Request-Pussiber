import { fetchInstagramDashboardData } from '~/utils/instagram'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const forceDummy = String(config.useDummyOnly).toLowerCase() === 'true'

  return fetchInstagramDashboardData({
    forceDummy,
    token: config.instagramAccessToken,
    apiBase: config.instagramApiBase,
    businessId: config.instagramBusinessId
  })
})
