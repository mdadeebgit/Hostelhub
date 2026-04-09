import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hostelApi } from '../services/api'
import HostelCard from '../components/HostelCard'

export default function Home() {
  const [hostels, setHostels] = useState([])
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    hostelApi.getAll().then(r => setHostels(r.data)).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) navigate(`/hostels?city=${city}`)
    else navigate('/hostels')
  }

  return (
    <div>
      <section className="hero">
        <h1>Find Your Perfect Hostel</h1>
        <p>Search from verified hostels and PGs across India</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            placeholder="Search by city..."
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="featured">
        <h2>Featured Hostels</h2>
        {hostels.length === 0
          ? <p className="no-results">No hostels available yet.</p>
          : <div className="hostel-grid">
              {hostels.slice(0, 6).map(h => <HostelCard key={h.id} hostel={h} />)}
            </div>
        }
      </section>
    </div>
  )
}
