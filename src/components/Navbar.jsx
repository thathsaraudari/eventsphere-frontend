import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand brand-xl" to="/">EventSphere</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
          </ul>

          {!user ? (
            <div className="d-flex gap-2">
              <NavLink className="btn btn-outline-secondary" to="/login">Log in</NavLink>
              <NavLink className="btn btn-primary" to="/signup">Sign up</NavLink>
            </div>
          ) : (
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                {([user?.firstName, user?.lastName].join(' '))}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => { navigate('/profile'); }}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => { navigate('/myevents'); }}
                  >
                    My Events
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => { logout(); navigate('/'); }}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
