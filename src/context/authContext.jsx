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

  useEffect(() => {
    async function restore() {
      const t = localStorage.getItem('accessToken')
      if (!t) return
      try {
        const { data } = await api.get('/auth/verify')
        if (data?.valid) {
          setUser(data.user)
          setToken(t)
        }
      } catch {
        setToken(null)
        setUser(null)
      }
    }
    restore()
  }, [])

  function pickToken(payload) {
    return (
      payload?.accessToken ??
      payload?.token ??
      payload?.jwt ??
      payload?.access_token ??
      null
    )
  }

  async function login(email, password) {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { withCredentials: true } 
    )
    const t = pickToken(data)
    if (t) {
      setToken(t)
      localStorage.setItem('accessToken', t)
    }
    setUser(data?.user || { email })

    return data
  }

  async function signup({ email, password, firstName, lastName }) {
    const { data } = await api.post(
      '/auth/signup',
      { email, password, firstName, lastName },
      { withCredentials: true }
    )

    const t = pickToken(data)
    if (t) {
      setToken(t)
      localStorage.setItem('accessToken', t)
      setUser(data?.user || { email, firstName, lastName })
      return data
    }

    try {
      await login(email, password)
    } catch {
    }
    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
