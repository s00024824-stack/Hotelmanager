import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './components/layout/Sidebar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import GestionePage from './pages/GestionePage'
import CheckInPage from './pages/CheckInPage'
import BookingsPage from './pages/BookingsPage'
import PlannerPage from './pages/PlannerPage'
import ProfilePage from './pages/ProfilePage'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(state => state.auth.user)
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />
  return children
}

function App() {
  const [theme, setTheme] = useState('dark')
  const location = useLocation()

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const isLoginPage = location.pathname === '/login'

  return (
    <div className={theme === 'light' ? 'app-light' : ''} style={{ background: 'var(--dark-bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {!isLoginPage && <Sidebar theme={theme} toggleTheme={toggleTheme} />}
      <div style={{ marginLeft: isLoginPage ? '0' : '220px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <BookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/checkin" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <CheckInPage />
            </ProtectedRoute>
          } />
          <Route path="/gestione" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionePage />
            </ProtectedRoute>
          } />
          
          <Route path="/planner" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <PlannerPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App