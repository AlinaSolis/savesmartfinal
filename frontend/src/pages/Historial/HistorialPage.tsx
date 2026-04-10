import { useEffect, useState } from 'react'
import { Layout, Spin, Card } from 'antd'
import Sidebar from '../../components/Layout/Sidebar'
import { analisisService } from '../../services/analisisService'
import type { AnalisisHistorial } from '../../types'
import { useAuth } from '../../context/AuthContext'

const { Content } = Layout

interface HistorialPageProps {
  noLeidas: number
  recargar: () => void
}

const nivelConfig = {
  excelente: { color: '#10b981', label: 'Excelente', bg: 'rgba(16,185,129,0.15)' },
  bueno:     { color: '#3b82f6', label: 'Bueno',     bg: 'rgba(59,130,246,0.15)' },
  regular:   { color: '#f59e0b', label: 'Regular',   bg: 'rgba(245,158,11,0.15)' },
  critico:   { color: '#ef4444', label: 'Critico',   bg: 'rgba(239,68,68,0.15)'  },
}

const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function HistorialPage({ noLeidas }: HistorialPageProps) {
  const { userId } = useAuth()
  const [historial, setHistorial]   = useState<AnalisisHistorial[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [anioActual, setAnioActual] = useState(new Date().getFullYear())

  // ── Breakpoints reactivos ──────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const isMobile = windowWidth < 640
  const isTablet = windowWidth < 1024

  useEffect(() => {
    cargarHistorial()
    const intervalo = setInterval(() => cargarHistorial(true), 10000)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(intervalo)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const cargarHistorial = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true)
      const data = await analisisService.getHistorial(userId!)
      setHistorial(data.historial || [])
    } catch {
      setError('Error al cargar el historial')
    } finally {
      if (!silencioso) setLoading(false)
    }
  }

  const aniosDisponibles = [...new Set(historial.map(h => parseInt(h.periodo_mes.split('-')[0])))].sort()
  const anioMin  = aniosDisponibles[0] ?? anioActual
  const anioMax  = aniosDisponibles[aniosDisponibles.length - 1] ?? anioActual
  const datosMes = historial.filter(h => h.periodo_mes.startsWith(String(anioActual)))

  const W = 900, H = 220, padL = 48, padR = 110, padT = 24, padB = 40
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const puntos = datosMes.map((item, i) => ({
    x: padL + (i / (Math.max(datosMes.length - 1, 1))) * innerW,
    y: padT + innerH - (item.puntuacion_salud / 100) * innerH,
    item,
  }))

  const pathD = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = puntos.length > 0
    ? `${pathD} L ${puntos[puntos.length - 1].x} ${padT + innerH} L ${puntos[0].x} ${padT + innerH} Z`
    : ''

  const guias = [0, 50, 70, 85, 100]
  const nivelInfo: Record<number, { label: string; color: string }> = {
    50: { label: 'Regular',   color: '#f59e0b' },
    70: { label: 'Bueno',     color: '#3b82f6' },
    85: { label: 'Excelente', color: '#10b981' },
  }

  const leyenda = [
    { label: 'Crítico',   color: '#ef4444', rango: '< 50'   },
    { label: 'Regular',   color: '#f59e0b', rango: '50–69'  },
    { label: 'Bueno',     color: '#3b82f6', rango: '70–84'  },
    { label: 'Excelente', color: '#10b981', rango: '85–100' },
  ]

  const contentPadding = isMobile ? '16px' : isTablet ? '24px 28px' : '32px 40px'

  return (
    <Layout style={{ minHeight: '100vh', background: '#0a0d14' }}>
      <Sidebar notificacionesNoLeidas={noLeidas} />
      <Layout style={{ background: '#0a0d14' }}>
        <Content style={{
          padding: contentPadding,
          background: '#0a0d14',
          paddingBottom: isMobile ? '80px' : (isTablet ? '28px' : '40px'),
        }}>

          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 12 : 0,
            marginBottom: isMobile ? 20 : 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16 }}>
              <div style={{
                width: isMobile ? 42 : 52,
                height: isMobile ? 42 : 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #00d4ff, #0891b2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)',
                flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="white"
                  width={isMobile ? 26 : 34} height={isMobile ? 26 : 34}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
              </div>
              <div>
                <h1 style={{ color: '#fff', margin: 0, fontSize: isMobile ? 20 : 28, fontWeight: 700 }}>
                  Historial de Evolución
                </h1>
                <p style={{ color: '#555', margin: 0, fontSize: isMobile ? 12 : 14 }}>
                  Tu progreso financiero mes a mes
                </p>
              </div>
            </div>

            {/* Botón volver — ancho completo en móvil */}
            <a href="/analisis" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: isMobile ? '10px 16px' : '10px 20px',
              borderRadius: 12,
              background: 'rgba(39,39,42,0.5)',
              border: '1px solid rgba(63,63,70,0.5)',
              color: '#a1a1aa', textDecoration: 'none',
              fontSize: isMobile ? 13 : 14,
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
            }}>
              ← Volver a Análisis
            </a>
          </div>

          {/* ── Spinner ──────────────────────────────────────────────────────── */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────────────────── */}
          {error && (
            <div style={{
              background: '#1a0f0f', border: '1px solid #ef444440',
              borderRadius: 16, padding: isMobile ? '16px' : '24px 28px',
              marginBottom: 24, display: 'flex', alignItems: 'center',
              gap: isMobile ? 12 : 20,
            }}>
              <div style={{
                width: isMobile ? 40 : 52, height: isMobile ? 40 : 52,
                borderRadius: '50%', background: 'rgba(239,68,68,0.12)',
                border: '2px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="#ef4444"
                  width={isMobile ? 20 : 26} height={isMobile ? 20 : 26}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ef4444', fontWeight: 700, fontSize: isMobile ? 13 : 15, margin: '0 0 4px' }}>
                  Error de conexión
                </p>
                <p style={{ color: '#6b7280', fontSize: isMobile ? 12 : 13, margin: 0 }}>{error}</p>
              </div>
              <button onClick={() => cargarHistorial()} style={{
                padding: isMobile ? '6px 12px' : '8px 18px', borderRadius: 10,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: isMobile ? 12 : 13, fontWeight: 600,
                cursor: 'pointer', flexShrink: 0,
              }}>
                Reintentar
              </button>
            </div>
          )}

          {/* ── Contenido ────────────────────────────────────────────────────── */}
          {!loading && historial.length > 0 && (
            <>
              {/* Navegación por año */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: isMobile ? 16 : 24, marginBottom: isMobile ? 16 : 24,
              }}>
                <button
                  onClick={() => setAnioActual(a => a - 1)}
                  disabled={anioActual <= anioMin}
                  style={{
                    width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
                    borderRadius: 10,
                    background: anioActual <= anioMin ? '#1a1f35' : 'rgba(0,212,255,0.15)',
                    border: `1px solid ${anioActual <= anioMin ? '#1f2235' : '#00d4ff40'}`,
                    color: anioActual <= anioMin ? '#444' : '#00d4ff',
                    fontSize: 18, cursor: anioActual <= anioMin ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >‹</button>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: '#fff', fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>
                    {anioActual}
                  </span>
                  <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>
                    {datosMes.length} mes{datosMes.length !== 1 ? 'es' : ''} registrado{datosMes.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <button
                  onClick={() => setAnioActual(a => a + 1)}
                  disabled={anioActual >= anioMax}
                  style={{
                    width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
                    borderRadius: 10,
                    background: anioActual >= anioMax ? '#1a1f35' : 'rgba(0,212,255,0.15)',
                    border: `1px solid ${anioActual >= anioMax ? '#1f2235' : '#00d4ff40'}`,
                    color: anioActual >= anioMax ? '#444' : '#00d4ff',
                    fontSize: 18, cursor: anioActual >= anioMax ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >›</button>
              </div>

              {/* ── Gráfica ────────────────────────────────────────────────────── */}
              <div style={{
                background: '#0f1117', border: '1px solid #1e2440',
                borderRadius: 20,
                padding: isMobile ? '16px' : '32px',
                marginBottom: isMobile ? 16 : 24,
              }}>
                <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: isMobile ? 15 : 18, fontWeight: 700 }}>
                  ✦ Puntuación de Salud — {anioActual}
                </h2>

                {/* Leyenda */}
                <div style={{
                  display: 'flex', gap: isMobile ? 10 : 16,
                  marginBottom: isMobile ? 16 : 24,
                  flexWrap: 'wrap',
                }}>
                  {leyenda.map(n => (
                    <div key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color }} />
                      <span style={{ color: n.color, fontSize: isMobile ? 11 : 12, fontWeight: 500 }}>{n.label}</span>
                      <span style={{ color: '#555', fontSize: isMobile ? 10 : 11 }}>{n.rango}</span>
                    </div>
                  ))}
                </div>

                {datosMes.length === 0 ? (
                  <p style={{ color: '#555', textAlign: 'center', padding: '40px 0' }}>
                    No hay datos para {anioActual}
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: isMobile ? '480px' : '600px' }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {guias.map(g => {
                        const y = padT + innerH - (g / 100) * innerH
                        const esNivel = [50, 70, 85].includes(g)
                        const info = nivelInfo[g]
                        return (
                          <g key={g}>
                            <line
                              x1={padL} y1={y} x2={W - padR} y2={y}
                              stroke={esNivel ? `${info.color}60` : '#ffffff08'}
                              strokeWidth={esNivel ? 1.5 : 0.5}
                              strokeDasharray={esNivel ? '5 4' : ''}
                            />
                            <text x={padL - 8} y={y + 4} fill="#4b5563" fontSize={10} textAnchor="end">{g}</text>
                            {esNivel && (
                              <g>
                                <circle cx={W - padR + 20} cy={y} r={4} fill={info.color} />
                                <text x={W - padR + 28} y={y + 4} fill={info.color} fontSize={10} fontWeight="700">
                                  {info.label}
                                </text>
                              </g>
                            )}
                          </g>
                        )
                      })}

                      {areaD && <path d={areaD} fill="url(#lineGrad)" />}
                      {pathD && (
                        <path d={pathD} fill="none" stroke="#00d4ff" strokeWidth={2.5}
                          strokeLinecap="round" strokeLinejoin="round" />
                      )}

                      {puntos.map((p, i) => {
                        const cfg = nivelConfig[p.item.nivel_color] || nivelConfig.critico
                        const mes = parseInt(p.item.periodo_mes.split('-')[1]) - 1
                        return (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r={7} fill={cfg.color} opacity={0.2} />
                            <circle cx={p.x} cy={p.y} r={4} fill={cfg.color} />
                            <text x={p.x} y={H - 8} fill="#6b7280" fontSize={11} textAnchor="middle">
                              {mesesNombres[mes]}
                            </text>
                            <text x={p.x} y={p.y - 12} fill={cfg.color} fontSize={11}
                              textAnchor="middle" fontWeight="bold">
                              {p.item.puntuacion_salud}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                )}
              </div>

              {/* ── Tabla detalle ───────────────────────────────────────────────── */}
              <div style={{
                background: '#0f1117', border: '1px solid #1e2440',
                borderRadius: 20, overflow: 'hidden',
              }}>
                <div style={{ padding: isMobile ? '16px 16px 12px' : '24px 32px 16px' }}>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: isMobile ? 15 : 18, fontWeight: 700 }}>
                    ✦ Detalle por Mes — {anioActual}
                  </h2>
                </div>

                {/* MÓVIL: tarjetas con separación clara */}
                {isMobile ? (
                  <>
                    {datosMes.length === 0 ? (
                      <p style={{ color: '#555', textAlign: 'center', padding: '32px' }}>
                        No hay datos para {anioActual}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px' }}>
                        {datosMes.map((item) => {
                          const cfg = nivelConfig[item.nivel_color] || nivelConfig.critico
                          const mes = parseInt(item.periodo_mes.split('-')[1]) - 1
                          const mesesCompletos = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
                          return (
                            <div key={item.id} style={{
                              background: '#0a1020',
                              border: `1px solid ${cfg.color}30`,
                              borderLeft: `3px solid ${cfg.color}`,
                              borderRadius: 12,
                              padding: '14px',
                            }}>
                              {/* Encabezado: mes completo + nivel */}
                              <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: 12,
                              }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                                  {mesesCompletos[mes]}
                                </span>
                                <span style={{
                                  padding: '3px 10px', borderRadius: 20,
                                  background: cfg.bg, color: cfg.color,
                                  fontSize: 11, fontWeight: 500,
                                }}>
                                  {cfg.label}
                                </span>
                              </div>

                              {/* 4 datos en una sola fila */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                gap: 4,
                              }}>
                                <div>
                                  <div style={{ color: '#555', fontSize: 9, marginBottom: 3 }}>Ingresos</div>
                                  <div style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                                    ${item.total_ingresos.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ color: '#555', fontSize: 9, marginBottom: 3 }}>Gastos</div>
                                  <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>
                                    ${item.total_gastos.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ color: '#555', fontSize: 9, marginBottom: 3 }}>Balance</div>
                                  <div style={{
                                    color: item.balance >= 0 ? '#10b981' : '#ef4444',
                                    fontSize: 12, fontWeight: 600,
                                  }}>
                                    {item.balance >= 0 ? '+' : ''}${item.balance.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ color: '#555', fontSize: 9, marginBottom: 3 }}>Puntuación</div>
                                  <div style={{ color: cfg.color, fontSize: 12, fontWeight: 700 }}>
                                    {item.puntuacion_salud}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* DESKTOP/TABLET: tabla con grid */
                  <>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                      padding: isTablet ? '12px 20px' : '12px 32px',
                      background: '#0a0d14',
                      borderTop: '1px solid #1e2440', borderBottom: '1px solid #1e2440',
                    }}>
                      {['Mes', 'Ingresos', 'Gastos', 'Balance', 'Puntuación', 'Nivel'].map(h => (
                        <span key={h} style={{ color: '#6b7280', fontSize: isTablet ? 11 : 12, fontWeight: 500 }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    {datosMes.length === 0 ? (
                      <p style={{ color: '#555', textAlign: 'center', padding: '32px' }}>
                        No hay datos para {anioActual}
                      </p>
                    ) : (
                      datosMes.map((item, i) => {
                        const cfg = nivelConfig[item.nivel_color] || nivelConfig.critico
                        const mes = parseInt(item.periodo_mes.split('-')[1]) - 1
                        return (
                          <div key={item.id} style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                            padding: isTablet ? '14px 20px' : '16px 32px',
                            background: i % 2 === 0 ? '#0f1117' : '#0a1020',
                            borderBottom: '1px solid #1e244020',
                            alignItems: 'center',
                          }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: isTablet ? 13 : 14 }}>
                              {mesesNombres[mes]}
                            </span>
                            <span style={{ color: '#10b981', fontSize: isTablet ? 13 : 14 }}>
                              ${item.total_ingresos.toLocaleString()}
                            </span>
                            <span style={{ color: '#ef4444', fontSize: isTablet ? 13 : 14 }}>
                              ${item.total_gastos.toLocaleString()}
                            </span>
                            <span style={{
                              color: item.balance >= 0 ? '#10b981' : '#ef4444',
                              fontSize: isTablet ? 13 : 14,
                            }}>
                              {item.balance >= 0 ? '+' : ''}${item.balance.toLocaleString()}
                            </span>
                            <span style={{ color: cfg.color, fontWeight: 700, fontSize: isTablet ? 13 : 14 }}>
                              {item.puntuacion_salud}
                            </span>
                            <span style={{
                              display: 'inline-block', padding: '4px 10px', borderRadius: 20,
                              background: cfg.bg, color: cfg.color,
                              fontSize: isTablet ? 11 : 12, fontWeight: 500,
                              width: 'fit-content',
                            }}>
                              {cfg.label}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Estado vacío ─────────────────────────────────────────────────── */}
          {!loading && historial.length === 0 && !error && (
            <Card style={{
              background: '#0f1117', border: '1px solid #1e2440',
              textAlign: 'center', borderRadius: 16,
            }}>
              <p style={{ color: '#555', margin: 0 }}>No hay historial disponible aún.</p>
            </Card>
          )}

        </Content>
      </Layout>
    </Layout>
  )
}