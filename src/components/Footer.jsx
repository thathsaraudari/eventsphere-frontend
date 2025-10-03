import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-top bg-white">
      <div className="container py-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2 text-muted">
          <span className="fw-semibold">EventSphere</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <nav className="d-flex align-items-center gap-3">
          <Link to="/about" className="link-secondary text-decoration-none">About Us</Link>
          <Link to="/contact" className="link-secondary text-decoration-none">Contact Us</Link>
        </nav>

        <div className="d-flex align-items-center gap-3">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="text-secondary fs-5"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-secondary fs-5"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="https://www.twitter.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="text-secondary fs-5"
          >
            <i className="bi bi-twitter-x"></i>
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-secondary fs-5"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

