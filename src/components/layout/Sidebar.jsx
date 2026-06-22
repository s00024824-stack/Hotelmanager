import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

function Sidebar({ theme, toggleTheme }) {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const gestisciLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'ti-layout-dashboard' },
    { path: '/rooms', label: 'Camere', icon: 'ti-bed' },
    { path: '/bookings', label: 'Prenotazioni', icon: 'ti-calendar-event' },
    { path: '/planner', label: 'Planner', icon: 'ti-calendar' },
    { path: '/checkin', label: 'Check-in', icon: 'ti-door-enter' },
    { path: '/gestione', label: 'Gestione', icon: 'ti-settings', adminOnly: true },
    { path: '/profile', label: 'Profilo', icon: 'ti-user' },
  ]

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: '#111e2e',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
        <i className="ti ti-building" style={{ fontSize: '22px', color: '#b49650' }}></i>
        <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>HotelManager</span>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#b49650', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#0d1b2a' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>{user.username}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{user.role}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
        {menuItems.map(item => {
          if (item.adminOnly && user?.role !== 'admin') return null
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.6rem 0.7rem', borderRadius: '8px',
              textDecoration: 'none',
              color: isActive(item.path) ? '#b49650' : 'rgba(255,255,255,0.6)',
              background: isActive(item.path) ? 'rgba(180,150,80,0.12)' : 'transparent',
              fontSize: '13px',
              fontWeight: isActive(item.path) ? '500' : '400',
            }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: '16px' }}></i>
              {item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.7rem', borderRadius: '8px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)', fontSize: '13px',
        }}>
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} style={{ fontSize: '16px' }}></i>
          {theme === 'dark' ? 'Modalità chiara' : 'Modalità scura'}
        </button>

        {user ? (
          <button onClick={gestisciLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.7rem', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)', fontSize: '13px',
          }}>
            <i className="ti ti-logout" style={{ fontSize: '16px' }}></i>
            Esci
          </button>
        ) : (
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.7rem', borderRadius: '8px',
            color: '#b49650', fontSize: '13px', textDecoration: 'none',
          }}>
            <i className="ti ti-login" style={{ fontSize: '16px' }}></i>
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar