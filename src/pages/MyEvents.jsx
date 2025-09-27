import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./css/MyEvents.module.css";
import api from "../api/client.js";
import { formatDateRange, formatPrice } from '../utils/eventHelpers';

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("attending"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState([]); 
  const [hosted, setHosted] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadMyEvents() {
      try {
        setLoading(true);
        setError("");
        const endpoint = activeTab === "hosting" ? "/api/my-events/hosting" : "/api/my-events/attending";
        const { data } = await api.get(endpoint);
        if (ignore) return;
        if (activeTab === "hosting") {
          setHosted(Array.isArray(data) ? data : []);
        } else {
          setRsvps(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!ignore) {
          const baseMsg = activeTab === "hosting" ? "Failed to load hosted events" : "Failed to load attending events";
          setError(e?.response?.data?.message || e.message || baseMsg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadMyEvents();
    return () => { ignore = true; };
  }, [activeTab]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Events</h1>

      <div className={styles.tabs} role="tablist" aria-label="My events tabs">
        <button
          role="tab"
          aria-selected={activeTab === "attending"}
          aria-controls="panel-attending"
          id="tab-attending"
          className={`${styles.tab} ${activeTab === "attending" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("attending")}
          type="button"
        >
          Attending
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "hosting"}
          aria-controls="panel-hosting"
          id="tab-hosting"
          className={`${styles.tab} ${activeTab === "hosting" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("hosting")}
          type="button"
        >
          Hosting
        </button>
      </div>

      <div className={styles.panelWrap}>
        {activeTab === "attending" && (
          <section
            role="tabpanel"
            id="panel-attending"
            aria-labelledby="tab-attending"
            className={styles.panel}
          >

            {error && (
              <div className={styles.alert}>
                <strong>Couldn’t load events.</strong>
                <div className={styles.alertMsg}>{error}</div>
              </div>
            )}

            {loading && (
              <div className={styles.grid}>
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
              </div>
            )}

            {!loading && !error && rsvps.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <h2 className={styles.emptyTitle}>No attending events yet</h2>
                <p className={styles.emptyText}>
                  When you RSVP to an event, it will appear here.
                </p>
              </div>
            )}

            {!loading && !error && rsvps.length > 0 && (
              <div className={styles.grid}>
                {rsvps.map((r) => {
                  const ev = r.eventId;
                  if (!ev) return null;
                  return (
                    <article key={r._id} className={styles.card}>
                      <div className={styles.mediaWrap}>
                        <img
                          src={ev.coverUrl}
                          alt={ev.title}
                          className={styles.cover}
                          loading="lazy"
                        />
                        <span className={styles.badge}>
                          {ev.eventMode === "Inperson" ? "In person" : "Online"}
                        </span>
                      </div>

                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>
                          <Link to={`/events/${ev._id}`} className={styles.titleLink}>
                            {ev.title}
                          </Link>
                        </h3>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(ev.startAt, ev.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {ev?.location?.city || "—"}
                              {ev?.location?.country ? `, ${ev.location.country}` : ""}
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Price</span>
                            <span className={styles.metaVal}>{formatPrice(ev.price)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Seats</span>
                            <span className={styles.metaVal}>
                              {ev?.capacity?.seatsRemaining ?? "—"} left / {ev?.capacity?.number ?? "—"} total
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>RSVP</span>
                            <span className={`${styles.status} ${styles[`status_${r.status}`]}`}>{r.status}</span>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <Link to={`/events/${ev._id}`} className={styles.btnPrimary}>
                            View details
                          </Link>
                          <span className={styles.attendLabel}>
                            {ev.eventMode === "Inperson" ? "Attend in person" : "Attend online"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "hosting" && (
           <section
            role="tabpanel"
            id="panel-attending"
            aria-labelledby="tab-attending"
            className={styles.panel}
          >
            <div className={styles.actions} style={{ justifyContent: 'flex-end', marginBottom: 12 }}>
              <Link to="/events/new" className={styles.btnPrimary}>Create event</Link>
            </div>

            {error && (
              <div className={styles.alert}>
                <strong>Couldn’t load events.</strong>
                <div className={styles.alertMsg}>{error}</div>
              </div>
            )}

            {loading && (
              <div className={styles.grid}>
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
              </div>
            )}

            {!loading && !error && hosted.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <h2 className={styles.emptyTitle}>No hosted events yet</h2>
                <p className={styles.emptyText}>
                  Create an event and it will appear here.
                </p>
                <div style={{ marginTop: 12 }}>
                  <Link to="/events/new" className={styles.btnPrimary}>Create your first event</Link>
                </div>
              </div>
            )}

            {!loading && !error && hosted.length > 0 && (
              <div className={styles.grid}>
                {hosted.map((h) => {
                  const ev = h;
                  if (!ev) return null;
                  return (
                    <article key={h._id} className={styles.card}>
                      <div className={styles.mediaWrap}>
                        <img
                          src={ev.coverUrl}
                          alt={ev.title}
                          className={styles.cover}
                          loading="lazy"
                        />
                        <span className={styles.badge}>
                          {ev.eventMode === "Inperson" ? "In person" : "Online"}
                        </span>
                      </div>

                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>
                          <Link to={`/events/${ev._id}`} className={styles.titleLink}>
                            {ev.title}
                          </Link>
                        </h3>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(ev.startAt, ev.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {ev?.location?.city || "—"}
                              {ev?.location?.country ? `, ${ev.location.country}` : ""}
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Price</span>
                            <span className={styles.metaVal}>{formatPrice(ev.price)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Seats</span>
                            <span className={styles.metaVal}>
                              {ev?.capacity?.seatsRemaining ?? "—"} left / {ev?.capacity?.number ?? "—"} total
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>RSVP</span>
                            <span className={`${styles.status} ${styles[`status_${h.status}`]}`}>{h.status}</span>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <Link to={`/events/${ev._id}`} className={styles.btnPrimary}>
                            View details
                          </Link>
                          <span className={styles.attendLabel}>
                            {ev.eventMode === "Inperson" ? "Attend in person" : "Attend online"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

