import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

function Navbar() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const gestisciLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#f0c040' : 'white',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderBottom: location.pathname === path ? '2px solid #f0c040' : 'none',
    paddingBottom: '2px',
  })

  return (
    <nav style={{ padding: '1rem', background: '#1a1a2e', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        🏨 HotelManager
      </Link>
      <Link to="/rooms" style={linkStyle('/rooms')}>Camere</Link>

      {user && (
        <>
          <Link to="/profile" style={linkStyle('/profile')}>Profilo</Link>
          {(user.role === 'admin' || user.role === 'receptionist') && (
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
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
        <Link to="/login" style={{ ...linkStyle('/login'), marginLeft: 'auto' }}>Login</Link>
      )}
    </nav>
  )
}

export default Navbar