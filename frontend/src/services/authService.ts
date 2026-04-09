import apiAuth from './apiAuth'

export const authService = {
  signUp: async (data: { fullName: string, email: string, password: string }) => {
    const res = await apiAuth.post('/signup', data)
    return res.data
  },

  signIn: async (data: { email: string, password: string }) => {
    const res = await apiAuth.post('/signin', data)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    localStorage.setItem('token', res.data.token)
    return res.data
  },

  signOut: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => !!localStorage.getItem('token')
}