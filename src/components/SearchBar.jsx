import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  'All',
  'Tech',
  'Business',
  'Career & Networking',
  'Education & Learning',
  'Language & Culture',
  'Music',
  'Movies & Film',
  'Arts',
  'Book Clubs',
  'Dance',
  'Fitness',
  'Health & Wellness',
  'Sports & Recreation',
  'Outdoors & Adventure',
  'Games',
  'Hobbies & Crafts',
  'Photography',
  'Food & Drink',
  'Social',
  'LGBTQ+',
  'Parents & Family',
  'Pets',
  'Religion & Beliefs',
  'Sci-Fi & Fantasy',
  'Writing',
  'Fashion & Beauty',
  'Startups & Entrepreneurship',
  'Support & Community',
]

export default function SearchBar({ compact = false, initial = {} }) {
  const [q, setQ] = useState(initial.q || '')
  const [postalCode, setPostalCode] = useState(initial.postalCode || '')
  const [searchParams, setSearchParams] = useSearchParams()

  const currentCategory = searchParams.get('category') || 'All'

  function onSubmit(e) {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (q) next.set('q', q); else next.delete('q')
    if (postalCode) next.set('postalCode', postalCode); else next.delete('postalCode')
    next.set('page', '1')
    setSearchParams(next)
  }

  function onPickCategory(cat) {
    const next = new URLSearchParams(searchParams)
    if (cat && cat !== 'All') next.set('category', cat)
    else next.delete('category')
    next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className={compact ? '' : 'p-3 bg-white border rounded shadow-sm'}>
      <form className="row g-2" onSubmit={onSubmit}>
        <div className="col-12 col-md-6">
          <input className="form-control" placeholder="Search events (e.g. React)" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <input className="form-control" placeholder="Postal code" value={postalCode} onChange={e=>setPostalCode(e.target.value)} />
        </div>
        <div className="col-12 col-md-3">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>

      <div className="mt-3" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {CATEGORIES.map(cat => {
          const active = currentCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onPickCategory(cat)}
              className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
