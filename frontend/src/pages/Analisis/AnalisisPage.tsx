import { useEffect, useState, useRef } from 'react'
import { Layout, Card, Row, Col, Spin } from 'antd'
import Sidebar from '../../components/Layout/Sidebar'
import { analisisService } from '../../services/analisisService'
import type { AnalisisFinanciero } from '../../types'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const { Content } = Layout

interface AnalisisPageProps {
  noLeidas: number
  recargar: () => void
}

// ─── Tooltip Component ────────────────────────────────────────────────────────
interface TooltipProps {
  text: string
  children: React.ReactNode
}

function MetricTooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<'top' | 'bottom'>('top')
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos(rect.top < 120 ? 'bottom' : 'top')
    }
    setVisible(true)
  }

  return (
    <div
      ref={triggerRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div style={{
        position: 'absolute',
        [pos === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 17, 23, 0.97)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        padding: '9px 13px',
        width: '210px',
        fontSize: '12px',
        lineHeight: '1.5',
        color: '#c4c4cf',
        pointerEvents: 'none',
        zIndex: 999,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.18s ease',
        whiteSpace: 'normal',
        textAlign: 'left',
      }}>
        <div style={{
          position: 'absolute',
          [pos === 'top' ? 'bottom' : 'top']: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          ...(pos === 'top'
            ? { borderTop: '5px solid rgba(255,255,255,0.12)' }
            : { borderBottom: '5px solid rgba(255,255,255,0.12)' }
          ),
        }} />
        {text}
      </div>
    </div>
  )
}

// ─── Info icon ────────────────────────────────────────────────────────────────
function InfoIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} width={14} height={14}
      style={{ opacity: 0.7, flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 8h.01M12 11v5" />
    </svg>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalisisPage({ noLeidas, recargar }: AnalisisPageProps) {
  const { userId } = useAuth()
  const [analisis, setAnalisis] = useState<AnalisisFinanciero | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ── Breakpoints reactivos ────────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const isMobile = windowWidth < 640
  const isTablet = windowWidth < 1024

  useEffect(() => {
    cargarDatos()
    const intervalo = setInterval(() => cargarDatos(true), 10000)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(intervalo)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const cargarDatos = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true)
      const [analisisData] = await Promise.all([analisisService.getAnalisis(userId!)])
      setAnalisis(analisisData)
      setError('')
      setTimeout(() => recargar(), 500)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setAnalisis(null)
        setError('')
      } else {
        setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.')
      }
    } finally {
      if (!silencioso) setLoading(false)
    }
  }

  const getPuntuacionInfo = (score: number) => {
    if (score >= 85) return {
      mensaje: 'Excelente', submensaje: 'Tu salud financiera es excelente. ¡Sigue así!',
      color: '#10b981', bgColor: 'rgba(16,185,129,0.15)',
      borderColor: 'rgba(16,185,129,0.3)', textColor: '#10b981',
    }
    if (score >= 70) return {
      mensaje: 'Bueno', submensaje: 'Vas por buen camino. Pequeños ajustes pueden mejorar tu situación.',
      color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)',
      borderColor: 'rgba(59,130,246,0.3)', textColor: '#3b82f6',
    }
    if (score >= 50) return {
      mensaje: 'Regular', submensaje: 'Buen progreso. Sigue así y alcanzarás tus metas.',
      color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)',
      borderColor: 'rgba(245,158,11,0.3)', textColor: '#f59e0b',
    }
    return {
      mensaje: 'Critico', submensaje: 'Es momento de hacer cambios en tus hábitos financieros.',
      color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)',
      borderColor: 'rgba(239,68,68,0.3)', textColor: '#ef4444',
    }
  }

  const colorRiesgo: Record<string, { bg: string; color: string; label: string }> = {
    bajo: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Estable' },
    medio: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Moderado' },
    alto: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Alto' },
  }

  const consejoIconos = {
    alerta: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f59e0b" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>,
    meta: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#a855f7" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
    logro: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#10b981" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    consejo: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#06b6d4" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>,
    impulso: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f43f5e" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" /></svg>,
  }

  const consejoConfig: Record<string, { bg: string; color: string; icon: React.ReactElement }> = {
    alerta: { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b', icon: consejoIconos.alerta },
    meta: { bg: 'rgba(168,85,247,0.2)', color: '#a855f7', icon: consejoIconos.meta },
    logro: { bg: 'rgba(16,185,129,0.2)', color: '#10b981', icon: consejoIconos.logro },
    consejo: { bg: 'rgba(6,182,212,0.2)', color: '#06b6d4', icon: consejoIconos.consejo },
    impulso: { bg: 'rgba(244,63,94,0.2)', color: '#f43f5e', icon: consejoIconos.impulso },
  }

  const score = analisis?.puntuacion_salud ?? 0
  const puntuacionInfo = getPuntuacionInfo(score)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const icons = {
    tasaAhorro: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    gastosVsPresupuesto: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
    consistencia: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
    riesgoBajo: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
    riesgoAlto: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>,
    notificacion: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" /><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" /></svg>,
    estrella: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" /></svg>,
  }

  const metricTooltips = {
    tasaAhorro: 'Porcentaje de tus ingresos que estás ahorrando. Se calcula como (Ingresos − Gastos) ÷ Ingresos × 100. Un valor superior al 20 % se considera saludable.',
    gastosVsPresupuesto: 'Cuánto de tu presupuesto ya has utilizado. Un valor cercano al 100 % indica que estás al límite; superarlo implica déficit.',
    consistencia: 'Mide qué tan regularmente respetas tu presupuesto mes a mes. Alta consistencia significa hábitos financieros estables y predecibles.',
    riesgoFinanciero: 'Nivel de vulnerabilidad de tus finanzas ante imprevistos. Considera tu fondo de emergencia, deudas y margen de ahorro disponible.',
  }

  const stats = [
    {
      label: 'Tasa de Ahorro', tooltip: metricTooltips.tasaAhorro,
      value: `${analisis?.tasa_ahorro || 0}%`,
      trend: (analisis?.tasa_ahorro || 0) >= 30 ? 'Excelente' : (analisis?.tasa_ahorro || 0) >= 20 ? 'Saludable' : (analisis?.tasa_ahorro || 0) >= 10 ? 'Mejorable' : '↓ Bajo',
      trendUp: (analisis?.tasa_ahorro || 0) >= 20, isRisk: false,
      icon: icons.tasaAhorro, bgColor: 'rgba(16,185,129,0.15)', color: '#10b981', iconBg: 'rgba(16,185,129,0.25)',
    },
    {
      label: 'Gastos vs Presupuesto', tooltip: metricTooltips.gastosVsPresupuesto,
      value: `${analisis?.uso_presupuesto || 0}%`,
      trend: (analisis?.uso_presupuesto || 0) <= 60 ? 'Controlado' : (analisis?.uso_presupuesto || 0) <= 80 ? 'Moderado' : (analisis?.uso_presupuesto || 0) <= 100 ? '↑ Elevado' : '⚠ Excedido',
      trendUp: (analisis?.uso_presupuesto || 0) <= 80, isRisk: false,
      icon: icons.gastosVsPresupuesto, bgColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', iconBg: 'rgba(245,158,11,0.25)',
    },
    {
      label: 'Consistencia', tooltip: metricTooltips.consistencia,
      value: `${analisis?.consistencia || 0}%`,
      trend: (analisis?.consistencia || 0) >= 90 ? 'Constante' : (analisis?.consistencia || 0) >= 70 ? 'Regular' : (analisis?.consistencia || 0) >= 50 ? 'Variable' : '↓ Irregular',
      trendUp: (analisis?.consistencia || 0) >= 70, isRisk: false,
      icon: icons.consistencia, bgColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', iconBg: 'rgba(59,130,246,0.25)',
    },
    {
      label: 'Riesgo Financiero', tooltip: metricTooltips.riesgoFinanciero,
      value: analisis?.nivel_riesgo ? analisis.nivel_riesgo.charAt(0).toUpperCase() + analisis.nivel_riesgo.slice(1) : 'Bajo',
      trend: colorRiesgo[analisis?.nivel_riesgo ?? 'bajo']?.label ?? 'Estable',
      trendUp: analisis?.nivel_riesgo === 'bajo', isRisk: true,
      bgColor: analisis?.nivel_riesgo === 'bajo' ? 'rgba(16,185,129,0.15)' : analisis?.nivel_riesgo === 'medio' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
      color: analisis?.nivel_riesgo === 'bajo' ? '#10b981' : analisis?.nivel_riesgo === 'medio' ? '#f59e0b' : '#ef4444',
      iconBg: analisis?.nivel_riesgo === 'bajo' ? 'rgba(16,185,129,0.25)' : analisis?.nivel_riesgo === 'medio' ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)',
      icon: analisis?.nivel_riesgo === 'bajo' ? icons.riesgoBajo : icons.riesgoAlto,
    },
  ]

  // Grid de métricas: 1 col móvil, 2 tablet, 4 desktop
  const statsGridTemplate = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
  const contentPadding = isMobile ? '16px' : isTablet ? '24px 28px' : '32px 40px'

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Sidebar notificacionesNoLeidas={noLeidas} />
      <Layout style={{ background: '#0f1117' }}>
        <Content style={{
          padding: contentPadding,
          background: '#0f1117',
          // Espacio para barra inferior en móvil
          paddingBottom: isMobile ? '80px' : (isTablet ? '28px' : '40px'),
        }}>

          {/* ── Header ─────────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : '0',
            marginBottom: isMobile ? 20 : 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16 }}>
              <div style={{
                width: isMobile ? 42 : 52,
                height: isMobile ? 42 : 52,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="white"
                  width={isMobile ? 26 : 32} height={isMobile ? 26 : 32}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  color: '#f7f8f7',
                  fontSize: isMobile ? 22 : 30,
                  margin: 0, fontWeight: 700,
                }}>
                  Análisis IA
                </h1>
                <p style={{ color: '#555', margin: 0, fontSize: isMobile ? 12 : 14 }}>
                  Recomendaciones inteligentes basadas en tus hábitos financieros
                </p>
              </div>
            </div>

            {/* Botón notificaciones — solo visible en desktop (en móvil está en el bottom nav) */}
            {!isMobile && (
              <a href="/notificaciones" style={{
                position: 'relative',
                padding: '12px', borderRadius: '12px',
                background: 'rgba(39,39,42,0.5)',
                border: '1px solid rgba(63,63,70,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.borderColor = '#52525b' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(39,39,42,0.5)'; e.currentTarget.style.borderColor = 'rgba(63,63,70,0.5)' }}
              >
                {icons.notificacion}
                {noLeidas > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '20px', height: '20px',
                    background: '#ef4444', borderRadius: '50%',
                    fontSize: '10px', fontWeight: 'bold', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {noLeidas > 9 ? '9+' : noLeidas}
                  </span>
                )}
              </a>
            )}
          </div>

          {/* ── Link historial ──────────────────────────────────────────────────── */}
          {!loading && analisis && (
            <div style={{
              textAlign: isMobile ? 'center' : 'right',
              marginTop: isMobile ? 0 : 32,
              marginBottom: 24,
              paddingRight: isMobile ? 0 : 4,
            }}>
              <a href="/historial" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: isMobile ? '10px 20px' : '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #00d4ff20, #a855f720)',
                border: '1px solid #00d4ff40',
                color: '#00d4ff', textDecoration: 'none',
                fontSize: isMobile ? 13 : 15, fontWeight: 500,
                transition: 'all 0.2s', width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #00d4ff30, #a855f730)'; e.currentTarget.style.borderColor = '#00d4ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #00d4ff20, #a855f720)'; e.currentTarget.style.borderColor = '#00d4ff40' }}
              >
                Ver Historial de Evolución
              </a>
            </div>
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
                  strokeWidth={1.5} stroke="#ef4444" width={isMobile ? 20 : 26} height={isMobile ? 20 : 26}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ef4444', fontWeight: 700, fontSize: isMobile ? 13 : 15, margin: '0 0 4px' }}>Error de conexión</p>
                <p style={{ color: '#6b7280', fontSize: isMobile ? 12 : 13, margin: 0 }}>{error}</p>
              </div>
              <button onClick={() => cargarDatos()} style={{
                padding: isMobile ? '6px 12px' : '8px 18px', borderRadius: 10,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: isMobile ? 12 : 13, fontWeight: 600,
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}>Reintentar</button>
            </div>
          )}

          {/* ── Contenido principal ─────────────────────────────────────────────── */}
          {!loading && analisis && (
            <>
              {/* Score card */}
              <div style={{
                position: 'relative', overflow: 'hidden', borderRadius: '24px',
                background: 'linear-gradient(135deg, #0B1E33 0%, #0A2A3A 50%, #0B1E33 100%)',
                padding: isMobile ? '20px' : '32px',
                marginBottom: '24px',
                boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                border: 'none',
                outline: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: isMobile ? '200px' : '384px', height: isMobile ? '200px' : '384px',
                  background: `radial-gradient(circle, ${puntuacionInfo.color}20, transparent 70%)`,
                  borderRadius: '50%', filter: 'blur(64px)', pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: isMobile ? '150px' : '256px', height: isMobile ? '150px' : '256px',
                  background: `radial-gradient(circle, ${puntuacionInfo.color}20, transparent 70%)`,
                  borderRadius: '50%', filter: 'blur(64px)', pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative' }}>
                  {/* Título y descripción siempre arriba */}
                  <div style={{
                    marginBottom: '16px',
                    textAlign: isMobile ? 'center' : 'left',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      marginBottom: '8px',
                      justifyContent: isMobile ? 'center' : 'flex-start',
                    }}>
                      {icons.estrella}
                      <h2 style={{ color: '#fff', margin: 0, fontSize: isMobile ? '16px' : '20px', fontWeight: 700 }}>
                        Puntuación de Salud Financiera
                      </h2>
                    </div>
                    <p style={{
                      color: '#a1a1aa', margin: 0,
                      fontSize: isMobile ? '12px' : '14px',
                      maxWidth: '440px',
                      marginLeft: isMobile ? 'auto' : '0',
                      marginRight: isMobile ? 'auto' : '0',
                    }}>
                      Análisis en tiempo real de tu situación financiera basado en tus ingresos, gastos y hábitos.
                    </p>
                  </div>

                  {/* Círculo + mensaje — en móvil círculo arriba, mensaje abajo */}
                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                  }}>
                    {/* Círculo */}
                    <div style={{
                      position: 'relative',
                      width: isMobile ? '130px' : '180px',
                      height: isMobile ? '130px' : '180px',
                      flexShrink: 0,
                      order: isMobile ? 0 : 1,
                    }}>
                      <svg width={isMobile ? '130' : '180'} height={isMobile ? '130' : '180'}
                        viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <circle cx="70" cy="70" r={radius} fill="none"
                          stroke={score < 50 ? '#ef4444' : score < 70 ? '#f59e0b' : score < 85 ? '#3b82f6' : '#10b981'}
                          strokeWidth="10" strokeLinecap="round"
                          strokeDasharray={circumference} strokeDashoffset={offset}
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: '#fff', fontSize: isMobile ? '26px' : '36px', fontWeight: 700, lineHeight: 1 }}>
                          {score}
                        </span>
                        <span style={{ color: puntuacionInfo.color, fontSize: isMobile ? '11px' : '14px', fontWeight: 500, marginTop: '6px' }}>
                          {puntuacionInfo.mensaje}
                        </span>
                      </div>
                    </div>

                    {/* Mensaje de estado */}
                    <div style={{
                      flex: 1, width: '100%',
                      textAlign: isMobile ? 'center' : 'left',
                      order: isMobile ? 1 : 0,
                    }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '12px',
                        border: `1px solid ${puntuacionInfo.borderColor}`,
                        backgroundColor: puntuacionInfo.bgColor,
                        maxWidth: '100%',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: puntuacionInfo.color, flexShrink: 0 }} />
                        <span style={{ color: puntuacionInfo.color, fontSize: isMobile ? '12px' : '14px', fontWeight: 500, wordBreak: 'break-word' }}>
                          {puntuacionInfo.submensaje}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Tarjetas de métricas ─────────────────────────────────────────── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: statsGridTemplate,
                gap: isMobile ? '12px' : '16px',
                marginBottom: isMobile ? '24px' : '32px',
              }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{
                    position: 'relative', overflow: 'visible',
                    borderRadius: '20px', background: '#0f1117',
                    border: `1px solid ${stat.color}20`,
                    padding: isMobile ? '14px' : '20px',
                    transition: 'all 0.3s ease', cursor: 'default',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = stat.color
                      e.currentTarget.style.background = '#11131a'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 10px 20px ${stat.color}20`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${stat.color}20`
                      e.currentTarget.style.background = '#0f1117'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isMobile ? '12px' : '16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <div style={{
                            padding: isMobile ? '4px 6px' : '5px 8px', borderRadius: '14px',
                            background: stat.iconBg || stat.bgColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `1px solid ${stat.color}30`, flexShrink: 0,
                          }}>
                            <span style={{ color: stat.color, fontSize: isMobile ? '16px' : '20px' }}>
                              {stat.icon}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                            <span style={{
                              color: '#9ca3af',
                              fontSize: isMobile ? '13px' : '15px',
                              fontWeight: 500,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {stat.label}
                            </span>
                            {stat.tooltip && (
                              <MetricTooltip text={stat.tooltip}>
                                <InfoIcon color={stat.color} />
                              </MetricTooltip>
                            )}
                          </div>
                        </div>

                        <span style={{
                          fontSize: isMobile ? '10px' : '12px', fontWeight: 500,
                          padding: isMobile ? '3px 8px' : '4px 10px', borderRadius: '20px',
                          flexShrink: 0, marginLeft: '6px',
                          background: `${stat.color}20`, color: stat.color,
                          border: `1px solid ${stat.color}40`,
                        }}>
                          {stat.trend}
                        </span>
                      </div>

                      <div style={{
                        fontSize: isMobile ? '22px' : '28px',
                        fontWeight: 700, color: '#fff', lineHeight: 1.2,
                      }}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Recomendaciones ─────────────────────────────────────────────── */}
              {analisis.consejos.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isMobile ? 14 : 20 }}>
                    <span style={{ color: '#6366f1', fontSize: 20 }}>✦</span>
                    <h2 style={{
                      color: '#fff', margin: 0,
                      fontSize: isMobile ? 16 : 20, fontWeight: 700,
                    }}>
                      Recomendaciones Personalizadas
                    </h2>
                  </div>
                  <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                    {analisis.consejos.map((consejo, index) => {
                      const iconType = consejo.tipo
                      const cfg = consejoConfig[iconType] || consejoConfig.consejo
                      return (
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} key={consejo.id || index}>
                          <div style={{
                            background: '#0f1117', border: `1px solid ${cfg.color}20`,
                            borderRadius: 16,
                            padding: isMobile ? '14px 16px' : '20px 24px',
                            display: 'flex', gap: isMobile ? 12 : 16,
                            alignItems: 'flex-start', height: '100%',
                            transition: 'all 0.3s ease',
                          }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = cfg.color
                              e.currentTarget.style.background = '#11131a'
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = `0 10px 20px ${cfg.color}20`
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = `${cfg.color}20`
                              e.currentTarget.style.background = '#0f1117'
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <div style={{
                              width: isMobile ? 36 : 44, height: isMobile ? 36 : 44,
                              borderRadius: 12, flexShrink: 0,
                              background: cfg.bg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: `1px solid ${cfg.color}30`,
                            }}>
                              {cfg.icon}
                            </div>
                            <div>
                              <h3 style={{
                                color: cfg.color, margin: '0 0 6px',
                                fontSize: isMobile ? 13 : 15, fontWeight: 600,
                              }}>
                                {consejo.titulo || 'Recomendación'}
                              </h3>
                              <p style={{
                                color: '#9ca3af', margin: 0,
                                fontSize: isMobile ? 12 : 13, lineHeight: 1.5,
                              }}>
                                {consejo.descripcion || ''}
                              </p>
                            </div>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                </>
              )}
            </>
          )}

          {/* ── Estado vacío ────────────────────────────────────────────────────── */}
          {!loading && !analisis && !error && (
            <Card style={{
              background: '#0f1117', border: '1px solid #1e2440',
              borderRadius: 16, padding: isMobile ? '24px 16px' : '48px 24px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: isMobile ? 60 : 80, height: isMobile ? 60 : 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d4ed820, #3b82f620)',
                  border: '2px solid #3b82f630',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: isMobile ? 14 : 20,
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="#3b82f6"
                    width={isMobile ? 28 : 38} height={isMobile ? 28 : 38}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>

                <h2 style={{ color: '#fff', fontSize: isMobile ? 17 : 20, fontWeight: 700, margin: '0 0 8px' }}>
                  Sin análisis disponible
                </h2>
                <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 14, margin: '0 0 4px', maxWidth: 380 }}>
                  Aún no hay datos suficientes para generar tu análisis financiero.
                </p>
                <p style={{ color: '#3b82f6', fontSize: isMobile ? 13 : 14, fontWeight: 500, margin: '0 0 24px' }}>
                  ¡Solo 3 pasos para obtenerlo!
                </p>

                <div style={{
                  display: 'flex', gap: 10, flexWrap: 'wrap',
                  justifyContent: 'center', marginBottom: 24,
                }}>
                  {[
                    { paso: '1', texto: 'Agrega tus ingresos', color: '#10b981' },
                    { paso: '2', texto: 'Registra tus gastos', color: '#3b82f6' },
                    { paso: '3', texto: 'Obtén tu análisis IA', color: '#a855f7' },
                  ].map(({ paso, texto, color }) => (
                    <div key={paso} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: `${color}10`, border: `1px solid ${color}30`,
                      borderRadius: 12, padding: isMobile ? '6px 12px' : '8px 16px',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: `${color}25`, border: `1px solid ${color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color, fontWeight: 700, fontSize: 12, flexShrink: 0,
                      }}>
                        {paso}
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: isMobile ? 12 : 13 }}>{texto}</span>
                    </div>
                  ))}
                </div>

                <a href="/transacciones" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: isMobile ? '10px 20px' : '10px 24px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#fff', textDecoration: 'none',
                  fontSize: isMobile ? 13 : 14, fontWeight: 500,
                  boxShadow: '0 0 16px rgba(59,130,246,0.3)',
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: 'center',
                }}>
                  Ir a Transacciones
                </a>
              </div>
            </Card>
          )}

        </Content>
      </Layout>
    </Layout>
  )
}