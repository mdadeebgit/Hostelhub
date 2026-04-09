import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { hostelApi } from '../services/api'
import HostelCard from '../components/HostelCard'

export default function HostelListing() {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city') || ''

  useEffect(() => {
    setLoading(true)
    const call = city ? hostelApi.search(city) : hostelApi.getAll()
    call
      .then(r => setHostels(r.data))
      .catch(() => setHostels([]))
      .finally(() => setLoading(false))
  }, [city])

  if (loading) return <div className="loading">Loading hostels...</div>

  return (
    <div className="listing-page">
      <h2>{city ? `Hostels in "${city}"` : 'All Hostels'}</h2>
      {hostels.length === 0
        ? <p className="no-results">No hostels found.</p>
        : <div className="hostel-grid">{hostels.map(h => <HostelCard key={h.id} hostel={h} />)}</div>
      }
    </div>
  )
}
