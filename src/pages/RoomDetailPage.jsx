import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom, setCurrentRoom } from '../features/rooms/roomsSlice'
import { addBooking } from '../features/bookings/bookingsSlice'
import { addGuest } from '../features/guests/guestsSlice'
import { insertParking } from '../features/parkings/parkingsSlice'

function RoomDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: rooms, currentRoom } = useSelector(state => state.rooms)
  const { user } = useSelector(state => state.auth)
  const { items: parkings } = useSelector(state => state.parkings)

  const [formData, setFormData] = useState({ checkIn: '', checkOut: '', parkingId: '' })
  const [guestData, setGuestData] = useState({
    nome: '', cognome: '', email: '', telefono: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [successo, setSuccesso] = useState(false)

  useEffect(() => {
    if (rooms.length === 0) dispatch(insertRoom())
    dispatch(insertParking())
  }, [dispatch, rooms.length])

  useEffect(() => {
    const camera = rooms.find(r => String(r.id) === String(id))
    if (camera) dispatch(setCurrentRoom(camera))
  }, [rooms, id, dispatch])

  const gestisciInput = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const gestisciInputOspite = (e) => {
    const { name, value } = e.target
    setGuestData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const calcolaNotti = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const diff = new Date(formData.checkOut) - new Date(formData.checkIn)
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  const calcolaTotale = (camera, notti) => {
    let totale = camera.prezzoNotte * notti
    if (camera.tipo === 'doppia' && camera.lettoAggiuntivo) totale += 20 * notti
    if (camera.tipo === 'suite') totale += 50
    if (formData.parkingId) totale += 25 * notti
    return totale
  }

  const gestisciPrenotazione = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.checkIn) errors.checkIn = 'Data check-in obbligatoria'
    if (!formData.checkOut) errors.checkOut = 'Data check-out obbligatoria'
    if (calcolaNotti() <= 0) errors.checkOut = 'Check-out deve essere dopo check-in'
    if (!guestData.nome) errors.nome = 'Nome obbligatorio'
    if (!guestData.cognome) errors.cognome = 'Cognome obbligatorio'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const notti = calcolaNotti()
    const totale = calcolaTotale(currentRoom, notti)

    const guestResult = await dispatch(addGuest(guestData))
    const guestId = guestResult.payload.id

    await dispatch(addBooking({
      userId: user.id,
      guestId,
      roomId: currentRoom.id,
      parkingId: formData.parkingId ? parseInt(formData.parkingId) : null,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      notti, totale, stato: 'confermata', pagamento: 'da_saldare',
    }))
    setSuccesso(true)
    setTimeout(() => navigate('/bookings'), 2000)
  }

  if (!currentRoom) return <p style={{ padding: '2rem', color: 'var(--text-muted)' }}>Caricamento camera...</p>

  const notti = calcolaNotti()
  const inputStyle = {
    display: 'block', width: '100%', padding: '0.6rem', marginTop: '0.4rem',
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    borderRadius: '8px', color: 'inherit', fontSize: '13px',
  }
  const labelStyle = { fontSize: '12px', color: 'var(--text-muted)' }
  const errStyle = { color: '#e07070', fontSize: '11px' }

  return (
    <div style={{ padding: '2rem', maxWidth: '650px' }}>
      <button onClick={() => navigate('/rooms')} style={{
        marginBottom: '1rem', cursor: 'pointer', background: 'none', border: 'none',
        color: 'var(--text-muted)', fontSize: '13px',
      }}>
        ← Torna alle camere
      </button>
      <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Camera {currentRoom.numeroStanza}</h1>
      <p style={{ marginTop: '0.5rem' }}><strong>Tipo:</strong> {currentRoom.tipo.toUpperCase()}</p>
      <p style={{ marginTop: '0.3rem' }}>{currentRoom.descrizione}</p>
      <p style={{ marginTop: '0.3rem' }}><strong>Prezzo:</strong> €{currentRoom.prezzoNotte}/notte</p>
      <p style={{ marginTop: '0.3rem' }}>
        <strong>Stato:</strong> {currentRoom.occupata ? 'Occupata' : 'Disponibile'}
      </p>

      {user && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--dark-border)', borderRadius: '12px', background: 'var(--dark-card)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Nuova prenotazione</h2>
          <form onSubmit={gestisciPrenotazione}>

            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#b49650', marginBottom: '0.8rem' }}>Dati prenotante</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input name="nome" value={guestData.nome} onChange={gestisciInputOspite} style={inputStyle} />
                {formErrors.nome && <span style={errStyle}>{formErrors.nome}</span>}
              </div>
              <div>
                <label style={labelStyle}>Cognome</label>
                <input name="cognome" value={guestData.cognome} onChange={gestisciInputOspite} style={inputStyle} />
                {formErrors.cognome && <span style={errStyle}>{formErrors.cognome}</span>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={guestData.email} onChange={gestisciInputOspite} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefono</label>
                <input type="tel" name="telefono" value={guestData.telefono} onChange={gestisciInputOspite} style={inputStyle} />
              </div>
            </div>

            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#b49650', marginBottom: '0.8rem' }}>Soggiorno</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Check-in</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={gestisciInput} style={inputStyle} />
                {formErrors.checkIn && <span style={errStyle}>{formErrors.checkIn}</span>}
              </div>
              <div>
                <label style={labelStyle}>Check-out</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={gestisciInput} style={inputStyle} />
                {formErrors.checkOut && <span style={errStyle}>{formErrors.checkOut}</span>}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Parcheggio (opzionale)</label>
              <select name="parkingId" value={formData.parkingId} onChange={gestisciInput} style={inputStyle}>
                <option value="">Nessun parcheggio</option>
                {parkings.filter(p => !p.occupato).map(p => (
                  <option key={p.id} value={p.id}>{p.numero} — €{p.prezzoNotte}/notte</option>
                ))}
              </select>
            </div>
            {notti > 0 && (
              <div style={{ background: 'rgba(180,150,80,0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ fontSize: '13px' }}>Notti: {notti}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '0.3rem' }}>Totale: €{calcolaTotale(currentRoom, notti)}</p>
              </div>
            )}
            {successo && <p style={{ color: '#5db87a', fontSize: '13px' }}>Prenotazione confermata!</p>}
            <button type="submit" style={{
              width: '100%', padding: '0.7rem', cursor: 'pointer', background: '#b49650',
              color: '#0d1b2a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
            }}>
              Conferma Prenotazione
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default RoomDetailPage