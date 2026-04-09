import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomApi, bookingApi } from '../services/api'

export default function BookingPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    roomApi.getById(roomId).then(r => setRoom(r.data)).catch(() => {})
  }, [roomId])

  const handleBook = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await bookingApi.create({
        roomId: parseInt(roomId),
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate || null,
      })
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!room) return <div className="loading">Loading room details...</div>

  return (
    <div className="booking-page">
      <h2>Book Room {room.roomNumber}</h2>
      <p>Hostel: {room.hostelName}, {room.hostelCity}</p>
      <p>Type: {room.type} | Available spots: {room.availableSpots}</p>
      <p className="price" style={{ marginTop: '0.5rem' }}>₹{room.pricePerMonth}/month</p>

      {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}

      <form onSubmit={handleBook}>
        <label>Check-In Date *</label>
        <input type="date" value={form.checkInDate}
          onChange={e => setForm({ ...form, checkInDate: e.target.value })} required />
        <label>Check-Out Date (optional)</label>
        <input type="date" value={form.checkOutDate}
          onChange={e => setForm({ ...form, checkOutDate: e.target.value })} />
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}
