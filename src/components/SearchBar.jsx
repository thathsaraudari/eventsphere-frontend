import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['All', 'Tech', 'Music', 'Fitness', 'Business', 'Arts']
const DISTANCES = ['5','10','25','50','100'] // km

export default function SearchBar({ compact = false, initial = {} }) {
  const [q, setQ] = useState(initial.q || '')
  const [postalCode, setPostalCode] = useState(initial.postalCode || '')
  const [category, setCategory] = useState(initial.category || 'All')
  const [dateFrom, setDateFrom] = useState(initial.dateFrom || '')
  const [dateTo, setDateTo] = useState(initial.dateTo || '')
  const [distanceKm, setDistanceKm] = useState(initial.distanceKm || '25')

  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (postalCode) params.set('postalCode', postalCode)
    if (category && category !== 'All') params.set('category', category)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (distanceKm) params.set('distanceKm', distanceKm)
    navigate(`/events?${params.toString()}`)
  }

  return (
    <form className={`row g-2 ${compact ? '' : 'p-3 bg-white border rounded shadow-sm'}`} onSubmit={onSubmit}>
      <div className="col-12 col-md-4">
        <input className="form-control" placeholder="Search events (e.g. React)" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="col-6 col-md-2">
        <input className="form-control" placeholder="Postal code" value={postalCode} onChange={e=>setPostalCode(e.target.value)} />
      </div>
      <div className="col-6 col-md-2">
        <select className="form-select" value={category} onChange={e=>setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-6 col-md-2">
        <input type="date" className="form-control" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
      </div>
      <div className="col-6 col-md-2">
        <input type="date" className="form-control" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
      </div>
      <div className="col-6 col-md-2">
        <select className="form-select" value={distanceKm} onChange={e=>setDistanceKm(e.target.value)}>
          {DISTANCES.map(d => <option key={d} value={d}>{d} km</option>)}
        </select>
      </div>
      <div className="col-12 col-md-2">
        <button className="btn btn-primary w-100" type="submit">Search</button>
      </div>
    </form>
  )
}
