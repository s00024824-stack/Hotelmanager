import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../features/auth/authSlice'
import { validateEmail, validatePassword } from '../utils/validators'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  })

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
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🏨 Login HotelManager</h2>
      <form onSubmit={gestisciSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={gestisciInput}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
          {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={gestisciInput}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
          {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '0.7rem', cursor: 'pointer' }}>
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        Admin: admin@hotel.com / admin123<br/>
        Receptionist: receptionist@hotel.com / recep123
      </p>
    </div>
  )
}

export default LoginPage