import { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService'

interface AuthUser {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  userId: number | null
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  refreshUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getUser())

  const refreshUser = () => {
    setUser(authService.getUser())
  }

  return (
    <AuthContext.Provider value={{ user, userId: user?.id ?? null, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
