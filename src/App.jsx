import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(state => state.auth.user)
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />
  return children
}
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist' ]}>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App