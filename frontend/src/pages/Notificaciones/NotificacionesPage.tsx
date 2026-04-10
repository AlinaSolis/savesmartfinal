import React from 'react'
import { useEffect, useState } from 'react'
import { Layout, Button, Spin, Modal, message } from 'antd'
import {
  BellOutlined,
  TrophyOutlined,
  WarningOutlined,
  AimOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  CheckOutlined,
  DeleteOutlined,
  SmileOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import Sidebar from '../../components/Layout/Sidebar'
import { notificacionesService } from '../../services/notificacionesService'
import type { Notificacion } from '../../types'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const { Content } = Layout
const { confirm } = Modal

interface NotificacionesPageProps {
  noLeidas: number
  recargar: () => void
}

const iconosPorTipo: Record<string, React.ReactElement> = {
  logro: <TrophyOutlined style={{ color: '#00d4ff', fontSize: 18 }} />,
  alerta: <WarningOutlined style={{ color: '#f59e0b', fontSize: 18 }} />,
  meta: <AimOutlined style={{ color: '#a855f7', fontSize: 18 }} />,
  recordatorio: <ClockCircleOutlined style={{ color: '#8b5cf6', fontSize: 18 }} />,
  racha: <ThunderboltOutlined style={{ color: '#00d4ff', fontSize: 18 }} />,
  analisis: <BarChartOutlined style={{ color: '#10b981', fontSize: 18 }} />,
}

const cfgPorTipo: Record<string, { color: string; bg: string; label: string }> = {
  logro:        { color: '#00d4ff', bg: 'rgba(0,212,255,0.12)',   label: 'Logro' },
  alerta:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Alerta' },
  meta:         { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  label: 'Meta' },
  recordatorio: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', label: 'Recordatorio' },
  racha:        { color: '#00d4ff', bg: 'rgba(0,212,255,0.12)',   label: 'Racha' },
  analisis:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Análisis' },
}

const cfgPorNivel: Record<string, { color: string; bg: string }> = {
  critico:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  regular:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  bueno:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  excelente:{ color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
}

const getNivelFinanciero = (notif: Notificacion): string | null => {
  if (notif.tipo !== 'alerta' && notif.tipo !== 'analisis' && notif.tipo !== 'logro') return null
  const t = notif.titulo.toLowerCase()
  if (t.includes('critica') || t.includes('crítica')) return 'critico'
  if (t.includes('regular')) return 'regular'
  if (t.includes('buena')) return 'bueno'
  if (t.includes('excelente')) return 'excelente'
  return null
}

const tiempoRelativo = (fecha: string) => {
  const diff = Date.now() - new Date(fecha).getTime()
  const mins  = Math.floor(diff / 60000)
  const horas = Math.floor(mins / 60)
  const dias  = Math.floor(horas / 24)
  if (dias  > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
  if (mins  > 0) return `Hace ${mins} min`
  return 'Ahora'
}

export default function NotificacionesPage({ noLeidas, recargar }: NotificacionesPageProps) {
  const { userId } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [filtro, setFiltro]   = useState<'todas' | 'no_leidas'>('todas')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [limpiando, setLimpiando] = useState(false)

  // ── Breakpoint reactivo ──────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Carga ────────────────────────────────────────────────────────────────────
  const cargarNotificaciones = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true)
      const data = await notificacionesService.getNotificaciones(userId!)
      setNotificaciones(data.notificaciones || [])
      setError('')
    } catch (err) {
      setError('Error al cargar notificaciones')
      console.error('Error cargando notificaciones:', err)
    } finally {
      if (!silencioso) setLoading(false)
    }
  }

  useEffect(() => {
    cargarNotificaciones()
    const intervalo = setInterval(() => cargarNotificaciones(true), 10000)
    return () => clearInterval(intervalo)
  }, [])

  // ── Acciones ─────────────────────────────────────────────────────────────────
  const marcarLeida = async (id: number) => {
    try {
      await notificacionesService.marcarLeida(id)
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n))
      recargar()
      message.success('Marcada como leída')
    } catch {
      message.error('Error al marcar como leída')
    }
  }

  const marcarTodasLeidas = async () => {
    try {
      await notificacionesService.marcarTodasLeidas(userId!)
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
      recargar()
      message.success('Todas marcadas como leídas')
    } catch {
      message.error('Error al marcar todas como leídas')
    }
  }

  const limpiarTodas = () => {
    if (notificaciones.length === 0) { message.info('No hay notificaciones para limpiar'); return }
    confirm({
      title: '¿Limpiar todas las notificaciones?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Esta acción eliminará permanentemente todas tus notificaciones.',
      okText: 'Sí, limpiar todo',
      okType: 'danger',
      cancelText: 'Cancelar',
      centered: true,
      onOk: async () => {
        try {
          setLimpiando(true)
          await notificacionesService.limpiarTodas(userId!)
          setNotificaciones([])
          recargar()
          message.success('Todas las notificaciones eliminadas')
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) message.error('Endpoint de limpieza no encontrado')
            else if (err.response?.status === 500) message.error('Error interno del servidor')
            else message.error(`Error ${err.response?.status || 'desconocido'} al limpiar`)
          } else {
            message.error('Error al conectar con el servidor')
          }
        } finally {
          setLimpiando(false)
        }
      },
    })
  }

  const eliminarNotificacion = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    confirm({
      title: '¿Eliminar notificación?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      centered: true,
      onOk: async () => {
        try {
          await notificacionesService.eliminarNotificacion(id)
          setNotificaciones(prev => prev.filter(n => n.id !== id))
          recargar()
          message.success('Notificación eliminada')
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) message.error('La notificación ya no existe')
            else message.error(`Error ${err.response?.status || 'desconocido'} al eliminar`)
          } else {
            message.error('Error al eliminar notificación')
          }
        }
      },
    })
  }

  // ── Derivados ────────────────────────────────────────────────────────────────
  const notificacionesFiltradas = filtro === 'no_leidas'
    ? notificaciones.filter(n => !n.leida)
    : notificaciones

  const noLeidasLocal = notificaciones.filter(n => !n.leida).length

  // ── Padding dinámico ─────────────────────────────────────────────────────────
  const contentPadding = isMobile ? '16px' : isTablet ? '24px' : '32px'

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Sidebar notificacionesNoLeidas={noLeidas} />

      {/* paddingBottom para que la barra inferior del móvil no tape contenido */}
      <Content style={{
        padding: contentPadding,
        background: '#0f1117',
        paddingBottom: isMobile ? '80px' : contentPadding,
      }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: isMobile ? 20 : 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <BellOutlined style={{ fontSize: isMobile ? 22 : 28, color: '#00d4ff' }} />
            <h1 style={{
              color: '#fff',
              fontSize: isMobile ? 22 : 32,
              margin: 0,
              fontWeight: 600,
            }}>
              Notificaciones
            </h1>
          </div>
          <p style={{ color: '#888', fontSize: isMobile ? 13 : 16, margin: 0 }}>
            Tienes{' '}
            <span style={{ color: '#00d4ff', fontWeight: 600 }}>{noLeidasLocal}</span>{' '}
            notificaciones sin leer
          </p>
        </div>

        {/* ── Filtros + Acciones ──────────────────────────────────────────────── */}

        {/* DESKTOP: todo en una sola fila dentro del recuadro */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            background: '#1a1f35',
            borderRadius: 12,
            padding: '8px 12px',
            border: '1px solid #1f2235',
            gap: 12,
          }}>
            {/* Filtros izquierda */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(['todas', 'no_leidas'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    background: filtro === f ? '#00d4ff15' : 'transparent',
                    color: filtro === f ? '#00d4ff' : '#666',
                    borderBottom: filtro === f ? '2px solid #00d4ff' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {f === 'todas' ? `Todas (${notificaciones.length})` : (
                    <>
                      Sin leer
                      {noLeidasLocal > 0 && (
                        <span style={{
                          background: '#00d4ff', color: '#000',
                          fontSize: 11, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 20,
                        }}>
                          {noLeidasLocal}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Acciones derecha */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={marcarTodasLeidas}
                disabled={noLeidasLocal === 0 || limpiando}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 10,
                  border: noLeidasLocal === 0 ? '1px solid #1f2235' : '1px solid #10b98150',
                  background: noLeidasLocal === 0 ? 'transparent' : 'rgba(16,185,129,0.1)',
                  color: noLeidasLocal === 0 ? '#444' : '#10b981',
                  fontSize: 13, fontWeight: 500,
                  cursor: noLeidasLocal === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: noLeidasLocal === 0 ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                <CheckOutlined style={{ fontSize: 13 }} />
                Marcar todas como leídas
              </button>
              <button
                onClick={limpiarTodas}
                disabled={notificaciones.length === 0 || limpiando}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 10,
                  border: notificaciones.length === 0 ? '1px solid #1f2235' : '1px solid #ff4d4f50',
                  background: notificaciones.length === 0 ? 'transparent' : 'rgba(255,77,79,0.1)',
                  color: notificaciones.length === 0 ? '#444' : '#ff4d4f',
                  fontSize: 13, fontWeight: 500,
                  cursor: notificaciones.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: notificaciones.length === 0 ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                <DeleteOutlined style={{ fontSize: 13 }} />
                Limpiar todas
              </button>
            </div>
          </div>
        )}

        {/* MÓVIL: filtros arriba en recuadro, acciones abajo en fila separada */}
        {isMobile && (
          <>
            <div style={{
              display: 'flex',
              marginBottom: 10,
              background: '#1a1f35',
              borderRadius: 12,
              padding: '6px',
              border: '1px solid #1f2235',
              gap: 6,
            }}>
              {(['todas', 'no_leidas'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    background: filtro === f ? '#00d4ff15' : 'transparent',
                    color: filtro === f ? '#00d4ff' : '#666',
                    borderBottom: filtro === f ? '2px solid #00d4ff' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {f === 'todas' ? `Todas (${notificaciones.length})` : (
                    <>
                      Sin leer
                      {noLeidasLocal > 0 && (
                        <span style={{
                          background: '#00d4ff', color: '#000',
                          fontSize: 11, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 20,
                        }}>
                          {noLeidasLocal}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                onClick={marcarTodasLeidas}
                disabled={noLeidasLocal === 0 || limpiando}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '11px 8px', borderRadius: 10,
                  border: noLeidasLocal === 0 ? '1px solid #1f2235' : '1px solid #10b98150',
                  background: noLeidasLocal === 0 ? 'transparent' : 'rgba(16,185,129,0.1)',
                  color: noLeidasLocal === 0 ? '#444' : '#10b981',
                  fontSize: 13, fontWeight: 500,
                  cursor: noLeidasLocal === 0 ? 'not-allowed' : 'pointer',
                  opacity: noLeidasLocal === 0 ? 0.5 : 1,
                }}
              >
                <CheckOutlined style={{ fontSize: 13 }} />
                Marcar todas leídas
              </button>
              <button
                onClick={limpiarTodas}
                disabled={notificaciones.length === 0 || limpiando}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '11px 8px', borderRadius: 10,
                  border: notificaciones.length === 0 ? '1px solid #1f2235' : '1px solid #ff4d4f50',
                  background: notificaciones.length === 0 ? 'transparent' : 'rgba(255,77,79,0.1)',
                  color: notificaciones.length === 0 ? '#444' : '#ff4d4f',
                  fontSize: 13, fontWeight: 500,
                  cursor: notificaciones.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: notificaciones.length === 0 ? 0.5 : 1,
                }}
              >
                <DeleteOutlined style={{ fontSize: 13 }} />
                Limpiar todas
              </button>
            </div>
          </>
        )}

        {/* ── Spinner ─────────────────────────────────────────────────────────── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            background: '#1a0f0f',
            border: '1px solid #ef444440',
            borderRadius: 16,
            padding: isMobile ? '16px' : '24px 28px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 12 : 20,
          }}>
            <div style={{
              width: isMobile ? 40 : 52, height: isMobile ? 40 : 52,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              border: '2px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="#ef4444" width={isMobile ? 20 : 26} height={isMobile ? 20 : 26}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#ef4444', fontWeight: 700, fontSize: isMobile ? 13 : 15, margin: '0 0 4px' }}>
                Error de conexión
              </p>
              <p style={{ color: '#6b7280', fontSize: isMobile ? 12 : 13, margin: 0 }}>{error}</p>
            </div>
            <button
              onClick={() => cargarNotificaciones()}
              style={{
                padding: isMobile ? '6px 12px' : '8px 18px',
                borderRadius: 10,
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                fontSize: isMobile ? 12 : 13,
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* ── Lista ───────────────────────────────────────────────────────────── */}
        {!loading && (
          <>
            {notificacionesFiltradas.length > 0 ? (
              notificacionesFiltradas.map(notif => {
                const nivel   = getNivelFinanciero(notif)
                const cfgBase = cfgPorTipo[notif.tipo] ?? { color: '#888', bg: 'rgba(136,136,136,0.1)', label: notif.tipo }

                const labelPorNivel: Record<string, string> = {
                  critico:  'Análisis · Alerta',
                  regular:  'Análisis · Regular',
                  bueno:    'Análisis · Logro',
                  excelente:'Análisis · Logro',
                }

                const cfg = nivel
                  ? { ...cfgBase, color: cfgPorNivel[nivel].color, bg: cfgPorNivel[nivel].bg, label: labelPorNivel[nivel] }
                  : cfgBase

                const tituloLimpio = notif.titulo
                  .replace(/[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\uFE0F/gu, '')
                  .trim()

                return (
                  <div
                    key={notif.id}
                    style={{
                      display: 'flex',
                      borderRadius: 14,
                      border: notif.leida ? '1px solid #1f2235' : '1px solid #2a3a5c',
                      background: notif.leida ? '#0f1117' : '#1a1f35',
                      overflow: 'hidden',
                      marginBottom: 10,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Borde izquierdo */}
                    <div style={{
                      width: 4, flexShrink: 0,
                      background: notif.leida ? 'transparent' : cfg.color,
                    }} />

                    {/* Cuerpo */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 10 : 14,
                      alignItems: isMobile ? 'stretch' : 'flex-start',
                      padding: isMobile ? '12px' : '14px 16px',
                    }}>

                      {/* Fila superior en móvil: ícono + título + tiempo */}
                      <div style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        flex: 1,
                      }}>
                        {/* Ícono */}
                        <div style={{
                          width: isMobile ? 34 : 40,
                          height: isMobile ? 34 : 40,
                          borderRadius: '50%',
                          background: cfg.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          border: !notif.leida ? `1px solid ${cfg.color}30` : 'none',
                        }}>
                          {React.cloneElement(
                            iconosPorTipo[notif.tipo] ?? <BellOutlined />,
                            { style: { color: cfg.color, fontSize: isMobile ? 15 : 18 } } as React.HTMLAttributes<HTMLElement>
                          )}
                        </div>

                        {/* Texto */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: 6, flexWrap: 'wrap', marginBottom: 3,
                          }}>
                            {!notif.leida && (
                              <div style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: cfg.color, flexShrink: 0,
                              }} />
                            )}
                            <span style={{
                              color: '#fff',
                              fontSize: isMobile ? 13 : 15,
                              fontWeight: notif.leida ? 400 : 600,
                              lineHeight: 1.3,
                            }}>
                              {tituloLimpio}
                            </span>
                            <span style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 99,
                              background: cfg.bg, color: cfg.color,
                              fontWeight: 400, letterSpacing: '0.02em', flexShrink: 0,
                            }}>
                              {cfg.label}
                            </span>
                          </div>

                          <p style={{
                            color: '#aaa', margin: 0,
                            fontSize: isMobile ? 12 : 13,
                            lineHeight: 1.45,
                            // En móvil mostramos 2 líneas; en desktop 1
                            display: '-webkit-box',
                            WebkitLineClamp: isMobile ? 2 : 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          } as React.CSSProperties}>
                            {notif.mensaje}
                          </p>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        alignItems: isMobile ? 'center' : 'flex-end',
                        justifyContent: isMobile ? 'space-between' : 'space-between',
                        gap: 8,
                        flexShrink: 0,
                        paddingTop: isMobile ? 4 : 0,
                        borderTop: isMobile ? '1px solid #1f2235' : 'none',
                        marginTop: isMobile ? 2 : 0,
                      }}>
                        <span style={{ color: '#555', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {tiempoRelativo(notif.created_at)}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {!notif.leida && (
                            <button
                              onClick={() => marcarLeida(notif.id)}
                              style={{
                                fontSize: isMobile ? 11 : 13,
                                padding: isMobile ? '5px 10px' : '7px 16px',
                                borderRadius: 99,
                                border: '1px solid #2a3a5c',
                                background: 'transparent',
                                color: '#ccc',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s',
                                fontWeight: 500,
                                display: 'flex', alignItems: 'center', gap: 4,
                                height: isMobile ? 28 : 34,
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(16,185,129,0.15)'
                                e.currentTarget.style.color = '#10b981'
                                e.currentTarget.style.borderColor = '#10b98150'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = '#ccc'
                                e.currentTarget.style.borderColor = '#2a3a5c'
                              }}
                            >
                              <CheckOutlined style={{ fontSize: isMobile ? 10 : 12 }} />
                              Marcar como leída
                            </button>
                          )}

                          <button
                            onClick={(e) => eliminarNotificacion(notif.id, e)}
                            style={{
                              width: isMobile ? 28 : 34,
                              height: isMobile ? 28 : 34,
                              borderRadius: 99,
                              border: '1px solid #2a3a5c',
                              background: 'transparent',
                              color: '#ff4d4f',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              opacity: 0.5,
                              transition: 'all 0.15s',
                              flexShrink: 0,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.opacity = '1'
                              e.currentTarget.style.background = 'rgba(255,77,79,0.12)'
                              e.currentTarget.style.borderColor = '#ff4d4f50'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.opacity = '0.5'
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.borderColor = '#2a3a5c'
                            }}
                          >
                            <DeleteOutlined style={{ fontSize: isMobile ? 12 : 14 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{
                background: '#1a1f35',
                border: '1px solid #1f2235',
                textAlign: 'center',
                padding: isMobile ? '32px 16px' : '48px 24px',
                borderRadius: 16,
              }}>
                {filtro === 'no_leidas' ? (
                  <>
                    <div style={{
                      width: isMobile ? 60 : 80, height: isMobile ? 60 : 80,
                      borderRadius: '50%', background: '#00d4ff10',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '2px solid #00d4ff30',
                    }}>
                      <SmileOutlined style={{ fontSize: isMobile ? 28 : 40, color: '#00d4ff' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: isMobile ? 18 : 24, margin: '0 0 8px', fontWeight: 600 }}>
                      ¡Todo al día!
                    </h2>
                    <p style={{ color: '#aaa', fontSize: isMobile ? 13 : 16, margin: '0 0 20px' }}>
                      No tienes notificaciones pendientes por leer.
                    </p>
                    <Button
                      onClick={() => setFiltro('todas')}
                      style={{ background: 'transparent', border: '1px solid #00d4ff', color: '#00d4ff' }}
                    >
                      Ver todas
                    </Button>
                  </>
                ) : (
                  <>
                    <BellOutlined style={{ fontSize: isMobile ? 36 : 48, color: '#333', marginBottom: 12 }} />
                    <p style={{ color: '#666', fontSize: isMobile ? 13 : 16, margin: 0 }}>
                      No hay notificaciones
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </Content>
    </Layout>
  )
}