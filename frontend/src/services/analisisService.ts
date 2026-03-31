import axios from 'axios'
import type { AnalisisFinanciero, ConsejoIa, AlertaGasto } from '../types'

const API = import.meta.env.VITE_ANALYSIS_API

export const analisisService = {
  getAnalisis: async (userId: number): Promise<AnalisisFinanciero> => {
    const res = await axios.get(`${API}/analisis/${userId}`)
    return res.data
  },

  crearAnalisis: async (data: Partial<AnalisisFinanciero>) => {
    const res = await axios.post(`${API}/analisis`, data)
    return res.data
  },

  getConsejos: async (userId: number): Promise<ConsejoIa[]> => {
    const res = await axios.get(`${API}/consejos/${userId}`)
    return res.data
  },

  getHistorial: async (userId: number) => {
    const res = await axios.get(`${API}/historial/${userId}`)
    return res.data
},
}