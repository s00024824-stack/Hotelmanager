import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateRequired } from '../utils/validators'
import localApi from '../utils/localApi'
import { loginUser } from '../features/auth/authSlice'

function ProfilePage() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })

  const [formErrors, setFormErrors] = useState({ username: '' })
  const [successo, setSuccesso] = useState(false)

  const gestisciInput = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const gestisciSubmit = async (e) => {
    e.preventDefault()
    const usernameError = validateRequired(formData.username, 'Username')
    if (usernameError) {
      setFormErrors({ username: usernameError })
      return
    }
    try {
      await localApi.patch(`/users/${user.id}`, formData)
      setSuccesso(true)
      setTimeout(() => setSuccesso(false), 3000)
    } catch (error) {
      console.error('Errore aggiornamento profilo', error)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const inputStyle = {
    display: 'block', width: '100%', padding: '0.6rem', marginTop: '0.4rem',
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    borderRadius: '8px', color: 'inherit', fontSize: '13px',
  }
  const labelStyle = { fontSize: '12px', color: 'var(--text-muted)' }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <i className="ti ti-user" style={{ color: '#b49650' }}></i>
        Profilo
      </h1>

      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="avatar"
              onError={(e) => { e.target.style.display = 'none' }}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #b49650' }}
            />
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#b49650', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '600', color: '#0d1b2a' }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>{user.username}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.role} — {user.email}</div>
          </div>
        </div>
      </div>

      <form onSubmit={gestisciSubmit} style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Username</label>
          <input type="text" name="username" value={formData.username} onChange={gestisciInput} style={inputStyle} />
          {formErrors.username && <span style={{ color: '#e07070', fontSize: '11px' }}>{formErrors.username}</span>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={gestisciInput} rows={3} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Avatar URL</label>
          <input type="text" name="avatar" value={formData.avatar} onChange={gestisciInput} style={inputStyle} placeholder="https://..." />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
            Suggerimento: https://ui-avatars.com/api/?name=Nome+Cognome&background=b49650&color=0d1b2a&size=200
          </span>
        </div>

        {successo && <p style={{ color: '#5db87a', fontSize: '13px', marginBottom: '1rem' }}>Profilo aggiornato con successo!</p>}

        <button type="submit" style={{
          width: '100%', padding: '0.7rem', cursor: 'pointer', background: '#b49650',
          color: '#0d1b2a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
        }}>
          Salva modifiche
        </button>
      </form>
    </div>
  )
}

export default ProfilePage