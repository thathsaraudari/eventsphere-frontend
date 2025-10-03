import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

export default function Signup() {
  const { signup, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      
      const data = await signup({ email, password, username })

      
      const hasToken = data?.token
      const hasUser = !!data?.user

      if (!hasToken && !hasUser) {
  
        try { await login(email, password) } catch {}
      }

      navigate('/')
    } catch (e) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h1 className="h4 mb-3">Sign up</h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={onSubmit} className="card p-3">
            <input
              className="form-control mb-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="form-control mb-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="form-control mb-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <p className="mt-3">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
