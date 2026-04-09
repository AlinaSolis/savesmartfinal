import apiTransactions from './apiTransactions'

export const transactionService = {
  getAllTransactions: async () => {
    const res = await apiTransactions.get('/transactions')
    return res.data
  },

  createTransaction: async (data: any) => {
    const res = await apiTransactions.post('/transactions', data)
    return res.data
  }
}