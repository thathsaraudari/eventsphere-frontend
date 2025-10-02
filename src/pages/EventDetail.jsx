// src/pages/EventDetail.jsx
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/client.js'
import { useAuth } from '../context/authContext.jsx'

import { formatDateRange, formatPrice, addressText, mapLink } from '../utils/eventHelpers'
import styles from '../pages/css/EventDetails.module.css'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAuth()

  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState('loading') // loading | done | error
  const [error, setError] = useState('')

  const [isRsvped, setIsRsvped] = useState(false)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [rsvpError, setRsvpError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let ignore = false
    async function fetchEvent() {
      setStatus('loading')
      setError('')
      try {
        const { data } = await api.get(`/api/events/${id}`)
        if (ignore) return
        setEvent(data)
        setStatus('done')
      } catch (e) {
        if (ignore) return
        setError('Could not load event')
        setStatus('error')
      }
    }
    fetchEvent()
    return () => { ignore = true }
  }, [id])

  useEffect(() => {
    let ignore = false
    async function checkRsvp() {
      if (!token || !id) return
      try {
        const { data } = await api.get(`/api/my-events/attending/${id}`)
        if (ignore) return
        setIsRsvped(data?.status === 'reserved')
      } catch {
        console.log('Could not fetch RSVP status')
      }
    }
    checkRsvp()
    return () => { ignore = true }
  }, [token, id])

  useEffect(() => {
    let ignore = false
    async function checkSaved() {
      if (!token || !id) return
      try {
        const { data } = await api.get('/api/saved-events/')
        if (ignore) return
        const list = data;
        const exists = list.some((entry) => {
          const event = entry.eventId;
          const eventId = event._id;
          return String(eventId) === String(id)
        })
        setIsSaved(exists)
      } catch {
        console.log('Could not fetch saved status')
      }
    }
    checkSaved()
    return () => { ignore = true }
  }, [token, id])

  const seatsLeft = event?.capacity?.seatsRemaining ?? null

  async function handleToggleRsvp() {
    if (!token) {
      return navigate('/login', { replace: true, state: { from: location } })
    }
    if (!id) return
    setRsvpError('')
    setRsvpLoading(true)
    try {
      const { data } = await api.post(`/api/my-events/attending/${id}/rsvp/toggle`);
      if(data?.success) {
        setIsRsvped(data.status === 'reserved')
        // Update seats remaining in UI
        event.capacity.seatsRemaining = data.seatsRemaining
        setEvent({ ...event })
      } else {
        setRsvpError('Failed to update RSVP')
      }
    } catch (e) {
      setRsvpError(e?.response?.data?.message || e.message || 'Failed to update RSVP')
    } finally {
      setRsvpLoading(false)
    }
  }

  function handleRsvpClick() {
    if (!token) {
      return navigate('/login', { replace: true, state: { from: location } })
    }
    if (isRsvped) {
      // For cancellation, open confirmation dialog
      return setConfirmCancelOpen(true)
    }
    // For new RSVP, open confirmation dialog
    setConfirmOpen(true)
  }

  async function handleToggleSave() {
    if (!token) {
      return navigate('/login', { replace: true, state: { from: location } })
    }
    if (!id) return
    setSaveError('')
    setSaveLoading(true)
    try {
      if (isSaved) {
        await api.delete(`/api/saved-events/${id}`)
        setIsSaved(false)
      } else {
        await api.post(`/api/saved-events/${id}`)
        setIsSaved(true)
      }
    } catch (e) {
      setSaveError(e?.response?.data?.message || e.message || 'Failed to update saved events')
    } finally {
      setSaveLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
        <Link to="/">&larr; Back</Link>
        <div style={{ marginTop: 16, padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
          Loading event…
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
        <Link to="/">&larr; Back</Link>
        <h1 style={{ marginTop: 12 }}>Event not available</h1>
        <p style={{ color: 'crimson' }}>{error}</p>
      </div>
    )
  }

  const dateLine = formatDateRange(event.startAt, event.endAt)
  const price = formatPrice(event.price)
  const addr = addressText(event.location)
  const mapsUrl = mapLink(event.location)
  const capacity = event.capacity.number
  const left = event.capacity.seatsRemaining

  return (
  <>
  <div className={styles.eventPage}>
    <div className={styles.container}>
      <Link to="/" className={styles.backlink}>&larr; Back to events</Link>
    </div>

    {event.coverUrl && (
      <div className={styles.container}>
        <div className={styles.cover}>
          <img
            className={styles.coverImg}
            src={event.coverUrl}
            alt={event.title || 'Event cover'}
            loading="lazy"
          />
        </div>
      </div>
    )}

    <div className={styles.container}>
      <div className={styles.grid}>
        <div>
          <div className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h1 className={styles.title} style={{ margin: 0 }}>{event.title}</h1>
              <button
                type="button"
                onClick={handleToggleSave}
                aria-label={isSaved ? 'Unsave' : 'Save'}
                title={isSaved ? 'Unsave' : 'Save'}
                disabled={saveLoading}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: 28, lineHeight: 1, color: isSaved ? '#dc3545' : '#6c757d' }}
              >
                {saveLoading ? '…' : (isSaved ? '♥' : '♡')}
              </button>
            </div>
            {saveError && (
              <div style={{ color: 'crimson', fontSize: 14, marginTop: 4 }}>{saveError}</div>
            )}
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{event.description}</p>
          </div>
        </div>

        <aside>
          <div className={styles.sidebar}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{event.title}</div>

            <div style={{ display: 'grid', gap: 8, color: '#374151', marginBottom: 8 }}>
              <div>{dateLine}</div>

              <div>
                {event.eventMode === 'Inperson' && addr && (
                  <>
                    <div>{addr}</div>
                    {mapsUrl && (
                      <div style={{ marginTop: 4 }}>
                        <a href={mapsUrl} target="_blank" className={styles.backlink}>
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </>
                )}
                {event.eventMode && event.eventMode !== 'Inperson' && <div>Online event</div>}
              </div>

              <div><strong>{price}</strong></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Total capacity: </span>
                  <strong>{event.capacity.number}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Seats remaining: </span>
                  <strong>{seatsLeft}</strong>
                </div>
              </div>
            </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rsvpError && (
                  <div style={{ color: 'crimson', fontSize: 14 }}>{rsvpError}</div>
                )}
                <button
                  className={isRsvped ? styles.btnGhost : styles.btnPrimary}
                  onClick={handleRsvpClick}
                  disabled={rsvpLoading || (!isRsvped && (typeof seatsLeft === 'number' && seatsLeft <= 0))}
                  type="button"
                >
                  {rsvpLoading
                    ? (isRsvped ? 'Updating…' : 'Submitting…')
                    : (isRsvped ? 'Cancel RSVP' : 'RSVP to Event')}
                </button>

              </div>
            </div>
          </aside>
        </div>
      </div>

  </div>
  {event && (
    <ConfirmDialog
      open={confirmOpen}
      title="Confirm RSVP"
      confirmText={rsvpLoading ? (isRsvped ? 'Updating…' : 'Submitting…') : 'Confirm RSVP'}
      cancelText="Close"
      confirmDisabled={rsvpLoading || (typeof seatsLeft === 'number' && seatsLeft <= 0)}
      variant="success"
      onCancel={() => setConfirmOpen(false)}
      onConfirm={async () => {
        await handleToggleRsvp()
        setConfirmOpen(false)
      }}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{event.title}</div>
        <div style={{ color: '#374151' }}>{formatDateRange(event.startAt, event.endAt)}</div>
        {event.eventMode === 'Inperson' && (
          <div style={{ color: '#4b5563' }}>{addressText(event.location)}</div>
        )}
        <div>
          <span style={{ color: '#6b7280' }}>Price: </span>
          <strong>{formatPrice(event.price)}</strong>
        </div>
        <div>
          <span style={{ color: '#6b7280' }}>Seats remaining: </span>
          <strong>{seatsLeft}</strong>
        </div>
        {!isRsvped && typeof seatsLeft === 'number' && seatsLeft <= 0 && (
          <div style={{ color: 'crimson' }}>This event is full. RSVP is disabled.</div>
        )}
        <div style={{ color: '#374151' }}>
          Do you want to RSVP to this event?
        </div>
        {rsvpError && (
          <div style={{ color: 'crimson', fontSize: 14 }}>{rsvpError}</div>
        )}
      </div>
    </ConfirmDialog>
  )}
  {event && (
    <ConfirmDialog
      open={confirmCancelOpen}
      title="Cancel RSVP"
      confirmText={rsvpLoading ? 'Cancelling…' : 'Confirm Cancel'}
      cancelText="Keep RSVP"
      confirmDisabled={rsvpLoading}
      variant="danger"
      onCancel={() => setConfirmCancelOpen(false)}
      onConfirm={async () => {
        await handleToggleRsvp()
        setConfirmCancelOpen(false)
      }}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{event.title}</div>
        <div style={{ color: '#374151' }}>{formatDateRange(event.startAt, event.endAt)}</div>
        <div>Are you sure you want to cancel your RSVP?</div>
        {rsvpError && (
          <div style={{ color: 'crimson', fontSize: 14 }}>{rsvpError}</div>
        )}
      </div>
    </ConfirmDialog>
  )}
  </>
  )
}
