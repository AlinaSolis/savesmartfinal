import { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  SwapOutlined,
  BulbOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

interface SidebarProps {
  notificacionesNoLeidas?: number
}

const NAV_ITEMS = [
  { key: '/dashboard',       icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/transacciones', icon: <SwapOutlined />, label: 'Transacciones' },
  { key: '/analisis',        icon: <BulbOutlined />,      label: 'Análisis IA' },
  { key: '/perfil',          icon: <UserOutlined />,      label: 'Perfil' },
  { key: '/notificaciones',  icon: <BellOutlined />,      label: 'Notificaciones' },
  { key: '/cerrar-sesion',   icon: <LogoutOutlined />,    label: 'Cerrar Sesión' },

]

export default function Sidebar({ notificacionesNoLeidas = 0 }: SidebarProps) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Items para el Menu de Ant Design (desktop/tablet) ────────────────────────
  const menuItems = NAV_ITEMS.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.key === '/notificaciones' ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 8 }}>
        <span>{item.label}</span>
        {notificacionesNoLeidas > 0 && (
          <span style={{
            backgroundColor: '#ef4444', color: '#fff',
            fontSize: 11, fontWeight: 700,
            borderRadius: '50%', minWidth: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 5px', lineHeight: 1,
          }}>
            {notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas}
          </span>
        )}
      </div>
    ) : item.label,
  }))

  // ── MÓVIL: barra inferior fija ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 1000,
        background: '#0f1117',
        borderTop: '1px solid #1f2235',
        display: 'flex',
        alignItems: 'stretch',
        height: 60,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.key
          const isBell = item.key === '/notificaciones'
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 4px',
                position: 'relative',
                borderTop: active ? '2px solid #00d4ff' : '2px solid transparent',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Ícono con badge si es notificaciones */}
              <span style={{
                fontSize: 18,
                color: active ? '#00d4ff' : '#555',
                position: 'relative',
                transition: 'color 0.2s',
              }}>
                {item.icon}
                {isBell && notificacionesNoLeidas > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -5, right: -8,
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: '50%',
                    minWidth: 16, height: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1,
                  }}>
                    {notificacionesNoLeidas > 9 ? '9+' : notificacionesNoLeidas}
                  </span>
                )}
              </span>

              {/* Label pequeño debajo del ícono */}
              <span style={{
                fontSize: 10,
                color: active ? '#00d4ff' : '#444',
                fontWeight: active ? 600 : 400,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                transition: 'color 0.2s',
              }}>
                {/* Etiquetas cortas para que quepan */}
                {item.key === '/transacciones' ? 'Transac.' :
                 item.key === '/notificaciones' ? 'Notif.' :
                 item.key === '/analisis' ? 'Análisis' :
                 item.label}
              </span>
            </button>
          )
        })}
      </nav>
    )
  }

  // ── DESKTOP / TABLET: sidebar lateral ───────────────────────────────────────
  return (
    <Sider
      width={220}
      style={{
        background: '#0f1117',
        minHeight: '100vh',
        borderRight: '1px solid #1f2235',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 16px',
        borderBottom: '1px solid #1f2235',
      }}>

        <div className="hidden lg:flex lg:w-64 bg-[#0f1115] border-r border-gray-800 min-h-screen p-6 flex-col">
        
       </div> 

        <h2 style={{ color: '#00d4ff', margin: 0, fontSize: 22, fontWeight: 'bold' }}>
          SaveSmart
        </h2>
        <p style={{ color: '#666', margin: 0, fontSize: 12 }}>
          Tu futuro financiero
        </p>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{ background: '#0f1117', border: 'none', marginTop: 16 }}
        theme="dark"
      />
    </Sider>
  )
}