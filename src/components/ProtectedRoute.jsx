import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, userRole } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        background: '#232B2B',
        color: '#FFFFFF'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If admin is required but role is still loading (null), wait for it
  if (requireAdmin && userRole === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        background: '#232B2B',
        color: '#FFFFFF'
      }}>
        Loading permissions...
      </div>
    )
  }

  // Only show access denied if role is explicitly not admin (not null/loading)
  if (requireAdmin && userRole !== 'admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: '#232B2B',
        color: '#FFFFFF'
      }}>
        <h1 style={{ color: '#FFFFFF' }}>Access Denied</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>You need admin privileges to access this page.</p>
      </div>
    )
  }

  return children
}

