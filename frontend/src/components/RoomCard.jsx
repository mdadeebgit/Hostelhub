import React from 'react'
import { Link } from 'react-router-dom'

export default function RoomCard({ room }) {
  const isFull = room.availableSpots === 0
  return (
    <div className="card">
      {room.imageUrl
        ? <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} />
        : <div style={{ height: 180, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
      }
      <div className="card-body">
        <h3>Room {room.roomNumber}</h3>
        <p>Type: {room.type}</p>
        <p>Available: {room.availableSpots}/{room.capacity} spots</p>
        <p className="price">₹{room.pricePerMonth}/month</p>
        {isFull
          ? <span style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>Fully Occupied</span>
          : <Link to={`/rooms/${room.id}`} className="btn">View Room</Link>
        }
      </div>
    </div>
  )
}
