import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function About() {
  return (
    <div className="container py-4 py-md-5">
      {/* Hero */}
      <div className="row g-4 align-items-center justify-content-between mb-4 mb-md-5">
        <div className="col-12 col-lg-6">
          <div className="card cardReset h-100">
            <div className="card-body p-4 p-md-5">
              <span className="badge rounded-pill text-bg-light mb-2" style={{ border: '1px solid #e5e7eb' }}>About</span>
              <h1 className="h3 mb-3">Bring People Together With EventSphere</h1>
              <p className="text-muted mb-4">
                Discover, create, and manage events with ease. Whether you’re hosting a
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
          <div className="card cardReset h-100">
            <div className="card-body p-4 p-md-5 d-grid gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src={logo} alt="EventSphere logo" height={40} width={40} />
                <div>
                  <div className="fw-semibold">Modern. Simple. Fast.</div>
                  <div className="text-muted small">Built for communities and creators.</div>
                </div>
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

      {/* Stats */}
      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {[
          { value: '10k+', label: 'Attendees engaged' },
          { value: '2k+', label: 'Events published' },
          { value: '120+', label: 'Cities represented' },
          { value: '99.9%', label: 'Uptime & reliability' },
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

      {/* Mission & Story */}
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

      {/* Features */}
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

      {/* How it works */}
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

      {/* CTA */}
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
