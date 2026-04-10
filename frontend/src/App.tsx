import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App as AntApp } from 'antd'
import AnalisisPage from './pages/Analisis/AnalisisPage'
import NotificacionesPage from './pages/Notificaciones/NotificacionesPage'
import { useNotificaciones } from './hooks/useNotificaciones'
import HistorialPage from './pages/Historial/HistorialPage'
import Transactions from './pages/Transacciones/TransactionsPage'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import Register from './pages/Auth/Register'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'

// Ruta protegida: redirige a /login si no hay sesión
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()
  if (!userId) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Ruta pública: redirige al dashboard si ya hay sesión activa
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()
  if (userId) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppContent() {
  const { noLeidas, recargar } = useNotificaciones()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas — redirigen al dashboard si ya está logueado */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rutas protegidas */}
        <Route path="/perfil"         element={<PrivateRoute><Profile noLeidas={noLeidas} /></PrivateRoute>} />
        <Route path="/dashboard"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/transacciones"  element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/analisis"       element={<PrivateRoute><AnalisisPage noLeidas={noLeidas} recargar={recargar} /></PrivateRoute>} />
        <Route path="/notificaciones" element={<PrivateRoute><NotificacionesPage noLeidas={noLeidas} recargar={recargar} /></PrivateRoute>} />
        <Route path="/historial"      element={<PrivateRoute><HistorialPage noLeidas={noLeidas} recargar={recargar} /></PrivateRoute>} />

        {/* Cualquier ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AntApp>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AntApp>
  )
}