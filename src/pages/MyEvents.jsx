import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./css/MyEvents.module.css";
import api from "../api/client.js";
import { formatDateRange, formatPrice } from '../utils/eventHelpers';
import ConfirmDialog from "../components/ConfirmDialog.jsx";

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
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmUnsaveId, setConfirmUnsaveId] = useState(null);
  const [unsavingId, setUnsavingId] = useState(null);

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

  async function handleUnsave(id) {
    if (!id) return;
    setUnsavingId(id);
    try {
      await api.delete(`/api/saved-events/${id}`);
      setSavedEvents((prev) => prev.filter((entry) => {
        const event = entry?.eventId || entry;
        const eventId = event?._id || event?.id;
        return String(eventId) !== String(id);
      }));
    } catch (e) {
      console.error('Failed to unsave event', e);
    } finally {
      setUnsavingId(null);
    }
  }

  function openEventDetail(id, e) {
    if (!id) return;
    if (e) { e.preventDefault(); e.stopPropagation(); }
    navigate(`/events/${id}`, { state: { from: { name: 'myevents', tab: activeTab } } });
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
                {rsvps.map((rsvpEntry) => {
                  const event = rsvpEntry.eventId;
                  if (!event) return null;
                  return (
                    <article
                      key={rsvpEntry._id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => openEventDetail(event._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.mediaWrap}>
                        <img
                          src={event.coverUrl}
                          alt={event.title}
                          className={styles.cover}
                          loading="lazy"
                        />
                        <span className={styles.badge}>
                          {event.eventMode === "Inperson" ? "In person" : "Online"}
                        </span>
                      </div>

                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>
                          <Link to={`/events/${event._id}`} state={{ from: { name: 'myevents', tab: activeTab } }} className={styles.titleLink}>
                            {event.title}
                          </Link>
                        </h3>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(event.startAt, event.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {event?.location?.city || "—"}
                              {event?.location?.country ? `, ${event.location.country}` : ""}
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Price</span>
                            <span className={styles.metaVal}>{formatPrice(event.price)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Seats</span>
                            <span className={styles.metaVal}>
                              {event?.capacity?.seatsRemaining ?? "—"} left / {event?.capacity?.number ?? "—"} total
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>RSVP</span>
                            <span className={`${styles.status} ${styles[`status_${rsvpEntry.status}`]}`}>{rsvpEntry.status}</span>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={(e) => { e.stopPropagation(); setConfirmCancelId(event._id); }}
                            disabled={!!cancelingIds[event._id]}
                          >
                            {cancelingIds[event._id] ? 'Cancelling...' : 'Cancel RSVP'}
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
                {savedEvents.map((entry) => {
                  const event = entry?.eventId || entry;
                  if (!event) return null;
                  const id = event._id || event.id;
                  return (
                    <article
                      key={id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => openEventDetail(id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.mediaWrap}>
                        <img
                          src={event.coverUrl}
                          alt={event.title}
                          className={styles.cover}
                          loading="lazy"
                        />
                        <span className={styles.badge}>
                          {event.eventMode === "Inperson" ? "In person" : "Online"}
                        </span>
                      </div>

                      <div className={styles.content}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <h3 className={styles.cardTitle} style={{ margin: 0 }}>
                            <Link to={`/events/${id}`} state={{ from: { name: 'myevents', tab: activeTab } }} className={styles.titleLink} onClick={(e) => e.stopPropagation()}>
                              {event.title}
                            </Link>
                          </h3>
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', padding: 0, fontSize: '24px', lineHeight: 1, color: '#dc3545' }}
                            aria-label="Unsave"
                            title="Unsave"
                            onClick={(e) => { e.stopPropagation(); setConfirmUnsaveId(id); }}
                          >
                            ♥
                          </button>
                        </div>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(event.startAt, event.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {event?.location?.city || "?"}
                              {event?.location?.country ? `, ${event.location.country}` : ""}
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Price</span>
                            <span className={styles.metaVal}>{formatPrice(event.price)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Seats</span>
                            <span className={styles.metaVal}>
                              {event?.capacity?.seatsRemaining ?? "?"} left / {event?.capacity?.number ?? "?"} total
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
                {hosted.map((event) => {
                  if (!event) return null;
                  return (
                    <article
                      key={event._id}
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => openEventDetail(event._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.mediaWrap}>
                        <img
                          src={event.coverUrl}
                          alt={event.title}
                          className={styles.cover}
                          loading="lazy"
                        />
                        <span className={styles.badge}>
                          {event.eventMode === "Inperson" ? "In person" : "Online"}
                        </span>
                      </div>

                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>
                          {event.title}
                        </h3>

                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>When</span>
                            <span className={styles.metaVal}>{formatDateRange(event.startAt, event.endAt)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Where</span>
                            <span className={styles.metaVal}>
                              {event?.location?.city || "—"}
                              {event?.location?.country ? `, ${event.location.country}` : ""}
                            </span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Price</span>
                            <span className={styles.metaVal}>{formatPrice(event.price)}</span>
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.metaKey}>Seats</span>
                            <span className={styles.metaVal}>
                              {event?.capacity?.seatsRemaining ?? "—"} left / {event?.capacity?.number ?? "—"} total
                            </span>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <Link
                            to={`/events/${event._id}/edit`}
                            className="btn btn-outline-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Edit event
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={(e) => { e.stopPropagation(); openDeleteConfirmPopup(event); }}
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

      {confirmCancelId && (
        <ConfirmDialog
          open={!!confirmCancelId}
          title="Cancel RSVP"
          confirmText={cancelingIds[confirmCancelId] ? 'Cancelling…' : 'Confirm Cancel'}
          cancelText="Keep RSVP"
          confirmDisabled={!!cancelingIds[confirmCancelId]}
          variant="danger"
          onCancel={() => setConfirmCancelId(null)}
          onConfirm={async () => {
            await handleCancelRsvp(confirmCancelId)
            setConfirmCancelId(null)
          }}
        >
          {(() => {
            const event = (rsvps || []).find(r => (r?.eventId?._id) === confirmCancelId)?.eventId
            if (!event) return <div>Are you sure you want to cancel your RSVP?</div>
            return (
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{event.title}</div>
                <div style={{ color: '#374151' }}>{formatDateRange(event.startAt, event.endAt)}</div>
                <div>Are you sure you want to cancel your RSVP?</div>
              </div>
            )
          })()}
        </ConfirmDialog>
      )}

      {confirmUnsaveId && (
        <ConfirmDialog
          open={!!confirmUnsaveId}
          title="Remove from saved?"
          confirmText={unsavingId === confirmUnsaveId ? 'Removing…' : 'Remove'}
          cancelText="Keep saved"
          confirmDisabled={unsavingId === confirmUnsaveId}
          variant="danger"
          onCancel={() => setConfirmUnsaveId(null)}
          onConfirm={async () => {
            await handleUnsave(confirmUnsaveId)
            setConfirmUnsaveId(null)
          }}
        >
          {(() => {
            const entry = (savedEvents || []).find(x => {
              const e = x?.eventId || x;
              const eid = e?._id || e?.id;
              return String(eid) === String(confirmUnsaveId);
            })
            const event = entry?.eventId || entry;
            if (!event) return <div>Remove this event from your saved list?</div>
            return (
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{event.title}</div>
                <div style={{ color: '#374151' }}>{formatDateRange(event.startAt, event.endAt)}</div>
                <div>Remove this event from your saved list?</div>
              </div>
            )
          })()}
        </ConfirmDialog>
      )}
    </div>
  );
}

