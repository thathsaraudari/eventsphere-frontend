import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import SearchBar from "../components/SearchBar.jsx";
import { useAuth } from "../context/authContext.jsx";
import { formatDateRange } from "../utils/eventHelpers";
import styles from "./css/EventsList.module.css";

export default function EventsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [saveStates, setSaveStates] = useState({});
  const [savedIds, setSavedIds] = useState(new Set());
  const [savedInitLoaded, setSavedInitLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadSaved() {
      if (!token) {
        setSavedIds(new Set());
        setSavedInitLoaded(true);
        return;
      }
      try {
        const { data } = await api.get('/api/saved-events/');
        if (ignore) return;
        const list = data;
        const ids = new Set();
        list.forEach((entry) => {
          const event = entry.eventId;
          const id = event._id;
          if (id != null) ids.add(String(id));
        });
        setSavedIds(ids);
      } catch {
        setSavedIds(new Set());
      } finally {
        setSavedInitLoaded(true);
      }
    }
    loadSaved();
    return () => { ignore = true };
  }, [token]);

  const query = useMemo(() => {
    return {
      q: searchParams.get("q") || "",
      postalCode: searchParams.get("postalCode") || "",
      category: searchParams.get("category") || "All",
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 9),
    };
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/events", {
          params: {
            q: query.q || undefined,
            postalCode: query.postalCode || undefined,
            category: query.category && query.category !== "All" ? query.category : undefined,
            page: query.page,
            limit: query.limit,
          },
        });

        if (ignore) return;
        setEvents(data.data);
        setTotalItems(data.total);
      } catch (e) {
        if (ignore) return;
        setError("Failed to load events");
        setEvents([]);
        setTotalItems(0);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [query.q, query.postalCode, query.category, query.page, query.limit]);

  const currentPage = query.page;
  const pageSize = query.limit;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const fromIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toIdx = Math.min(currentPage * pageSize, totalItems);

  async function handleToggleSave(eventData, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const eventId = eventData?._id ?? eventData?.id;
    if (!eventId) return;
    if (saveStates[eventId]?.loading) return;
    if (!token) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSaveStates((prev) => ({ ...prev, [eventId]: { loading: true, error: '' } }));
    try {
      const idStr = String(eventId);
      if (savedIds.has(idStr)) {
        await api.delete(`/api/saved-events/${eventId}`);
        setSavedIds((prev) => { const next = new Set(prev); next.delete(idStr); return next; });
      } else {
        await api.post(`/api/saved-events/${eventId}`);
        setSavedIds((prev) => { const next = new Set(prev); next.add(idStr); return next; });
      }
      setSaveStates((prev) => { const next = { ...prev }; delete next[eventId]; return next; });
    } catch (err) {
      const message = 'Failed to update saved events';
      setSaveStates((prev) => ({ ...prev, [eventId]: { loading: false, error: message } }));
    }
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.min(Math.max(1, p), totalPages)));
    next.set("limit", String(pageSize));
    setSearchParams(next);
  }

  return (
    <div className="container py-4">
      <div className={styles.pageHead}>
        <div>
          <p className={styles.subtitle}>Discover what’s happening around you and online</p>
        </div>
      </div>

      <SearchBar compact initial={{ q: query.q, postalCode: query.postalCode }} />

      {!loading && !error && (
        <div className={styles.resultInfo}>
          {totalItems === 0 ? 'No events found' : `Showing ${fromIdx}–${toIdx} of ${totalItems} events`}
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {loading && <p className="mt-3">Loading…</p>}

      <div className="row g-3 mt-1">
        {events.map((event) => {
          const dateLine = event.startAt && event.endAt ? formatDateRange(event.startAt, event.endAt) : (event.startAt ? new Date(event.startAt).toLocaleString() : "");
          const mode = event.eventMode === "Inperson" ? "In person" : (event.eventMode || "");
          const capTotal = event?.capacity?.number;
          const seatsLeft = event?.capacity?.seatsRemaining;
          const attendeesNow = Math.max(0, capTotal - seatsLeft);
          const truncateAtWord = (text, max) => {
            const s = typeof text === 'string' ? text : '';
            if (s.length <= max) return s;
            const sub = s.slice(0, max);
            const lastSpace = sub.lastIndexOf(' ');
            const cut = lastSpace > 0 ? sub.slice(0, lastSpace) : sub;
            return cut.trimEnd() + '…';
          };
          const MAX_DESC = 160;
          const desc = truncateAtWord(event?.description || '', MAX_DESC);

          return (
            <div key={event._id || event.id} className="col-12 col-md-6 col-lg-4">
              <div
                className={`card h-100 ${styles.cardReset}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/events/${event._id || event.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={event.coverUrl || "https://picsum.photos/seed/fallback/800/450"}
                  className="card-img-top"
                  alt={event.title || "Event cover"}
                  loading="lazy"
                />
                <div className="card-body d-flex flex-column">
                  {(() => {
                    const eventId = event._id || event.id;
                    const saved = savedIds.has(String(eventId));
                    const state = saveStates[eventId] || { loading: false, error: '' };
                    const label = state.loading ? (saved ? 'Removing…' : 'Saving…') : (saved ? 'Unsave' : 'Save');
                    const heart = state.loading ? '…' : (saved ? '♥' : '♡');
                    const color = saved ? '#dc3545' : '#6c757d';
                    const styleBtn = { background: 'none', border: 'none', padding: 0, marginLeft: 8, fontSize: '24px', lineHeight: 1, color };
                    return (
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{event.title}</h5>
                        <button
                          type="button"
                          style={styleBtn}
                          aria-pressed={saved}
                          disabled={state.loading}
                          onClick={(e) => handleToggleSave(event, e)}
                          aria-label={label}
                          title={label}
                        >
                          {heart}
                        </button>
                      </div>
                    );
                  })()}
                  {saveStates[(event._id || event.id)]?.error && (
                    <div className="text-danger small mb-2">{saveStates[(event._id || event.id)]?.error}</div>
                  )}
                  <p className="card-text small text-muted" style={{ marginBottom: 4 }}>{dateLine}</p>
                  {mode && (
                    <p className="card-text small" style={{ marginBottom: 4 }}>
                      <span className="badge text-bg-light">{mode}</span>
                      {event.category && (
                        <span className="badge text-bg-secondary ms-2">{event.category}</span>
                      )}
                    </p>
                  )}
                  {attendeesNow != null && (
                    <p className="card-text small text-muted" style={{ marginBottom: 8 }}>
                      {attendeesNow} going{capTotal != null ? ` • ${capTotal} capacity` : ""}
                    </p>
                  )}
                  <p className="card-text flex-grow-1" style={{ whiteSpace: 'pre-wrap' }}>{desc}</p>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && !error && events.length === 0 && (
          <p className="text-muted mt-3">No events found for your filters.</p>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-4" aria-label="Events pagination">
          <ul className="pagination">
            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, Math.max(0, currentPage - 3) + 5)).map((p) => (
              <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
