import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import styles from './css/CreateEvent.module.css'

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
    'Sci-Fi & Fantasy',
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
      if (id) navigate(`/events/${id}`, { state: { from: { name: 'myevents', tab: 'hosting' } } })
      else navigate('/myevents')
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHead}>
          <h1 className={styles.title}>Create Event</h1>
          <Link to="/myevents" className={styles.backlink}>Cancel</Link>
        </div>

      {error && <div className={styles.alert}>{error}</div>}

      <form onSubmit={onSubmit} className={`${styles.card} ${styles.form}`}>
        <div className={styles.row}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>Mode</label>
            <select className={styles.select} value={eventMode} onChange={e => setEventMode(e.target.value)}>
              <option value="Inperson">In person</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="" disabled>Select a category</option>
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Cover Image URL</label>
          <input className={styles.input} value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>Starts at</label>
            <input type="datetime-local" className={styles.input} value={startAt} onChange={e => setStartAt(e.target.value)} required />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Ends at</label>
            <input type="datetime-local" className={styles.input} value={endAt} onChange={e => setEndAt(e.target.value)} required />
          </div>
        </div>

        <div className={styles.grid3}>
          <div className={styles.row}>
            <label className={styles.label}>Price amount</label>
            <input type="number" min="0" step="0.01" className={styles.input} value={priceAmount} onChange={e => setPriceAmount(e.target.value)} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Currency</label>
            <select className={styles.select} value={priceCurrency} onChange={e => setPriceCurrency(e.target.value)}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Capacity</label>
            <input type="number" min="1" step="1" className={styles.input} value={capacity} onChange={e => setCapacity(e.target.value)} />
          </div>
        </div>

        {!isOnline && (
          <>
            <div className={styles.row}>
              <label className={styles.label}>Address</label>
              <input className={styles.input} value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className={styles.grid3}>
              <div className={styles.row}>
                <label className={styles.label}>City</label>
                <input className={styles.input} value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Postal code</label>
                <input className={styles.input} value={postCode} onChange={e => setPostCode(e.target.value)} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Country</label>
                <input className={styles.input} value={country} onChange={e => setCountry(e.target.value)} />
              </div>
            </div>
          </>
        )}

        <div className="d-flex gap-2 mt-3">
          <button className={styles.btnPrimary} disabled={submitting} type="submit">
            {submitting ? 'Creating...' : 'Create event'}
          </button>
          <Link to="/myevents" className={styles.btnGhost}>Cancel</Link>
        </div>
      </form>
    </div>
  </div>
  )
}


