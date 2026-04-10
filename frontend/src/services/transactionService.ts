import apiTransactions from './apiTransactions'

export const transactionService = {
  getAllTransactions: async (userId: number) => {
    const res = await apiTransactions.get('/transactions', { params: { user_id: userId } })
    return res.data
  },

  createTransaction: async (data: any) => {
    const res = await apiTransactions.post('/transactions', data)
    return res.data
  }
}