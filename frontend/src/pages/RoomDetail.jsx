import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    roomApi.getById(id).then(r => setRoom(r.data)).catch(() => {})
  }, [id])

  if (!room) return <div className="loading">Loading room...</div>

  const isFull = room.availableSpots === 0

  return (
    <div className="detail-page">
      {room.imageUrl && <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} />}
      <h1>Room {room.roomNumber}</h1>
      <p>
        Hostel: <Link to={`/hostels/${room.hostelId}`} style={{ color: 'var(--primary)' }}>
          {room.hostelName}
        </Link> — {room.hostelCity}
      </p>
      <p>Type: <strong>{room.type}</strong></p>
      <p>Capacity: <strong>{room.capacity}</strong> beds</p>
      <p>Available Spots: <strong>{room.availableSpots}</strong></p>
      {room.amenities && <p>Amenities: {room.amenities}</p>}
      <p className="price">₹{room.pricePerMonth} / month</p>

      {isFull
        ? <button disabled>Fully Occupied</button>
        : user
          ? <button onClick={() => navigate(`/book/${room.id}`)}>Book Now</button>
          : <button onClick={() => navigate('/login')}>Login to Book</button>
      }
    </div>
  )
}
