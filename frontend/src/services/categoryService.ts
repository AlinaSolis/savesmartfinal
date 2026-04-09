import apiTransactions from './apiTransactions'

export const categoryService = {

  getAllCategories: async () => {
    const res = await apiTransactions.get('/categories')
    return res.data
  },

  getCategoriesByUser: async (userId: number) => {
    const res = await apiTransactions.get(`/categories/user/${userId}`)
    return res.data
  },

  createCategory: async (data: any) => {
    const res = await apiTransactions.post('/categories', data)
    return res.data
  }
}