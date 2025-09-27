import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

export default function CreateEvent() {
  const navigate = useNavigate()

  const CATEGORY_OPTIONS = [
    'Tech',
    'Business',
    'Career & Networking',
    'Education & Learning',
    'Language & Culture',
    'Music',
    'Movies & Film',
    'Arts',
    'Book Clubs',
    'Dance',
    'Fitness',
    'Health & Wellness',
    'Sports & Recreation',
    'Outdoors & Adventure',
    'Games',
    'Hobbies & Crafts',
    'Photography',
    'Food & Drink',
    'Social',
    'LGBTQ+',
    'Parents & Family',
    'Pets',
    'Religion & Beliefs',
    'Sci‑Fi & Fantasy',
    'Writing',
    'Fashion & Beauty',
    'Startups & Entrepreneurship',
    'Support & Community'
  ]

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
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOnline = useMemo(() => eventMode !== 'Inperson', [eventMode])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('Title is required')
    if (!startAt || !endAt) return setError('Start and end date/time are required')
    if (!category) return setError('Please select a category')
    if (new Date(endAt) <= new Date(startAt)) return setError('End time must be after start time')

    const payload = {
      title: title.trim(),
      description: description.trim(),
      eventMode,
      category,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      coverUrl: coverUrl || undefined,
      price: { amount: Number(priceAmount) || 0, currency: priceCurrency || 'EUR' },
      capacity: { number: Number(capacity) || 0 },
      location: isOnline
        ? undefined
        : {
            address: address || undefined,
            city: city || undefined,
            postCode: postCode || undefined,
            country: country || undefined,
          },
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/api/events', payload)
      const id = data?._id || data?.id
      if (id) navigate(`/events/${id}`)
      else navigate('/myevents')
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Create Event</h1>
        <Link to="/myevents" className="btn btn-link">Cancel</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit} className="card p-3">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Title</label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={5} value={description} onChange={e => setDescription(e.target.value)} />
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
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="" disabled>Select a category</option>
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

          {!isOnline && (
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
          <button className="btn btn-primary" disabled={submitting} type="submit">
            {submitting ? 'Creating…' : 'Create event'}
          </button>
          <Link to="/myevents" className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
