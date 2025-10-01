import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './css/SearchBar.module.css'

const CATEGORY_LIST = {
  'All': '✨',
  'Tech': '💻',
  'Business': '💼',
  'Career & Networking': '🤝',
  'Education & Learning': '📚',
  'Language & Culture': '🌐',
  'Music': '🎵',
  'Movies & Film': '🎬',
  'Arts': '🎨',
  'Book Clubs': '📖',
  'Dance': '💃',
  'Fitness': '🏋️',
  'Health & Wellness': '🧘',
  'Sports & Recreation': '⚽',
  'Outdoors & Adventure': '🌲',
  'Games': '🎮',
  'Hobbies & Crafts': '🧵',
  'Photography': '📷',
  'Food & Drink': '🍽️',
  'Social': '🎉',
  'LGBTQ+': '🏳️‍🌈',
  'Parents & Family': '👨‍👩‍👧‍👦',
  'Pets': '🐾',
  'Religion & Beliefs': '⛪',
  'Sci-Fi & Fantasy': '🪐',
  'Writing': '✍️',
  'Fashion & Beauty': '👗',
  'Startups & Entrepreneurship': '🚀',
  'Support & Community': '🤝',
}

const CATEGORIES = Object.entries(CATEGORY_LIST).map(([label, icon]) => ({ label, icon: icon || '🔹' }))

export default function SearchBar({ compact = false, initial = {} }) {
  const [q, setQ] = useState(initial.q || '')
  const [postalCode, setPostalCode] = useState(initial.postalCode || '')
  const [searchParams, setSearchParams] = useSearchParams()
  const catBarRef = useRef(null)
  const [showRight, setShowRight] = useState(false)
  const [showLeft, setShowLeft] = useState(false)

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

  function scrollRight() {
    if (catBarRef.current) {
      catBarRef.current.scrollBy({ left: 240, behavior: 'smooth' })
    }
  }
  function scrollLeft() {
    if (catBarRef.current) {
      catBarRef.current.scrollBy({ left: -240, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const el = catBarRef.current
    if (!el) return
    const update = () => {
      const canScroll = el.scrollWidth > el.clientWidth
      setShowRight(canScroll && el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
      setShowLeft(canScroll && el.scrollLeft > 0)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className={compact ? '' : 'p-3 bg-white border rounded shadow-sm'}>
      <form className="row g-3" onSubmit={onSubmit}>
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

      <div className="mt-4">
        <div className={styles.catWrap}>
          {showLeft && (
            <button
              type="button"
              className={styles.scrollLeft}
              onClick={scrollLeft}
              aria-label="Scroll categories left"
            >
              ‹
            </button>
          )}
          <div ref={catBarRef} className={styles.catBar}>
          {CATEGORIES.map(({ label, icon }) => {
            const active = currentCategory === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => onPickCategory(label)}
                className={`${styles.catItem} ${active ? styles.active : ''}`}
                aria-pressed={active}
              >
                <span className={styles.icon} aria-hidden>{icon}</span>
                <span className={styles.label}>{label}</span>
              </button>
            )
          })}
          </div>
          {showRight && (
            <button
              type="button"
              className={styles.scrollRight}
              onClick={scrollRight}
              aria-label="Scroll categories right"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
