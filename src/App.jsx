import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const { user, userRole, loading } = useAuth()

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

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : (userRole === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)} />
      <Route path="/register" element={!user ? <Register /> : (userRole === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? (userRole === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}
