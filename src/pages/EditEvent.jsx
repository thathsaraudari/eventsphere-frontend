import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import styles from './css/EditEvent.module.css'

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
  const [statusFilter, setStatusFilter] = useState('all')

  const CATEGORY_OPTIONS = [
    'Tech','Business','Career & Networking','Education & Learning','Language & Culture','Music','Movies & Film','Arts','Book Clubs','Dance','Fitness','Health & Wellness','Sports & Recreation','Outdoors & Adventure','Games','Hobbies & Crafts','Photography','Food & Drink','Social','LGBTQ+','Parents & Family','Pets','Religion & Beliefs','Sci-Fi & Fantasy','Writing','Fashion & Beauty','Startups & Entrepreneurship','Support & Community'
  ]

  const isOnline = useMemo(() => eventMode !== 'Inperson', [eventMode])

  useEffect(() => {
    let ignore = false
    async function load() {
      setStatus('loading')
      setError('')
      try {
        const [{ data: event }, { data: participants }] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/events/${id}/participants`).catch(() => ({ data: [] }))
        ])
        if (ignore) return
        setTitle(event?.title || '')
        setDescription(event?.description || '')
        setEventMode(event?.eventMode || 'Inperson')
        setCategory(event?.category || '')
        setStartAt(event?.startAt ? toLocalInput(event.startAt) : '')
        setEndAt(event?.endAt ? toLocalInput(event.endAt) : '')
        setCoverUrl(event?.coverUrl || '')
        setPriceAmount(event?.price?.amount ?? 0)
        setPriceCurrency(event?.price?.currency || 'EUR')
        setCapacity(event?.capacity?.number ?? 0)
        setAddress(event?.location?.address || '')
        setCity(event?.location?.city || '')
        setPostCode(event?.location?.postCode || '')
        setCountry(event?.location?.country || '')
        setParticipants(Array.isArray(participants) ? participants : [])
        setStatus('ready')
      } catch (e) {
        if (!ignore) {
          setError('Failed to load event')
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
      // set the navigation state to indicate we come from "hosting" tab of MyEvents page
      navigate(`/events/${id}`, { state: { from: { name: 'myevents', tab: 'hosting' } } })
    } catch (e) {
      setStatus('ready')
      setError('Failed to save changes')
    }
  }

  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>Loading...</div>
        </div>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Link to="/myevents" className={styles.backlink}>&larr; Back</Link>
          <div className={styles.alert} style={{ marginTop: 12 }}>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHead}>
          <h1 className={styles.title}>Edit Event</h1>
          <Link to={`/events/${id}`} className={styles.backlink}>Cancel</Link>
        </div>

        {error && <div className={styles.alert}>{error}</div>}

        <div className={styles.layout}>
          <div>
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
                <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
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

            {eventMode === 'Inperson' && (
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

            <div className={styles.actions}>
              <button className={styles.btnPrimary} disabled={status === 'saving'} type="submit">
                {status === 'saving' ? 'Saving...' : 'Save changes'}
              </button>
              <Link to={`/events/${id}`} className={styles.btnGhost}>Cancel</Link>
            </div>
            </form>
          </div>

          <aside>
            <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>Participants</div>
              <span style={{ background: '#e5e7eb', borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>{participants.length}</span>
            </div>
            {participants.length === 0 && (
              <div className={styles.muted}>No participants yet.</div>
            )}
            {participants.length > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div className={styles.muted} style={{ fontSize: 12 }}>Filter by status</div>
                  <select
                    className={styles.select}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ maxWidth: 180 }}
                  >
                    <option value="all">All</option>
                    <option value="reserved">Reserved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </>
            )}
            {participants.length > 0 && (
              <div style={{ display: 'grid', gap: 8 }}>
                <div className={styles.listHeader}>
                  <div>Name</div>
                  <div>Email</div>
                  <div>Status</div>
                </div>
                  {(
                    (() => {
                      const norm = (s) => String(s || '').toLowerCase()
                      const filtered = participants.filter(p => {
                        if (statusFilter === 'all') return true
                        const st = norm(p.status)
                        if (statusFilter === 'reserved') return st === 'reserved'
                        if (statusFilter === 'cancelled') return st === 'cancelled' || st === 'canceled'
                        return true
                      })
                      return filtered
                    })()
                  ).map((participant) => (
                    <div key={participant.email} className={styles.listRow}>
                      <div>{participant.firstName} {participant.lastName}</div>
                      <div className={styles.muted} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {participant.userId?.email || participant.email || participant.user?.email || '-'}
                      </div>
                      <div style={{ textTransform: 'capitalize' }}>{participant.status || 'reserved'}</div>
                    </div>
                  ))}
              </div>
            )}
            </div>
          </aside>
        </div>
    </div>
  </div>
  )
}

