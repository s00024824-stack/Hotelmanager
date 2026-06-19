import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateRequired } from '../utils/validators'
import localApi from '../utils/localApi'

function ProfilePage() {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })

  const [formErrors, setFormErrors] = useState({
    username: '',
  })

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

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>👤 Profilo</h1>
      <p style={{ color: '#666' }}>Ruolo: <strong>{user.role}</strong></p>
      <p style={{ color: '#666' }}>Email: <strong>{user.email}</strong></p>

      <form onSubmit={gestisciSubmit} style={{ marginTop: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={gestisciInput}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
          {formErrors.username && <span style={{ color: 'red' }}>{formErrors.username}</span>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={gestisciInput}
            rows={3}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={gestisciInput}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </div>

        {successo && <p style={{ color: 'green' }}>✅ Profilo aggiornato con successo!</p>}

        <button type="submit" style={{ width: '100%', padding: '0.7rem', cursor: 'pointer' }}>
          Salva modifiche
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
