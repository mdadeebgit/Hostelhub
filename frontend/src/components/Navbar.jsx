import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashboardLink = () => {
    if (!user) return null
    if (user.role === 'STUDENT') return <Link to="/student/dashboard">Dashboard</Link>
    if (user.role === 'OWNER')   return <Link to="/owner/dashboard">Dashboard</Link>
    if (user.role === 'ADMIN')   return <Link to="/admin">Admin Panel</Link>
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">HostelHub</Link>
      <div className="nav-links">
        <Link to="/hostels">Browse</Link>
        {user ? (
          <>
            {dashboardLink()}
            <span className="user-chip">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
