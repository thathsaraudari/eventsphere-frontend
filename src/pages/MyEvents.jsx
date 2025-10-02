import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./css/MyEvents.module.css";
import api from "../api/client.js";
import { formatDateRange, formatPrice } from '../utils/eventHelpers';

export default function MyEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const t = (searchParams.get('tab') || '').toLowerCase();
    return t === 'hosting' ? 'hosting' : (t === 'saved' ? 'saved' : 'attending');
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState([]); 
  const [hosted, setHosted] = useState([]);
  const [cancelingIds, setCancelingIds] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMyEvents() {
      try {
        setLoading(true);
        setError("");
        if (activeTab === 'saved') {
          try {
            setSavedLoading(true);
            setSavedError("");
            const { data } = await api.get('/api/saved-events/');
            const list = data;
            if (!ignore) setSavedEvents(list);
          } catch (e) {
            if (!ignore) setSavedError('Failed to load saved events');
          } finally {
            if (!ignore) setSavedLoading(false);
          }
          return;
        }
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

  useEffect(() => {
    const t = (searchParams.get('tab') || '').toLowerCase();
    const next = t === 'hosting' ? 'hosting' : (t === 'saved' ? 'saved' : 'attending');
    if (next !== activeTab) setActiveTab(next);
  }, [searchParams]);

  useEffect(() => {
    const cur = (searchParams.get('tab') || '').toLowerCase();
    if (cur !== activeTab) {
      const next = new URLSearchParams(searchParams);
      next.set('tab', activeTab);
      setSearchParams(next, { replace: true });
    }
  }, [activeTab, searchParams, setSearchParams]);

  async function handleCancelRsvp(eventId) {
    if (!eventId) return;
    setCancelingIds((prev) => ({ ...prev, [eventId]: true }));
    try {
      const { data } = await api.post(`/api/my-events/attending/${eventId}/rsvp/toggle`);
      if (data?.success) {
        setRsvps((prev) => prev.filter((r) => r?.eventId?._id !== eventId));
      }
    } catch (e) {
      console.error('Failed to cancel RSVP', e);
    } finally {
      setCancelingIds((prev) => ({ ...prev, [eventId]: false }));
    }
  }

  function openDeleteConfirmPopup(event) {
    setDeleteTarget(event);
  }

  function closeDeleteConfirm() {
    if (deleting) return;
    setDeleteTarget(null);
  }

  async function handleDeleteEvent() {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/api/events/${deleteTarget._id}`);
      setHosted((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (e) {
      console.error('Failed to delete event', e);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className="d-flex align-items-center justify-content-between" style={{ gap: 12, marginBottom: 12 }}>
        <h2 className={styles.title}>My Events</h2>
        <Link to="/events/new" className="btn btn-primary">Create event</Link>
      </div>

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

        <button
          role="tab"
          aria-selected={activeTab === "saved"}
          aria-controls="panel-saved"
          id="tab-saved"
          className={`${styles.tab} ${activeTab === "saved" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("saved")}
          type="button"
        >
          Saved
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
                    <article
                      key={r._id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/events/${ev._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
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
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={(e) => { e.stopPropagation(); handleCancelRsvp(ev._id); }}
                            disabled={!!cancelingIds[ev._id]}
                          >
                            {cancelingIds[ev._id] ? 'Cancelling...' : 'Cancel RSVP'}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "saved" && (
          <section
            role="tabpanel"
            id="panel-saved"
            aria-labelledby="tab-saved"
            className={styles.panel}
          >
            {savedError && (
              <div className={styles.alert}>
                <strong>Couldn’t load saved events.</strong>
                <div className={styles.alertMsg}>{savedError}</div>
              </div>
            )}

            {savedLoading && (
              <div className={styles.grid}>
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
                <div className={styles.cardSkeleton} />
              </div>
            )}

            {!savedLoading && !savedError && (!savedEvents || savedEvents.length === 0) && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>☆</div>
                <h2 className={styles.emptyTitle}>No saved events yet</h2>
                <p className={styles.emptyText}>
                  Tap “Save” on any event to add it here.
                </p>
              </div>
            )}

            {!savedLoading && !savedError && savedEvents && savedEvents.length > 0 && (
              <div className={styles.grid}>
                {savedEvents.map((ev) => {
                  if (!ev) return null;
                  const id = ev._id || ev.id;
                  return (
                    <article
                      key={id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/events/${id}`)}
                      style={{ cursor: 'pointer' }}
                    >
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <h3 className={styles.cardTitle} style={{ margin: 0 }}>
                            <Link to={`/events/${id}`} className={styles.titleLink} onClick={(e) => e.stopPropagation()}>
                              {ev.title}
                            </Link>
                          </h3>
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', padding: 0, fontSize: '24px', lineHeight: 1, color: '#dc3545' }}
                            aria-label="Unsave"
                            title="Unsave"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await api.delete(`/api/saved-events/${id}`);
                                setSavedEvents((prev) => prev.filter((x) => (x?._id ?? x?.id) !== id));
                              } catch (_) {}
                            }}
                          >
                            ♥
                          </button>
                        </div>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(ev.startAt, ev.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {ev?.location?.city || "?"}
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
                              {ev?.capacity?.seatsRemaining ?? "?"} left / {ev?.capacity?.number ?? "?"} total
                            </span>
                          </div>
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
            id="panel-hosting"
            aria-labelledby="tab-hosting"
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
                    <article
                      key={h._id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/events/${ev._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
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
                          {ev.title}
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
                        </div>

                        <div className={styles.actions}>
                          <Link
                            to={`/events/${ev._id}/edit`}
                            className="btn btn-outline-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Edit event
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={(e) => { e.stopPropagation(); openDeleteConfirmPopup(ev); }}
                          >
                            Delete
                          </button>
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
      {deleteTarget && (
        <div
          className={styles.confirmOverlay}
          role="dialog"
          aria-modal="true"
          onClick={closeDeleteConfirm}
        >
          <div
            className={styles.confirmBox}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmTitle}>Delete event?</h3>
            <p className={styles.confirmText}>
              Are you sure you want to delete "{deleteTarget.title}"? This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancel}
                onClick={closeDeleteConfirm}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmDelete}
                onClick={handleDeleteEvent}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

