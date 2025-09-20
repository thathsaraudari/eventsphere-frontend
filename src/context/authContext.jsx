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

  async function signup({ email, password, username }) {
    const { data } = await api.post(
      '/auth/signup',
      { email, password, username },
      { withCredentials: true }
    )

    if (data?.accessToken) {
      setToken(data.accessToken)
      localStorage.setItem('accessToken', data.accessToken)
    }
    if (data?.user) setUser(data.user)

    return data
  }

  async function login(email, password) {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    )

    if (data?.accessToken) {
      setToken(data.accessToken)
      localStorage.setItem('accessToken', data.accessToken)
    }
    if (data?.user) setUser(data.user)

    return data
  }
  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
