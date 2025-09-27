import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | ready | error | saving
  const [error, setError] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventMode, setEventMode] = useState('Inperson')
  const [category, setCategory] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [priceAmount, setPriceAmount] = useState(0)
  const [priceCurrency, setPriceCurrency] = useState('EUR')
  const [capacity, setCapacity] = useState(50)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('')

  const [participants, setParticipants] = useState([])

  const CATEGORY_OPTIONS = [
    'Tech','Business','Career & Networking','Education & Learning','Language & Culture','Music','Movies & Film','Arts','Book Clubs','Dance','Fitness','Health & Wellness','Sports & Recreation','Outdoors & Adventure','Games','Hobbies & Crafts','Photography','Food & Drink','Social','LGBTQ+','Parents & Family','Pets','Religion & Beliefs','Sci‑Fi & Fantasy','Writing','Fashion & Beauty','Startups & Entrepreneurship','Support & Community'
  ]

  const isOnline = useMemo(() => eventMode !== 'Inperson', [eventMode])

  useEffect(() => {
    let ignore = false
    async function load() {
      setStatus('loading')
      setError('')
      try {
        const [{ data: ev }, { data: ppl }] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/events/${id}/participants`).catch(() => ({ data: [] }))
        ])
        if (ignore) return
        setTitle(ev?.title || '')
        setDescription(ev?.description || '')
        setEventMode(ev?.eventMode || 'Inperson')
        setCategory(ev?.category || '')
        setStartAt(ev?.startAt ? toLocalInput(ev.startAt) : '')
        setEndAt(ev?.endAt ? toLocalInput(ev.endAt) : '')
        setCoverUrl(ev?.coverUrl || '')
        setPriceAmount(ev?.price?.amount ?? 0)
        setPriceCurrency(ev?.price?.currency || 'EUR')
        setCapacity(ev?.capacity?.number ?? 0)
        setAddress(ev?.location?.address || '')
        setCity(ev?.location?.city || '')
        setPostCode(ev?.location?.postCode || '')
        setCountry(ev?.location?.country || '')
        setParticipants(Array.isArray(ppl) ? ppl : (ppl?.list || []))
        setStatus('ready')
      } catch (e) {
        if (!ignore) {
          setError(e?.response?.data?.message || e.message || 'Failed to load event')
          setStatus('error')
        }
      }
    }
    load()
    return () => { ignore = true }
  }, [id])

  function toLocalInput(iso) {
    try {
      const d = new Date(iso)
      const pad = (n) => String(n).padStart(2, '0')
      const yyyy = d.getFullYear()
      const mm = pad(d.getMonth() + 1)
      const dd = pad(d.getDate())
      const hh = pad(d.getHours())
      const mi = pad(d.getMinutes())
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
    } catch { return '' }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Title is required')
    if (!startAt || !endAt) return setError('Start and end date/time are required')
    if (new Date(endAt) <= new Date(startAt)) return setError('End time must be after start time')
    setStatus('saving')
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventMode,
        category: category || undefined,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        coverUrl: coverUrl || undefined,
        price: { amount: Number(priceAmount) || 0, currency: priceCurrency || 'EUR' },
        capacity: { number: Number(capacity) || 0 },
        location: isOnline ? undefined : {
          address: address || undefined,
          city: city || undefined,
          postCode: postCode || undefined,
          country: country || undefined,
        }
      }
      await api.patch(`/api/events/${id}`, payload)
      navigate(`/events/${id}`)
    } catch (e) {
      setStatus('ready')
      setError(e?.response?.data?.message || e.message || 'Failed to save changes')
    }
  }

  if (status === 'loading') {
    return (
      <div className="container py-4"><div className="card p-3">Loading…</div></div>
    )
  }
  if (status === 'error') {
    return (
      <div className="container py-4">
        <Link to="/myevents">&larr; Back</Link>
        <div className="alert alert-danger mt-3">{error}</div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Edit Event</h1>
        <Link to={`/events/${id}`} className="btn btn-link">Cancel</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <form onSubmit={onSubmit} className="card p-3">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Title</label>
                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={6} value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Mode</label>
                <select className="form-select" value={eventMode} onChange={e => setEventMode(e.target.value)}>
                  <option value="Inperson">In person</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Cover Image URL</label>
                <input className="form-control" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Starts at</label>
                <input type="datetime-local" className="form-control" value={startAt} onChange={e => setStartAt(e.target.value)} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Ends at</label>
                <input type="datetime-local" className="form-control" value={endAt} onChange={e => setEndAt(e.target.value)} required />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Price amount</label>
                <input type="number" min="0" step="0.01" className="form-control" value={priceAmount} onChange={e => setPriceAmount(e.target.value)} />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label">Currency</label>
                <select className="form-select" value={priceCurrency} onChange={e => setPriceCurrency(e.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Capacity</label>
                <input type="number" min="1" step="1" className="form-control" value={capacity} onChange={e => setCapacity(e.target.value)} />
              </div>

              {eventMode === 'Inperson' && (
                <>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">City</label>
                    <input className="form-control" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Postal code</label>
                    <input className="form-control" value={postCode} onChange={e => setPostCode(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Country</label>
                    <input className="form-control" value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                </>
              )}
            </div>

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" disabled={status === 'saving'} type="submit">
                {status === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
              <Link to={`/events/${id}`} className="btn btn-outline-secondary">Cancel</Link>
            </div>
          </form>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 m-0">Participants</h2>
              <span className="badge bg-secondary">{participants.length}</span>
            </div>
            {participants.length === 0 && (
              <div className="text-muted">No participants yet.</div>
            )}
            {participants.length > 0 && (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p) => (
                      <tr key={p._id || p.id || `${p.userId?._id || p.email}-rsvp`}>
                        <td>{p.userId?.name || p.name || p.user?.name || '—'}</td>
                        <td>{p.userId?.email || p.email || p.user?.email || '—'}</td>
                        <td>{p.status || 'reserved'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

