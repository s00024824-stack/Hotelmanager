import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom, setCurrentRoom } from '../features/rooms/roomsSlice'
import { addBooking } from '../features/bookings/bookingsSlice'
import { validateRequired } from '../utils/validators'

function RoomDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: rooms, currentRoom } = useSelector(state => state.rooms)
  const { user } = useSelector(state => state.auth)
  const { items: parkings } = useSelector(state => state.parkings)

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    parkingId: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [successo, setSuccesso] = useState(false)

  useEffect(() => {
    if (rooms.length === 0) dispatch(insertRoom())
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
    if (calcolaNotti() <= 0) errors.checkOut = 'Data check-out deve essere dopo check-in'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const notti = calcolaNotti()
    const totale = calcolaTotale(currentRoom, notti)

    const nuovaPrenotazione = {
      userId: user.id,
      roomId: currentRoom.id,
      parkingId: formData.parkingId ? parseInt(formData.parkingId) : null,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      notti,
      totale,
      stato: 'confermata',
    }

    await dispatch(addBooking(nuovaPrenotazione))
    setSuccesso(true)
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  if (!currentRoom) return <p style={{ padding: '2rem' }}>Caricamento camera...</p>

  const notti = calcolaNotti()

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/rooms')} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
        ← Torna alle camere
      </button>
      <h1>Camera {currentRoom.numeroStanza}</h1>
      <p><strong>Tipo:</strong> {currentRoom.tipo.toUpperCase()}</p>
      <p><strong>Descrizione:</strong> {currentRoom.descrizione}</p>
      <p><strong>Prezzo per notte:</strong> €{currentRoom.prezzoNotte}</p>
      {currentRoom.tipo === 'doppia' && (
        <p><strong>Letto aggiuntivo:</strong> {currentRoom.lettoAggiuntivo ? 'Sì (+€20/notte)' : 'No'}</p>
      )}
      {currentRoom.tipo === 'suite' && (
        <p><strong>Supplemento suite:</strong> +€50 fissi</p>
      )}
      <p><strong>Stato:</strong> {currentRoom.occupata ? '🔴 Occupata' : '🟢 Disponibile'}</p>

      {!currentRoom.occupata && user && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>📋 Nuova Prenotazione</h2>
          <form onSubmit={gestisciPrenotazione}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Check-in</label>
              <input type="date" name="checkIn" value={formData.checkIn}
                onChange={gestisciInput}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
              {formErrors.checkIn && <span style={{ color: 'red' }}>{formErrors.checkIn}</span>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Check-out</label>
              <input type="date" name="checkOut" value={formData.checkOut}
                onChange={gestisciInput}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
              {formErrors.checkOut && <span style={{ color: 'red' }}>{formErrors.checkOut}</span>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Parcheggio (opzionale)</label>
              <select name="parkingId" value={formData.parkingId}
                onChange={gestisciInput}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}>
                <option value="">Nessun parcheggio</option>
                {parkings.filter(p => !p.occupato).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.numero} — €25/notte
                  </option>
                ))}
              </select>
            </div>
            {notti > 0 && (
              <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                <p><strong>Notti:</strong> {notti}</p>
                <p><strong>Totale stimato:</strong> €{calcolaTotale(currentRoom, notti)}</p>
              </div>
            )}
            {successo && <p style={{ color: 'green' }}>✅ Prenotazione confermata! Reindirizzamento...</p>}
            <button type="submit"
              style={{ width: '100%', padding: '0.7rem', cursor: 'pointer', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px' }}>
              Conferma Prenotazione
            </button>
          </form>
        </div>
      )}
      {currentRoom.occupata && (
        <p style={{ color: 'red', marginTop: '1rem' }}>❌ Camera non disponibile per prenotazioni</p>
      )}
    </div>
  )
}

export default RoomDetailPage