import axios from 'axios'
import type { NotificacionesResponse } from '../types'

const API = import.meta.env.VITE_NOTIFICATION_API

export const notificacionesService = {
  getNotificaciones: async (userId: number): Promise<NotificacionesResponse> => {
    const res = await axios.get(`${API}/notificaciones/${userId}`)
    return res.data
  },

  marcarLeida: async (id: number) => {
    const res = await axios.patch(`${API}/notificaciones/${id}/leer`)
    return res.data
  },

  marcarTodasLeidas: async (userId: number) => {
    const res = await axios.patch(`${API}/notificaciones/${userId}/leer-todas`)
    return res.data
  },

  // Limpiar/Eliminar todas las notificaciones
  limpiarTodas: async (userId: number) => {
    console.log('Intentando limpiar notificaciones para userId:', userId)
    console.log('URL:', `${API}/notificaciones/${userId}/limpiar`)
    
    try {
      const res = await axios.delete(`${API}/notificaciones/${userId}/limpiar`)
      console.log('Respuesta de limpiar:', res.data)
      return res.data
    } catch (error) {
      console.error('Error detallado en limpiarTodas:', error)
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status)
        console.error('Data:', error.response?.data)
        console.error('Headers:', error.response?.headers)
      }
      throw error
    }
  },

  // Eliminar una notificación específica
  eliminarNotificacion: async (id: number) => {
    console.log('Intentando eliminar notificación id:', id)
    console.log('URL:', `${API}/notificaciones/${id}`)
    
    try {
      const res = await axios.delete(`${API}/notificaciones/${id}`)
      console.log('Respuesta de eliminar:', res.data)
      return res.data
    } catch (error) {
      console.error('Error detallado en eliminarNotificacion:', error)
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status)
        console.error('Data:', error.response?.data)
      }
      throw error
    }
  }
}