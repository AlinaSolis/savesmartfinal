import apiNotifications from './apiNotifications'
import type { NotificacionesResponse } from '../types'

export const notificacionesService = {
  getNotificaciones: async (userId: number): Promise<NotificacionesResponse> => {
    const res = await apiNotifications.get(`/notificaciones/${userId}`)
    return res.data
  },

  marcarLeida: async (id: number) => {
    const res = await apiNotifications.patch(`/notificaciones/${id}/leer`)
    return res.data
  },

  marcarTodasLeidas: async (userId: number) => {
    const res = await apiNotifications.patch(`/notificaciones/${userId}/leer-todas`)
    return res.data
  },

  limpiarTodas: async (userId: number) => {
    const res = await apiNotifications.delete(`/notificaciones/${userId}/limpiar`)
    return res.data
  },

  eliminarNotificacion: async (id: number) => {
    const res = await apiNotifications.delete(`/notificaciones/${id}`)
    return res.data
  }
}