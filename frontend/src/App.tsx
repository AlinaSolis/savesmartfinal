import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App as AntApp } from 'antd'
import AnalisisPage from './pages/Analisis/AnalisisPage'
import NotificacionesPage from './pages/Notificaciones/NotificacionesPage'
import { useNotificaciones } from './hooks/useNotificaciones'
import HistorialPage from './pages/Historial/HistorialPage'
import Transactions from './pages/Transacciones/TransactionsPage'
import Login from './pages/Auth/Login'
import Profile from './pages/Auth/Profile'
import Register from './pages/Auth/Register'

function AppContent() {
  const { noLeidas, recargar } = useNotificaciones()

  return (
      <BrowserRouter>
      <Routes>

        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Profile />} />

        {/* Paginas */}
        <Route path="/analisis" element={
          <AnalisisPage noLeidas={noLeidas} recargar={recargar} />
        } />
        <Route path="/notificaciones" element={
          <NotificacionesPage noLeidas={noLeidas} recargar={recargar} />
        } />
        <Route path="/historial" element={
          <HistorialPage noLeidas={noLeidas} recargar={recargar} />
        } />
        <Route path="/transacciones" element={<Transactions />} />

      </Routes>
    </BrowserRouter>
    
  )
}

export default function App() {
  return (
    <AntApp>
      <AppContent />
    </AntApp>
  )
}