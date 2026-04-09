import React from 'react'
import { Link } from 'react-router-dom'

export default function HostelCard({ hostel }) {
  return (
    <div className="card">
      {hostel.imageUrl
        ? <img src={hostel.imageUrl} alt={hostel.name} />
        : <div style={{ height: 180, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
      }
      <div className="card-body">
        <h3>{hostel.name}</h3>
        <p>{hostel.city}</p>
        <p style={{ fontSize: '0.82rem' }}>{hostel.address}</p>
        <Link to={`/hostels/${hostel.id}`} className="btn">View Details</Link>
      </div>
    </div>
  )
}
