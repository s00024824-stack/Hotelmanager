import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

function Navbar() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const gestisciLogout = () => {
    dispatch(logout())
    navigate('/login')
  
  }
 return (
    <nav style={{ padding: '1rem', background: '#1a1a2e', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        🏨 HotelManager
      </Link>
      <Link to="/rooms" style={{ color: 'white', textDecoration: 'none' }}>Camere</Link>
      
      {user && (
        <>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profilo</Link>
          {(user.role === 'admin' || user.role === 'receptionist') && (
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          )}
          <span style={{ color: '#aaa', marginLeft: 'auto' }}>
            👤 {user.username} ({user.role})
          </span>
          <button onClick={gestisciLogout} style={{ marginLeft: '1rem', cursor: 'pointer' }}>
            Esci
          </button>
        </>
      )}
      {!user && (
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto' }}>Login</Link>
      )}
    </nav>
  )
}

export default Navbar

