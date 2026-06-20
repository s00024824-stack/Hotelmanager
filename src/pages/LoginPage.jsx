import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../features/auth/authSlice'
import { validateEmail, validatePassword } from '../utils/validators'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })

  const gestisciInput = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const gestisciSubmit = async (e) => {
    e.preventDefault()
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    if (emailError || passwordError) {
      setFormErrors({ email: emailError, password: passwordError })
      return
    }

    const result = await dispatch(loginUser(formData))
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(13,27,42,0.5), rgba(13,27,42,0.7)), url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '380px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(180,150,80,0.2)', border: '1px solid #b49650',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <i className="ti ti-building" style={{ fontSize: '26px', color: '#b49650' }}></i>
          </div>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '500' }}>HotelManager</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '0.3rem' }}>
            Accesso riservato al personale
          </p>
        </div>

        <form onSubmit={gestisciSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={gestisciInput}
              style={{
                display: 'block', width: '100%', padding: '0.7rem',
                marginTop: '0.4rem', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
                color: 'white', fontSize: '14px',
              }}
            />
            {formErrors.email && <span style={{ color: '#e07070', fontSize: '12px' }}>{formErrors.email}</span>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={gestisciInput}
              style={{
                display: 'block', width: '100%', padding: '0.7rem',
                marginTop: '0.4rem', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
                color: 'white', fontSize: '14px',
              }}
            />
            {formErrors.password && <span style={{ color: '#e07070', fontSize: '12px' }}>{formErrors.password}</span>}
          </div>

          {error && <p style={{ color: '#e07070', fontSize: '13px', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" disabled={isLoading} style={{
            width: '100%', padding: '0.8rem', cursor: 'pointer',
            background: '#b49650', color: '#0d1b2a', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          }}>
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center' }}>
          Admin: admin@hotel.com / admin123<br/>
          Receptionist: receptionist@hotel.com / recep123
        </p>
      </div>
    </div>
  )
}

export default LoginPage