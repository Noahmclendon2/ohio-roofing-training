import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function UserDashboard() {
  const { user, userRole, userProfile, signOut, getDisplayName } = useAuth()
  const navigate = useNavigate()

  // Redirect if role changes to admin
  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [userRole, navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Navigate anyway
      navigate('/login', { replace: true })
    }
  }

  const getRoleDisplay = () => {
    if (!userRole) return 'Loading...'
    return userRole === 'admin' ? 'Admin' : 'Trainee'
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <div className="dashboard-logo-placeholder">LOGO</div>
          </div>
          <h1>User Dashboard</h1>
        </div>
        <div className="header-actions">
          <span>Welcome, {getDisplayName()}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Profile</h2>
          {userProfile?.first_name && userProfile?.last_name && (
            <p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
          )}
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {getRoleDisplay()}</p>
        </div>
        
        <div className="dashboard-card">
          <h2>Welcome!</h2>
          <p>This is your user dashboard. You can add more content here based on your application needs.</p>
        </div>
      </main>
    </div>
  )
}

