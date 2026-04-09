import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookingApi, paymentApi, complaintApi, hostelApi } from '../services/api'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings]   = useState([])
  const [payments, setPayments]   = useState([])
  const [complaints, setComplaints] = useState([])
  const [hostels, setHostels]     = useState([])
  const [payingId, setPayingId]   = useState(null)
  const [payForm, setPayForm]     = useState({ amount: '', paymentDate: '', transactionId: '' })
  const [cForm, setCForm]         = useState({ hostelId: '', title: '', description: '' })
  const [error, setError]         = useState('')

  const loadBookings  = () => bookingApi.getMyBookings().then(r => setBookings(r.data)).catch(() => {})
  const loadPayments  = () => paymentApi.getMyPayments().then(r => setPayments(r.data)).catch(() => {})
  const loadComplaints= () => complaintApi.getMyComplaints().then(r => setComplaints(r.data)).catch(() => {})

  useEffect(() => {
    loadBookings()
    loadPayments()
    loadComplaints()
    hostelApi.getAll().then(r => setHostels(r.data)).catch(() => {})
  }, [])

  const cancelBooking = async (id) => {
    try { await bookingApi.cancel(id); loadBookings() }
    catch (e) { alert(e.response?.data?.message || 'Cancel failed') }
  }

  const submitPayment = async (bookingId) => {
    setError('')
    try {
      await paymentApi.record({ bookingId, amount: parseFloat(payForm.amount), paymentDate: payForm.paymentDate, transactionId: payForm.transactionId })
      setPayingId(null)
      setPayForm({ amount: '', paymentDate: '', transactionId: '' })
      loadPayments()
    } catch (e) { setError(e.response?.data?.message || 'Payment failed') }
  }

  const submitComplaint = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await complaintApi.raise(cForm)
      setCForm({ hostelId: '', title: '', description: '' })
      loadComplaints()
    } catch (e) { setError(e.response?.data?.message || 'Failed to raise complaint') }
  }

  return (
    <div className="dashboard">
      <h1>Student Dashboard — {user?.name}</h1>

      <div className="tabs">
        {['bookings','payments','complaints'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── BOOKINGS ── */}
      {tab === 'bookings' && (
        <div>
          <h2>My Bookings</h2>
          {bookings.length === 0
            ? <p className="no-results">No bookings yet. <a href="/hostels" style={{ color: 'var(--primary)' }}>Browse hostels</a></p>
            : <table className="data-table">
                <thead>
                  <tr><th>Hostel</th><th>Room</th><th>Price/mo</th><th>Check-In</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <React.Fragment key={b.id}>
                      <tr>
                        <td>{b.hostelName}</td>
                        <td>{b.roomNumber} ({b.roomType})</td>
                        <td>₹{b.pricePerMonth}</td>
                        <td>{b.checkInDate}</td>
                        <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                        <td>
                          {(b.status === 'PENDING' || b.status === 'APPROVED') &&
                            <button className="danger" onClick={() => cancelBooking(b.id)}>Cancel</button>
                          }
                          {b.status === 'APPROVED' &&
                            <button className="warning" style={{ marginLeft: '0.35rem' }} onClick={() => setPayingId(payingId === b.id ? null : b.id)}>
                              Pay Rent
                            </button>
                          }
                        </td>
                      </tr>
                      {payingId === b.id && (
                        <tr>
                          <td colSpan={6}>
                            {error && <div className="error">{error}</div>}
                            <div className="pay-form">
                              <strong>Record Rent Payment for Room {b.roomNumber}</strong>
                              <input type="number" placeholder="Amount (₹)" value={payForm.amount}
                                onChange={e => setPayForm({ ...payForm, amount: e.target.value })} />
                              <input type="date" placeholder="Payment Date" value={payForm.paymentDate}
                                onChange={e => setPayForm({ ...payForm, paymentDate: e.target.value })} />
                              <input placeholder="Transaction ID (optional)" value={payForm.transactionId}
                                onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })} />
                              <button className="success" onClick={() => submitPayment(b.id)}>Submit Payment</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === 'payments' && (
        <div>
          <h2>Payment History</h2>
          {payments.length === 0
            ? <p className="no-results">No payments recorded yet.</p>
            : <table className="data-table">
                <thead>
                  <tr><th>Hostel</th><th>Room</th><th>Amount</th><th>Date</th><th>Transaction ID</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>{p.hostelName}</td>
                      <td>{p.roomNumber}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.paymentDate}</td>
                      <td>{p.transactionId || '—'}</td>
                      <td><span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
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
          <div className="form-card">
            <h3>Raise New Complaint</h3>
            {error && <div className="error">{error}</div>}
            <form onSubmit={submitComplaint}>
              <select value={cForm.hostelId} onChange={e => setCForm({ ...cForm, hostelId: e.target.value })} required>
                <option value="">Select Hostel</option>
                {hostels.map(h => <option key={h.id} value={h.id}>{h.name} — {h.city}</option>)}
              </select>
              <input placeholder="Complaint Title" value={cForm.title}
                onChange={e => setCForm({ ...cForm, title: e.target.value })} required />
              <textarea placeholder="Describe the issue..." value={cForm.description}
                onChange={e => setCForm({ ...cForm, description: e.target.value })} required />
              <button type="submit">Submit Complaint</button>
            </form>
          </div>

          <h2>My Complaints</h2>
          {complaints.length === 0
            ? <p className="no-results">No complaints raised.</p>
            : <table className="data-table">
                <thead>
                  <tr><th>Hostel</th><th>Title</th><th>Description</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td>{c.hostelName}</td>
                      <td>{c.title}</td>
                      <td style={{ maxWidth: 300, fontSize: '0.85rem', color: 'var(--muted)' }}>{c.description}</td>
                      <td><span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
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
