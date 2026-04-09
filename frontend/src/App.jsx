import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import HostelListing from './pages/HostelListing'
import HostelDetail from './pages/HostelDetail'
import RoomDetail from './pages/RoomDetail'
import BookingPage from './pages/BookingPage'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/hostels"        element={<HostelListing />} />
            <Route path="/hostels/:id"    element={<HostelDetail />} />
            <Route path="/rooms/:id"      element={<RoomDetail />} />
            <Route path="/book/:roomId"   element={
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/owner/dashboard" element={
              <ProtectedRoute roles={['OWNER']}><OwnerDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminPanel /></ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}
