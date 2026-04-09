import apiBadges from './apiBadges'

export const badgesService = {
  getAllBadges: async () => {
    const res = await apiBadges.get('/badges')
    return res.data
  },

  getUserBadges: async () => {
    const res = await apiBadges.get('/user/badges')
    return res.data
  },

  getBadgeById: async (id: number) => {
    const res = await apiBadges.get(`/badges/${id}`)
    return res.data
  }
}