import apiAnalysis from './apiAnalysis'
import type { AnalisisFinanciero, ConsejoIa } from '../types'

export const analisisService = {
  getAnalisis: async (userId: number): Promise<AnalisisFinanciero> => {
    const res = await apiAnalysis.get(`/analisis/${userId}`)
    return res.data
  },

  crearAnalisis: async (data: Partial<AnalisisFinanciero>) => {
    const res = await apiAnalysis.post('/analisis', data)
    return res.data
  },

  getConsejos: async (userId: number): Promise<ConsejoIa[]> => {
    const res = await apiAnalysis.get(`/consejos/${userId}`)
    return res.data
  },

  getHistorial: async (userId: number) => {
    const res = await apiAnalysis.get(`/historial/${userId}`)
    return res.data
  },
}