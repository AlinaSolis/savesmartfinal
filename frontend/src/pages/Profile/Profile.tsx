import { Layout } from 'antd'
import Sidebar from '../../components/Layout/Sidebar'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import api from '../../services/apiAuth'

interface ProfileProps {
  noLeidas: number
}

function Profile({ noLeidas }: ProfileProps) {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({ name: '', email: '' })
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cargarPerfil = () => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) { navigate('/login'); return }
    const parsedUser = JSON.parse(savedUser)
    setError(null)
    api.get(`/profile/${parsedUser.id}`)
      .then(res => {
        setProfileData({ name: res.data.name, email: res.data.email })
        setFormData({ name: res.data.name, email: res.data.email, password: '' })
      })
      .catch(() => setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.'))
  }

  useEffect(() => { cargarPerfil() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const savedUser = localStorage.getItem('user')
    if (!savedUser) { navigate('/login'); return }
    const parsedUser = JSON.parse(savedUser)

    try {
      const payload: Record<string, string> = {
        name: formData.name,
        email: formData.email,
      }
      if (formData.password.trim()) {
        payload.password = formData.password
      }

      const res = await api.put(`/profile/${parsedUser.id}`, payload)

      setProfileData({ name: res.data.name, email: res.data.email })

      const updatedUser = { ...parsedUser, name: res.data.name, email: res.data.email }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setFormData(p => ({ ...p, password: '' }))
      setShowPassword(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'No se pudo guardar. Intenta de nuevo.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const initials = profileData.name.trim().slice(0, 2).toUpperCase() || 'US'

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Sidebar notificacionesNoLeidas={noLeidas} />

      <Layout style={{ background: '#0f1117', overflow: 'auto' }}>
        <Content style={{
          padding: isMobile ? '16px' : '32px 40px',
          background: '#0f1117',
          paddingBottom: isMobile ? '80px' : '40px',
          color: '#fff',
          minHeight: '100vh',
          overflowY: 'auto',
        }}>

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16,
            marginBottom: isMobile ? 24 : 36,
          }}>
            <div style={{
              width: isMobile ? 42 : 52, height: isMobile ? 42 : 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #0891b2, #a855f7)',
              boxShadow: '0 0 20px rgba(168,85,247,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <UserOutlined style={{ fontSize: isMobile ? 22 : 28, color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: '#f7f8f7', fontSize: isMobile ? 22 : 30, margin: 0, fontWeight: 700 }}>Perfil</h1>
              <p style={{ color: '#555', margin: 0, fontSize: isMobile ? 12 : 14 }}>
                Gestiona tu información personal y preferencias
              </p>
            </div>
          </div>

          {/* ── Error con Reintentar ── */}
          {error && (
            <div style={{
              background: '#1a0f0f', border: '1px solid #ef444440', borderRadius: 16,
              padding: isMobile ? '16px' : '20px 24px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: 'rgba(239,68,68,0.12)',
                border: '2px solid rgba(239,68,68,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="#ef4444" width={22} height={22}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>Error de conexión</p>
                <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{error}</p>
              </div>
              <button onClick={cargarPerfil} style={{
                padding: '8px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Reintentar</button>
            </div>
          )}

          {/* ── Layout principal ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
            gap: isMobile ? 16 : 24,
            alignItems: 'start',
          }}>

            {/* ── Card izquierda: Avatar + datos rápidos ── */}
            <div style={{
              background: '#13151f', border: '1px solid #1f2235', borderRadius: 20,
              padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 0, textAlign: 'center',
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0891b2, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 800, color: '#fff',
                boxShadow: '0 0 28px rgba(168,85,247,0.4)',
                marginBottom: 16,
              }}>
                {initials}
              </div>

              <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>
                {profileData.name || '—'}
              </p>
              <p style={{ color: '#555', fontSize: 13, margin: '0 0 16px', wordBreak: 'break-all' }}>
                {profileData.email || '—'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 10, padding: '8px 12px',
                }}>
                  <SafetyCertificateOutlined style={{ color: '#22c55e', fontSize: 15 }} />
                  <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 600 }}>Cuenta Verificada</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 10, padding: '8px 12px',
                }}>
                  <CheckCircleOutlined style={{ color: '#00d4ff', fontSize: 15 }} />
                  <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 600 }}>Usuario Activo</span>
                </div>
              </div>
            </div>

            {/* ── Card derecha: Formulario ── */}
            <div style={{
              background: '#13151f', border: '1px solid #1f2235', borderRadius: 20, padding: isMobile ? 20 : 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <EditOutlined style={{ color: '#00d4ff', fontSize: 18 }} />
                <h3 style={{ color: '#f7f8f7', fontSize: 18, fontWeight: 700, margin: 0 }}>
                  Información Personal
                </h3>
              </div>

              <form onSubmit={handleSave}>
                {/* Nombre */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: '#888', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <UserOutlined style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: '#444', fontSize: 15, zIndex: 1,
                    }} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 14px 12px 40px',
                        background: '#0f1117', border: '1px solid #1f2235',
                        borderRadius: 12, color: '#f7f8f7', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00d4ff'}
                      onBlur={e => e.target.style.borderColor = '#1f2235'}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: '#888', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MailOutlined style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: '#444', fontSize: 15, zIndex: 1,
                    }} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 14px 12px 40px',
                        background: '#0f1117', border: '1px solid #1f2235',
                        borderRadius: 12, color: '#f7f8f7', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00d4ff'}
                      onBlur={e => e.target.style.borderColor = '#1f2235'}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #1f2235', margin: '20px 0' }} />

                {/* Contraseña */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: '#888', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nueva Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <LockOutlined style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: '#444', fontSize: 15, zIndex: 1,
                    }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder="Dejar vacío para no cambiar"
                      style={{
                        width: '100%', padding: '12px 44px 12px 40px',
                        background: '#0f1117', border: '1px solid #1f2235',
                        borderRadius: 12, color: '#f7f8f7', fontSize: 14,
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#a855f7'}
                      onBlur={e => e.target.style.borderColor = '#1f2235'}
                    />
                    {/* ── Botón ojo ── */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        color: showPassword ? '#a855f7' : '#444',
                        fontSize: 16, display: 'flex', alignItems: 'center',
                        transition: 'color 0.2s',
                      }}
                    >
                      {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                  <p style={{ color: '#444', fontSize: 11, margin: '6px 0 0 4px' }}>
                    Mínimo 8 caracteres, una mayúscula y un número
                  </p>
                </div>

                {/* Botón guardar */}
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%', padding: '13px',
                    background: saving ? 'rgba(0,212,255,0.1)' : 'linear-gradient(135deg, #0891b2, #a855f7)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', boxShadow: saving ? 'none' : '0 0 20px rgba(0,212,255,0.2)',
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            </div>
          </div>

        </Content>
      </Layout>

      {/* ── Modal Éxito ── */}
      {saveSuccess && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#13151f', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 20, padding: '32px 40px', textAlign: 'center',
            boxShadow: '0 0 40px rgba(34,197,94,0.15)',
            animation: 'fadeInScale 0.3s ease',
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <h3 style={{ color: '#22c55e', fontWeight: 700, margin: '0 0 8px', fontSize: 18 }}>
              ¡Cambios guardados!
            </h3>
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
              Tu perfil se actualizó correctamente.
            </p>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Profile