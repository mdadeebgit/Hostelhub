import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { hostelApi, roomApi, bookingApi, complaintApi } from '../services/api'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('hostels')

  const [hostels, setHostels]   = useState([])
  const [bookings, setBookings] = useState([])
  const [complaints, setComplaints] = useState([])

  const [hForm, setHForm] = useState({ name: '', address: '', city: '', description: '', contactNumber: '', imageUrl: '' })
  const [rForm, setRForm] = useState({ hostelId: '', roomNumber: '', type: 'SINGLE', capacity: 1, pricePerMonth: '', amenities: '', imageUrl: '' })
  const [hError, setHError] = useState('')
  const [rError, setRError] = useState('')

  const loadHostels    = () => hostelApi.getMyHostels().then(r => setHostels(r.data)).catch(() => {})
  const loadBookings   = () => bookingApi.getOwnerBookings().then(r => setBookings(r.data)).catch(() => {})
  const loadComplaints = () => complaintApi.getOwnerComplaints().then(r => setComplaints(r.data)).catch(() => {})

  useEffect(() => {
    loadHostels(); loadBookings(); loadComplaints()
  }, [])

  const addHostel = async (e) => {
    e.preventDefault(); setHError('')
    try {
      await hostelApi.create(hForm)
      setHForm({ name: '', address: '', city: '', description: '', contactNumber: '', imageUrl: '' })
      loadHostels()
    } catch (err) { setHError(err.response?.data?.message || 'Failed to add hostel') }
  }

  const addRoom = async (e) => {
    e.preventDefault(); setRError('')
    try {
      await roomApi.create({ ...rForm, hostelId: parseInt(rForm.hostelId), capacity: parseInt(rForm.capacity), pricePerMonth: parseFloat(rForm.pricePerMonth) })
      setRForm({ hostelId: '', roomNumber: '', type: 'SINGLE', capacity: 1, pricePerMonth: '', amenities: '', imageUrl: '' })
      alert('Room added successfully!')
    } catch (err) { setRError(err.response?.data?.message || 'Failed to add room') }
  }

  const approveBooking = async (id) => {
    try { await bookingApi.approve(id); loadBookings() }
    catch (e) { alert(e.response?.data?.message || 'Failed') }
  }

  const rejectBooking = async (id) => {
    try { await bookingApi.reject(id); loadBookings() }
    catch (e) { alert(e.response?.data?.message || 'Failed') }
  }

  const resolveComplaint = async (id) => {
    try { await complaintApi.updateStatus(id, 'RESOLVED'); loadComplaints() }
    catch (e) { alert('Failed to resolve') }
  }

  const approvedHostels = hostels.filter(h => h.status === 'APPROVED')

  return (
    <div className="dashboard">
      <h1>Owner Dashboard — {user?.name}</h1>

      <div className="tabs">
        {[['hostels','My Hostels'],['rooms','Add Room'],['bookings','Bookings'],['complaints','Complaints']].map(([k,v]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {/* ── MY HOSTELS ── */}
      {tab === 'hostels' && (
        <div>
          <div className="form-card">
            <h3>Register New Hostel</h3>
            {hError && <div className="error">{hError}</div>}
            <form onSubmit={addHostel}>
              <input placeholder="Hostel Name *" value={hForm.name} onChange={e => setHForm({ ...hForm, name: e.target.value })} required />
              <input placeholder="Address *" value={hForm.address} onChange={e => setHForm({ ...hForm, address: e.target.value })} required />
              <input placeholder="City *" value={hForm.city} onChange={e => setHForm({ ...hForm, city: e.target.value })} required />
              <textarea placeholder="Description (optional)" value={hForm.description} onChange={e => setHForm({ ...hForm, description: e.target.value })} />
              <input placeholder="Contact Number" value={hForm.contactNumber} onChange={e => setHForm({ ...hForm, contactNumber: e.target.value })} />
              <input placeholder="Image URL (optional)" value={hForm.imageUrl} onChange={e => setHForm({ ...hForm, imageUrl: e.target.value })} />
              <button type="submit">Submit for Approval</button>
            </form>
          </div>

          <h2>My Hostels</h2>
          {hostels.length === 0
            ? <p className="no-results">No hostels registered yet.</p>
            : <table className="data-table">
                <thead><tr><th>Name</th><th>City</th><th>Contact</th><th>Status</th></tr></thead>
                <tbody>
                  {hostels.map(h => (
                    <tr key={h.id}>
                      <td>{h.name}</td>
                      <td>{h.city}</td>
                      <td>{h.contactNumber || '—'}</td>
                      <td><span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* ── ADD ROOM ── */}
      {tab === 'rooms' && (
        <div className="form-card">
          <h3>Add Room to Approved Hostel</h3>
          {approvedHostels.length === 0
            ? <p style={{ color: 'var(--muted)' }}>You need an approved hostel before adding rooms.</p>
            : <>
                {rError && <div className="error">{rError}</div>}
                <form onSubmit={addRoom}>
                  <select value={rForm.hostelId} onChange={e => setRForm({ ...rForm, hostelId: e.target.value })} required>
                    <option value="">Select Hostel *</option>
                    {approvedHostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                  <input placeholder="Room Number *" value={rForm.roomNumber} onChange={e => setRForm({ ...rForm, roomNumber: e.target.value })} required />
                  <select value={rForm.type} onChange={e => setRForm({ ...rForm, type: e.target.value })}>
                    <option value="SINGLE">Single Sharing</option>
                    <option value="DOUBLE">Double Sharing</option>
                    <option value="TRIPLE">Triple Sharing</option>
                  </select>
                  <input type="number" placeholder="Capacity (beds) *" value={rForm.capacity} min={1} onChange={e => setRForm({ ...rForm, capacity: e.target.value })} required />
                  <input type="number" placeholder="Price per Month (₹) *" value={rForm.pricePerMonth} onChange={e => setRForm({ ...rForm, pricePerMonth: e.target.value })} required />
                  <input placeholder="Amenities (e.g. WiFi, AC, Laundry)" value={rForm.amenities} onChange={e => setRForm({ ...rForm, amenities: e.target.value })} />
                  <input placeholder="Room Image URL (optional)" value={rForm.imageUrl} onChange={e => setRForm({ ...rForm, imageUrl: e.target.value })} />
                  <button type="submit">Add Room</button>
                </form>
              </>
          }
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === 'bookings' && (
        <div>
          <h2>Booking Requests</h2>
          {bookings.length === 0
            ? <p className="no-results">No bookings yet.</p>
            : <table className="data-table">
                <thead>
                  <tr><th>Student</th><th>Hostel</th><th>Room</th><th>Check-In</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.studentName}<br /><small style={{ color: 'var(--muted)' }}>{b.studentEmail}</small></td>
                      <td>{b.hostelName}</td>
                      <td>{b.roomNumber} ({b.roomType})</td>
                      <td>{b.checkInDate}</td>
                      <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'PENDING' && (
                          <>
                            <button className="success" onClick={() => approveBooking(b.id)}>Approve</button>
                            <button className="danger" onClick={() => rejectBooking(b.id)}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* ── COMPLAINTS ── */}
      {tab === 'complaints' && (
        <div>
          <h2>Tenant Complaints</h2>
          {complaints.length === 0
            ? <p className="no-results">No complaints received.</p>
            : <table className="data-table">
                <thead>
                  <tr><th>Student</th><th>Hostel</th><th>Title</th><th>Description</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td>{c.studentName}</td>
                      <td>{c.hostelName}</td>
                      <td>{c.title}</td>
                      <td style={{ maxWidth: 250, fontSize: '0.85rem', color: 'var(--muted)' }}>{c.description}</td>
                      <td><span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                      <td>
                        {c.status !== 'RESOLVED' && (
                          <button className="success" onClick={() => resolveComplaint(c.id)}>Resolve</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}
    </div>
  )
}
