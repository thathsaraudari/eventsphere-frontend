import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('accessToken'))

  useEffect(() => {
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
  }, [token])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data?.token)
    setUser(data?.user || { email })
    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
