import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">EventSphere</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/events">Events</NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2">
            <NavLink className="btn btn-outline-primary" to="/login">Log in</NavLink>
            <NavLink className="btn btn-primary" to="/signup">Sign up</NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
