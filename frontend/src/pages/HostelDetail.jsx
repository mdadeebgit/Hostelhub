import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { hostelApi, roomApi } from '../services/api'
import RoomCard from '../components/RoomCard'

export default function HostelDetail() {
  const { id } = useParams()
  const [hostel, setHostel] = useState(null)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    hostelApi.getById(id).then(r => setHostel(r.data)).catch(() => {})
    roomApi.getByHostel(id).then(r => setRooms(r.data)).catch(() => {})
  }, [id])

  if (!hostel) return <div className="loading">Loading hostel...</div>

  return (
    <div className="detail-page">
      <div className="hostel-header">
        {hostel.imageUrl && <img src={hostel.imageUrl} alt={hostel.name} />}
        <div>
          <h1>{hostel.name}</h1>
          <p>{hostel.address}, {hostel.city}</p>
          {hostel.description && <p style={{ marginTop: '0.75rem', lineHeight: 1.7 }}>{hostel.description}</p>}
          {hostel.contactNumber && <p style={{ marginTop: '0.5rem' }}>Contact: {hostel.contactNumber}</p>}
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Available Rooms</h2>
      {rooms.length === 0
        ? <p className="no-results">No rooms listed yet.</p>
        : <div className="room-grid">{rooms.map(r => <RoomCard key={r.id} room={r} />)}</div>
      }
    </div>
  )
}
