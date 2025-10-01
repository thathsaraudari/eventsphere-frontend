import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import SearchBar from "../components/SearchBar.jsx";
import { formatDateRange } from "../utils/eventHelpers";

export default function EventsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.min(Math.max(1, p), totalPages)));
    next.set("limit", String(pageSize));
    setSearchParams(next);
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h1 className="h4 m-0">Events</h1>
      </div>

      <SearchBar compact initial={{ q: query.q, postalCode: query.postalCode }} />

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {loading && <p className="mt-3">Loading…</p>}

      <div className="row g-3 mt-1">
        {events.map((event) => {
          const dateLine = event.startAt && event.endAt ? formatDateRange(event.startAt, event.endAt) : (event.startAt ? new Date(event.startAt).toLocaleString() : "");
          const mode = event.eventMode === "Inperson" ? "In person" : (event.eventMode || "");
          const capTotal = event?.capacity?.number;
          const seatsLeft = event?.capacity?.seatsRemaining;
          const attendeesNow =
            (capTotal != null && seatsLeft != null)
              ? Math.max(0, capTotal - seatsLeft)
              : (event?.attendeesCount ?? (Array.isArray(event?.attendees) ? event.attendees.length : undefined));

          return (
            <div key={event._id || event.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <img
                  src={event.coverUrl || "https://picsum.photos/seed/fallback/800/450"}
                  className="card-img-top"
                  alt={event.title || "Event cover"}
                  loading="lazy"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.title}</h5>
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
                  <p className="card-text flex-grow-1" style={{ whiteSpace: 'pre-wrap' }}>{event.description || ''}</p>
                  <Link className="btn btn-primary mt-auto" to={`/events/${event._id || event.id}`}>View details</Link>
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
