import { useState, useEffect, useRef } from 'react'
import { notification } from 'antd'
import { notificacionesService } from '../services/notificacionesService'
import { authService } from '../services/authService'

// Mismo mapeo que NotificacionesPage
const cfgPorNivel: Record<string, { color: string; glow: string }> = {
  critico:   { color: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
  regular:   { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  bueno:     { color: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
  excelente: { color: '#22c55e', glow: 'rgba(34,197,94,0.25)' },
}

const cfgPorTipo: Record<string, { color: string; glow: string }> = {
  logro:        { color: '#00d4ff', glow: 'rgba(0,212,255,0.25)' },
  alerta:       { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  meta:         { color: '#a855f7', glow: 'rgba(168,85,247,0.25)' },
  recordatorio: { color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },
  racha:        { color: '#00d4ff', glow: 'rgba(0,212,255,0.25)' },
  analisis:     { color: '#10b981', glow: 'rgba(16,185,129,0.25)' },
}

function getNotifColor(titulo: string, tipo: string): { color: string; glow: string } {
  const t = titulo.toLowerCase()
  if (t.includes('critica') || t.includes('crítica')) return cfgPorNivel.critico
  if (t.includes('regular'))                           return cfgPorNivel.regular
  if (t.includes('buena'))                             return cfgPorNivel.bueno
  if (t.includes('excelente'))                         return cfgPorNivel.excelente
  return cfgPorTipo[tipo] ?? { color: '#3b82f6', glow: 'rgba(59,130,246,0.25)' }
}

function limpiarTitulo(titulo: string): string {
  return titulo.replace(/[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\uFE0F/gu, '').trim()
}

export function useNotificaciones() {
  const [noLeidas, setNoLeidas] = useState<number>(0)
  const prevNoLeidas = useRef<number>(0)
  const primeraVez = useRef<boolean>(true)

  const cargar = async () => {
    const userId = authService.getUser()?.id
    if (!userId) return
    try {
      const data = await notificacionesService.getNotificaciones(userId)
      const nuevas = data.notificaciones.filter(n => !n.leida).length

      const ultima = data.notificaciones[0]

      if (!primeraVez.current && nuevas > prevNoLeidas.current) {
        const titulo = ultima?.titulo ?? 'Nueva notificación'
        const tipo   = ultima?.tipo   ?? 'analisis'
        const { color, glow } = getNotifColor(titulo, tipo)
        const tituloLimpio = limpiarTitulo(titulo)

        notification.open({
          message: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Ícono con color dinámico */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${color}99, ${color})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${glow}`,
                flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.8} stroke="white" width={22} height={22}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
                  {tituloLimpio}
                </span>
                <span style={{ color, fontSize: 12, fontWeight: 500 }}>
                  Toca para ver → Notificaciones
                </span>
              </div>
            </div>
          ),
          description: null,
          icon: null,
          placement: 'topRight',
          duration: 4,
          closable: false,
          className: 'notif-toast',
          onClick: () => window.location.href = '/notificaciones',
          style: {
            background: 'linear-gradient(135deg, #0a1628 0%, #0f1e3a 100%)',
            border: '1.5px solid transparent',
            borderRadius: 14,
            backgroundClip: 'padding-box',
            boxShadow: `0 0 0 1.5px ${color}, 0 0 24px ${glow}, 0 8px 32px rgba(0,0,0,0.4)`,
            padding: '14px 20px',
            cursor: 'pointer',
          },
        })
      }

      primeraVez.current = false
      prevNoLeidas.current = nuevas
      setNoLeidas(nuevas)
    } catch (e) {}
  }

  useEffect(() => {
    cargar()
    const interval = setInterval(cargar, 5000)
    return () => clearInterval(interval)
  }, [])

  return { noLeidas, recargar: cargar }
}