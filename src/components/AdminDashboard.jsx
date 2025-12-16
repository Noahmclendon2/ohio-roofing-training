import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

export default function AdminDashboard() {
  const { user, userRole, signOut, getDisplayName } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserDisplayName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user.first_name) {
      return user.first_name
    }
    return user.email || 'N/A'
  }

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


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <div className="dashboard-logo-placeholder">LOGO</div>
          </div>
          <h1>Admin Dashboard</h1>
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
          <h2>Admin Panel</h2>
          <p><strong>Your Role:</strong> {userRole ? (userRole === 'admin' ? 'Admin' : 'Trainee') : 'Loading...'}</p>
        </div>
        
        <div className="dashboard-card">
          <h2>User Management</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr) => (
                    <tr key={usr.id}>
                      <td>{getUserDisplayName(usr)}</td>
                      <td>{usr.email}</td>
                      <td>
                        <span className={`role-badge ${usr.role}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td>{new Date(usr.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p>No users found.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

