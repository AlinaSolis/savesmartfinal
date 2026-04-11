import apiTransactions from './apiTransactions'

export interface Meta {
  id: number
  user_id: number
  nombre: string
  emoji: string
  descripcion?: string
  objetivo: number
  ahorrado: number
  color: string
  created_at?: string
  updated_at?: string
}

export const metasService = {
  getAll: async (userId: number): Promise<Meta[]> => {
    const res = await apiTransactions.get('/metas', { params: { user_id: userId } })
    return res.data
  },

  create: async (data: Omit<Meta, 'id' | 'created_at' | 'updated_at'>): Promise<Meta> => {
    const res = await apiTransactions.post('/metas', data)
    return res.data
  },

  update: async (id: number, data: Omit<Meta, 'id' | 'created_at' | 'updated_at'>): Promise<Meta> => {
    const res = await apiTransactions.put(`/metas/${id}`, data)
    return res.data
  },

  delete: async (id: number, userId: number): Promise<void> => {
    await apiTransactions.delete(`/metas/${id}`, { params: { user_id: userId } })
  },
}
