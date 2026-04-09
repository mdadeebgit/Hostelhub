import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('hh_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (data) => {
    localStorage.setItem('hh_token', data.token)
    localStorage.setItem('hh_user', JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('hh_token')
    localStorage.removeItem('hh_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
