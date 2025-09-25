// src/pages/EventDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { formatDateRange, formatPrice, addressText, mapLink } from '../utils/eventHelpers';
import styles from '../pages/css/EventDetails.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';


export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      setStatus('loading');
      setError('');
      try {
        const { data } = await axios.get(`${API_BASE}/events/${id}`, { withCredentials: true });
          setEvent(data);
          setStatus('done');
      } catch (err) {
        const msgMessage = 'Could not load event';
        setError(msgMessage);
        setStatus('error');
      }
    }
    fetchEvent();
  }, [id]);

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
    );
  }

  const dateLine = formatDateRange(event.startAt, event.endAt);
  const price = formatPrice(event.price);
  const addr = addressText(event.location);
  const mapsUrl = mapLink(event.location);
  const capacity = event.capacity.number;
  const left = event.capacity.seatsRemaining;

  return (
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
            <h1 className={styles.title}>{event.title}</h1>
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
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              
              <label className={styles.btnPrimary}>
                {event.eventMode === 'Inperson' ? 'Attend in person' : 'Attend online'}
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>

  </div>
);
}
