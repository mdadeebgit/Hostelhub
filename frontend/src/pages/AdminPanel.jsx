import React, { useState, useEffect } from 'react'
import { adminApi, hostelApi, bookingApi, complaintApi, paymentApi } from '../services/api'

export default function AdminPanel() {
  const [tab, setTab] = useState('stats')
  const [stats, setStats]         = useState(null)
  const [users, setUsers]         = useState([])
  const [hostels, setHostels]     = useState([])
  const [bookings, setBookings]   = useState([])
  const [payments, setPayments]   = useState([])
  const [complaints, setComplaints] = useState([])

  const loadHostels = () => hostelApi.getAllAdmin().then(r => setHostels(r.data)).catch(() => {})

  useEffect(() => {
    adminApi.getStats().then(r => setStats(r.data)).catch(() => {})
    adminApi.getUsers().then(r => setUsers(r.data)).catch(() => {})
    loadHostels()
    bookingApi.getAll().then(r => setBookings(r.data)).catch(() => {})
    paymentApi.getAll().then(r => setPayments(r.data)).catch(() => {})
    complaintApi.getAll().then(r => setComplaints(r.data)).catch(() => {})
  }, [])

  const approveHostel = async (id) => {
    try { await hostelApi.approve(id); loadHostels(); adminApi.getStats().then(r => setStats(r.data)) }
    catch (e) { alert('Failed to approve') }
  }

  const rejectHostel = async (id) => {
    try { await hostelApi.reject(id); loadHostels() }
    catch (e) { alert('Failed to reject') }
  }

  const TABS = [
    ['stats','Stats'],['users','Users'],['hostels','Hostels'],
    ['bookings','Bookings'],['payments','Payments'],['complaints','Complaints']
  ]

  return (
    <div className="dashboard">
      <h1>Admin Panel</h1>

      <div className="tabs">
        {TABS.map(([k, v]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <div>
          <h2>Platform Overview</h2>
          {!stats
            ? <p className="loading">Loading stats...</p>
            : <div className="stats-grid">
                <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
                <div className="stat-card"><h3>{stats.totalHostels}</h3><p>Total Hostels</p></div>
                <div className="stat-card"><h3>{stats.approvedHostels}</h3><p>Approved Hostels</p></div>
                <div className="stat-card"><h3>{stats.totalRooms}</h3><p>Total Rooms</p></div>
                <div className="stat-card"><h3>{stats.totalBookings}</h3><p>Total Bookings</p></div>
                <div className="stat-card"><h3>{stats.activeBookings}</h3><p>Active Bookings</p></div>
                <div className="stat-card"><h3>{stats.totalPayments}</h3><p>Payments Made</p></div>
                <div className="stat-card"><h3>₹{stats.totalRevenue}</h3><p>Total Revenue</p></div>
              </div>
          }
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div>
          <h2>All Users ({users.length})</h2>
          <table className="data-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge approved">{u.role}</span></td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.createdAt?.substring(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── HOSTELS ── */}
      {tab === 'hostels' && (
        <div>
          <h2>All Hostels ({hostels.length})</h2>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>City</th><th>Owner</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {hostels.map(h => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.city}</td>
                  <td>{h.ownerName}</td>
                  <td><span className={`badge ${h.status.toLowerCase()}`}>{h.status}</span></td>
                  <td>
                    {h.status === 'PENDING' && (
                      <>
                        <button className="success" onClick={() => approveHostel(h.id)}>Approve</button>
                        <button className="danger"  onClick={() => rejectHostel(h.id)}>Reject</button>
                      </>
                    )}
                    {h.status === 'APPROVED' && (
                      <button className="danger" onClick={() => rejectHostel(h.id)}>Revoke</button>
                    )}
                    {h.status === 'REJECTED' && (
                      <button className="success" onClick={() => approveHostel(h.id)}>Re-approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {tab === 'bookings' && (
        <div>
          <h2>All Bookings ({bookings.length})</h2>
          <table className="data-table">
            <thead>
              <tr><th>Student</th><th>Hostel</th><th>Room</th><th>Check-In</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.studentName}</td>
                  <td>{b.hostelName}</td>
                  <td>{b.roomNumber} ({b.roomType})</td>
                  <td>{b.checkInDate}</td>
                  <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === 'payments' && (
        <div>
          <h2>All Payments ({payments.length})</h2>
          <table className="data-table">
            <thead>
              <tr><th>Student</th><th>Hostel</th><th>Room</th><th>Amount</th><th>Date</th><th>Tx ID</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.studentName}</td>
                  <td>{p.hostelName}</td>
                  <td>{p.roomNumber}</td>
                  <td><strong>₹{p.amount}</strong></td>
                  <td>{p.paymentDate}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{p.transactionId || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── COMPLAINTS ── */}
      {tab === 'complaints' && (
        <div>
          <h2>All Complaints ({complaints.length})</h2>
          <table className="data-table">
            <thead>
              <tr><th>Student</th><th>Hostel</th><th>Title</th><th>Status</th></tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.studentName}</td>
                  <td>{c.hostelName}</td>
                  <td>{c.title}</td>
                  <td><span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
