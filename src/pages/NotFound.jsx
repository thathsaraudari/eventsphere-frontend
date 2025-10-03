import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card cardReset border-0 shadow-sm">
            <div className="card-body p-4 p-md-5 text-center d-grid gap-3">
              <span className="badge rounded-pill text-bg-light mx-auto" style={{ border: '1px solid #e5e7eb' }}>404</span>
              <h1 className="h4 mb-0">Page not found</h1>
              <p className="text-muted mb-0">
                The page you are looking for doesn’t exist or has been moved.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                  Go Back
                </button>
                <Link to="/events" className="btn btn-primary">Browse Events</Link>
                <Link to="/contact" className="btn btn-outline-primary">Contact Us</Link>
              </div>

              <div className="ratio ratio-16x9 rounded-3 overflow-hidden mt-3" style={{ backgroundColor: 'rgba(0,0,0,.04)' }}>
                <img
                  src="https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1400&q=60"
                  alt="Person looking at a map, representing navigation"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

