// Tipos para Analysis Service
export interface AnalisisFinanciero {
  id: number
  user_id: number
  total_ingresos: number
  total_gastos: number
  balance: number
  tasa_ahorro: number
  uso_presupuesto: number
  consistencia: number
  nivel_riesgo: 'bajo' | 'medio' | 'alto'
  puntuacion_salud: number
  nivel_color: 'critico' | 'regular' | 'bueno' | 'excelente'
  consejos: ConsejoIa[]
}

export interface ConsejoIa {
  id: number
  user_id: number
  analisis_id: number
  tipo: 'logro' | 'alerta' | 'consejo' | 'meta'
  titulo: string
  descripcion: string
  created_at: string
}


// Tipos para Notification Service

export interface Notificacion {
  id: number
  usuario_id: number
  tipo: 'logro' | 'alerta' | 'meta' | 'recordatorio' | 'racha' | 'analisis'
  titulo: string
  mensaje: string
  leida: boolean
  created_at: string
  updated_at: string
}

export interface NotificacionesResponse {
  notificaciones: Notificacion[]
  total: number
  noLeidas: number
}

// Historial mensual
export interface AnalisisHistorial {
  id: number
  user_id: number
  periodo_mes: string
  total_ingresos: number
  total_gastos: number
  balance: number
  tasa_ahorro: number
  uso_presupuesto: number
  consistencia: number
  nivel_riesgo: 'bajo' | 'medio' | 'alto'
  puntuacion_salud: number
  nivel_color: 'critico' | 'regular' | 'bueno' | 'excelente'
}

export interface HistorialResponse {
  historial: AnalisisHistorial[]
  total: number
}