import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function About() {
  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4 align-items-center justify-content-between mb-4 mb-md-5">
        <div className="col-12 col-lg-6">
          <div className="card cardReset h-100">
            <div className="card-body p-4 p-md-5">
              <span className="badge rounded-pill text-bg-light mb-2" style={{ border: '1px solid #e5e7eb' }}>About</span>
              <h1 className="h3 mb-3">Bring People Together With EventSphere</h1>
              <p className="text-muted mb-4">
                Discover, create, and manage events with ease. Whether you're hosting a
                workshop, organizing a meetup, or planning a conference, EventSphere provides
                the tools to make it simple and delightful.
              </p>
              <div className="d-flex gap-2">
                <Link to="/events" className="btn btn-primary">Explore Events</Link>
                <Link to="/contact" className="btn btn-outline-secondary">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card cardReset h-100 overflow-hidden">
            <div className="card-body p-4 p-md-5 d-grid gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src={logo} alt="EventSphere logo" height={40} width={40} />
                <div>
                  <div className="fw-semibold">Modern. Simple. Fast.</div>
                  <div className="text-muted small">Built for communities and creators.</div>
                </div>
              </div>
              <div className="ratio ratio-16x9 rounded-3 shadow-sm" style={{ backgroundColor: 'rgba(var(--brand-primary-rgb), .08)' }}>
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=60"
                  alt="People attending a tech event"
                  className="w-100 h-100 rounded-3"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div className="row row-cols-2 g-3">
                {[
                  { icon: 'calendar-event', label: 'Plan' },
                  { icon: 'people', label: 'Gather' },
                  { icon: 'megaphone', label: 'Promote' },
                  { icon: 'geo-alt', label: 'Discover' },
                ].map((f, i) => (
                  <div key={i} className="col">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(var(--brand-primary-rgb), .06)' }}>
                      <span className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 40, height: 40, background: 'rgba(var(--brand-primary-rgb), .12)', color: 'rgb(var(--brand-primary-rgb))' }}>
                        <i className={`bi bi-${f.icon}`}></i>
                      </span>
                      <span className="fw-medium">{f.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {[
          { value: '350+', label: 'Attendees engaged' },
          { value: '80+', label: 'Events created' },
          { value: '12+', label: 'Cities represented' },
          { value: '99.5%', label: 'Uptime during demos' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="card cardReset h-100 text-center">
              <div className="card-body p-4">
                <div className="display-6 fw-bold" style={{ color: 'rgb(var(--brand-primary-rgb))' }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card cardReset mb-4 mb-md-5">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 mb-3">Meet the Team</h2>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="text-center p-4 border rounded-3 h-100">
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src="https://api.dicebear.com/9.x/initials/png?seed=Thathsara%20Abayawardana&backgroundType=gradientLinear&radius=50"
                    alt="Thathsara Abayawardana avatar"
                    width={96}
                    height={96}
                    className="rounded-circle shadow-sm"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <div className="fw-semibold">Thathsara Abayawardana</div>
                <div className="text-muted">Founder</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4 mb-md-5">
        <div className="col-12 col-lg-6">
          <div className="card cardReset h-100">
            <div className="card-body p-4 p-md-5">
              <h2 className="h5 mb-2">Our Mission</h2>
              <p className="text-muted mb-0">
                Empower communities by making event discovery seamless and event management effortless. We focus on
                clarity, speed, and a delightful user experience.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card cardReset h-100">
            <div className="card-body p-4 p-md-5">
              <h2 className="h5 mb-2">Our Story</h2>
              <p className="text-muted mb-0">
                Born from countless meetups and hack nights, EventSphere is inspired by platforms like Eventbrite and
                Meetup, refined into a focused, modern experience for creators and attendees alike.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card cardReset mb-4 mb-md-5">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 mb-3">Moments From Events</h2>
          <div className="row g-3 g-md-4">
            {[
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=60',
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=60',
              'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=60',
            ].map((src, i) => (
              <div key={i} className="col-12 col-md-4">
                <div className="rounded-3 overflow-hidden shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,.04)' }}>
                  <img src={src} alt={`Event highlight ${i + 1}`} className="w-100 h-100" style={{ objectFit: 'cover' }} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {[
          { icon: 'search', title: 'Powerful Search', desc: 'Filter by category, date, or location to find the right event fast.' },
          { icon: 'bookmark-check', title: 'Easy Publishing', desc: 'Create and manage events with streamlined tools that save time.' },
          { icon: 'smartwatch', title: 'Mobile Ready', desc: 'A responsive experience that looks great on any device.' },
          { icon: 'shield-check', title: 'Secure by Design', desc: 'Best practices for authentication and data protection.' },
        ].map((f, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <div className="card cardReset h-100">
              <div className="card-body p-4 d-grid gap-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded" style={{ width: 44, height: 44, background: 'rgba(var(--brand-primary-rgb), .1)', color: 'rgb(var(--brand-primary-rgb))' }}>
                  <i className={`bi bi-${f.icon}`}></i>
                </span>
                <div className="fw-semibold">{f.title}</div>
                <div className="text-muted small">{f.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card cardReset mb-4 mb-md-5">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 mb-3">How It Works</h2>
          <div className="row g-3 g-md-4">
            {[
              { step: 1, title: 'Create', desc: 'Publish your event with details, images, and tickets.' },
              { step: 2, title: 'Share', desc: 'Promote across channels and reach your audience.' },
              { step: 3, title: 'Host', desc: 'Check-in attendees and run a smooth event.' },
              { step: 4, title: 'Grow', desc: 'Analyze performance and plan your next one.' },
            ].map((s, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-3">
                <div className="h-100 p-3 border rounded-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge rounded-pill text-bg-primary">{s.step}</span>
                    <span className="fw-semibold">{s.title}</span>
                  </div>
                  <div className="text-muted small">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card cardReset">
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <div className="h5 mb-1">Ready to host or discover your next event?</div>
            <div className="text-muted">Join the community and make something memorable.</div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
            <Link to="/contact" className="btn btn-outline-secondary">Talk to Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
