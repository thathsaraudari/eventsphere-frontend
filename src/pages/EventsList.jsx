import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"
import api from "../api/client";


export default function EventsList() {
  const [searchParamters] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false)
  
  const searchQuery = useMemo(() => ({
    searchQuery: searchParamters.get("searchQuery") || "",
    postalCode: searchParamters.get("postalCode") || "",
  }), [searchParamters])

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get("/events", { searchParamters: searchQuery })
        if(!ignore) setEvents(data?.list || data || [])
    } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [searchQuery ])

  
  return (
    <div className="container py-4">
      <h1 className="h4">Events</h1>
      <p className="text-muted">Events list will appear here.</p>
      {loading && <p className="mt-3">Loading…</p>}

      <div className="row g-3 mt-1">
        {events.map(event => (
          <div key={event._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <img src={event.coverUrl || 'https://picsum.photos/seed/fallback/800/450'} className="card-img-top" alt="" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text small text-muted">
                  {(event.location.city || '—') + ' • ' + (event.startsAt ? new Date(event.startsAt).toLocaleString() : '')}
                </p>
                <p className="card-text flex-grow-1">{(event.description || '')}</p>
                <Link className="btn btn-primary mt-auto" to={`/events/${event._id}`}>View details</Link>
              </div>
            </div>
          </div>
        ))}
        {!loading && events.length === 0 && (
          <p className="text-muted mt-3">No events found for your filters.</p>
        )}
      </div>
    </div>
  )
}