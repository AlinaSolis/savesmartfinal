import { Button, Layout } from 'antd'
import Sidebar from '../../components/Layout/Sidebar'
import Avatar from 'antd/es/avatar/Avatar'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import '../../styles/Profile.css'
import api from '../../services/apiAuth'
// Define la interfaz
interface ProfileProps {
  noLeidas: number;
}

function Profile({ noLeidas }: ProfileProps) {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    name: ' ',
    email: ' '
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(savedUser)

    api.get(`/profile/${parsedUser.id}`)
      .then(res => {
        setProfileData({
          name: res.data.name,
          email: res.data.email
        })
      })
      .catch(() => navigate('/login'))

  }, [navigate])
  function handleChange(field: string, value: any) {
    setProfileData({
      ...profileData,
      [field]: value
    })
  }

  function handleSave(event: React.MouseEvent<HTMLElement>): void {
    throw new Error('Function not implemented.')
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#0a0d14' }}>
      
      {/*Sidebar */}
      <Sidebar notificacionesNoLeidas={noLeidas} />

      {/*Contenido D PERFIL */}
      <Layout style={{ background: '#0a0d14' }}>
        <Content style={{
          padding: '32px 40px',
          background: '#0a0d14',
          color: '#fff'
        }}>
          
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            color: '#f7f8f7'
          }}>
            Perfil
          </h1>
          <div style={{ marginTop: 20 }}>
  
  {/* SUBTÍTULO */}
  <p style={{ color: '#9ca3af', marginBottom: 24 }}>
    Gestiona tu información personal y preferencias
  </p>

  {/* CONTENEDOR PRINCIPAL */}
  <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'stretch'
  }}>

    {/* CARD IZQUIERDA */}
    <div style={{
      width: 260,
      background: 'linear-gradient(145deg, #1b263b, #111827)',
      borderRadius: 16,
      padding: 24,
      textAlign: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          size={80}
          style={{
            background: '#1da1f2',
            fontSize: 28
          }}
        >
          {profileData.name.slice(0,2).toUpperCase()}
        </Avatar>

        {/* iconito */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          background: '#00c2ff',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12
        }}>
          📷
        </div>
      </div>

      <h3 style={{ marginTop: 16, color: '#fff' }}>
        {profileData.name}
      </h3>

      <p style={{ color: '#9ca3af', fontSize: 13 }}>
        {profileData.email}
      </p>

      <p style={{ color: '#22c55e', fontSize: 12 }}>
        Cuenta Verificada
      </p>
    </div>

    {/* 🔵 CARD DERECHA */}
    <div style={{
      flex: 1,
      background: 'linear-gradient(145deg, #1b263b, #111827)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
    }}>

      <h3 style={{ color: '#fff', marginBottom: 20 }}>
        Información Personal
      </h3>

      {/* INPUT NOMBRE */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#9ca3af', fontSize: 13 }}>
          Nombre Completo
        </label>
        <input
          type="text"
          value={profileData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{
            marginTop: 6,
            background: '#0f172a',
            border: 'none',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* INPUT EMAIL */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#9ca3af', fontSize: 13 }}>
          Correo Electrónico
        </label>
        <input
          type="email"
          value={profileData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          style={{
            marginTop: 6,
            background: '#0f172a',
            border: 'none',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* PASSWORD */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: '#9ca3af', fontSize: 13 }}>
          Cambiar Contraseña
        </label>
        <input
          type="password"
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Nueva contraseña"
          style={{
            marginTop: 6,
            background: '#0f172a',
            border: 'none',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* BOTÓN */}
      <Button
        onClick={handleSave}
        style={{
          background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
          border: 'none',
          color: '#fff',
          borderRadius: 20,
          padding: '0 24px'
        }}
      >
        Guardar Cambios
      </Button>

    </div>

  </div>

</div>

        </Content>
      </Layout>

    </Layout>
  )
}

export default Profile
