import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [thanksOpen, setThanksOpen] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setThanksOpen(true)
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card cardReset">
            <div className="card-body p-4 p-md-5">
              <h1 className="h4 mb-3">Contact Us</h1>
              <p className="text-muted mb-4">We’d love to hear from you. Send us a message and we’ll get back to you soon.</p>

              <form className="d-grid gap-3" onSubmit={onSubmit}>
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="form-control"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    className="form-control"
                    placeholder="What’s this about?"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    className="form-control"
                    rows={6}
                    placeholder="Write your message here…"
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={thanksOpen}
        title="Thank you!"
        cancelText="Close"
        hideConfirm
        onCancel={() => setThanksOpen(false)}
      >
        <div>
          Thank you for contacting us. We received your message and will get back to you soon.
        </div>
      </ConfirmDialog>
    </div>
  )
}
