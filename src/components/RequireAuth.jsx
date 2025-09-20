import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

export default function RequireAuth({ children }) {
  const { user, token } = useAuth()
  const location = useLocation()

  if (!user && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
