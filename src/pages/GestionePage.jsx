import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom, removeRoom, addRoom, updateRoom } from '../features/rooms/roomsSlice'
import { insertBookings, removeBooking } from '../features/bookings/bookingsSlice'
import { insertParking } from '../features/parkings/parkingsSlice'
import { insertGuests } from '../features/guests/guestsSlice'

function GestionePage() {
  const dispatch = useDispatch()
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: parkings } = useSelector(state => state.parkings)
  const { items: guests } = useSelector(state => state.guests)

  const [nuovaCamera, setNuovaCamera] = useState({
    tipo: 'singola', numeroStanza: '', prezzoNotte: '', descrizione: '', occupata: false, lettoAggiuntivo: false,
  })
  const [formCameraErrors, setFormCameraErrors] = useState({})
  const [successoCamera, setSuccessoCamera] = useState(false)

  useEffect(() => {
    dispatch(insertRoom())
    dispatch(insertBookings())
    dispatch(insertParking())
    dispatch(insertGuests())
  }, [dispatch])

  const totaleGuadagni = bookings.reduce((acc, booking) => acc + booking.totale, 0)

  const trovaOspite = (guestId) => guests.find(g => g.id === guestId)
  const trovaCamera = (roomId) => rooms.find(r => String(r.id) === String(roomId))

  const formatData = (data) => {
    if (!data) return '—'
    const [y, m, d] = data.split('-')
    return `${d}/${m}/${y}`
  }

  const gestisciInputCamera = (e) => {
    const { name, value, type, checked } = e.target
    setNuovaCamera(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFormCameraErrors(prev => ({ ...prev, [name]: '' }))
  }

  const gestisciNuovaCamera = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!nuovaCamera.numeroStanza) errors.numeroStanza = 'Numero stanza obbligatorio'
    if (!nuovaCamera.prezzoNotte) errors.prezzoNotte = 'Prezzo obbligatorio'
    if (!nuovaCamera.descrizione) errors.descrizione = 'Descrizione obbligatoria'
    if (Object.keys(errors).length > 0) {
      setFormCameraErrors(errors)
      return
    }
    await dispatch(addRoom({
      ...nuovaCamera,
      numeroStanza: parseInt(nuovaCamera.numeroStanza),
      prezzoNotte: parseFloat(nuovaCamera.prezzoNotte),
    }))
    setSuccessoCamera(true)
    setNuovaCamera({ tipo: 'singola', numeroStanza: '', prezzoNotte: '', descrizione: '', occupata: false, lettoAggiuntivo: false })
    setTimeout(() => setSuccessoCamera(false), 3000)
  }

  const liberaCamera = (camera) => {
    dispatch(updateRoom({ id: camera.id, data: { occupata: false } }))
  }

  const cardStyle = {
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    borderRadius: '12px', padding: '1.2rem', flex: 1, minWidth: '180px',
  }
  const inputStyle = {
    display: 'block', width: '100%', padding: '0.6rem', marginTop: '0.4rem',
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    borderRadius: '8px', color: 'inherit', fontSize: '13px',
  }
  const thStyle = { padding: '0.7rem', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }
  const tdStyle = { padding: '0.7rem', fontSize: '13px', borderBottom: '1px solid var(--dark-border)' }
  const btnAzione = (bg, color) => ({
    background: bg, color, border: 'none', padding: '0.4rem 0.8rem',
    cursor: 'pointer', borderRadius: '6px', fontSize: '12px', marginRight: '0.4rem',
  })

  const statoLabel = {
    confermata: 'Confermata',
    in_corso: 'In casa',
    completata: 'Completata',
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="ti ti-settings" style={{ color: '#b49650' }}></i>
        Gestione — ADMIN
      </h1>

      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Camere totali</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>{rooms.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disponibili</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#5db87a' }}>{rooms.filter(r => !r.occupata).length}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prenotazioni totali</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#5b9bd5' }}>{bookings.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Guadagni totali</div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#b49650' }}>€{totaleGuadagni}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Parcheggi liberi</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>{parkings.filter(p => !p.occupato).length}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.8rem' }}>Camere</h2>
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dark-border)' }}>
              <th style={thStyle}>Stanza</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Prezzo</th>
              <th style={thStyle}>Stato</th>
              <th style={thStyle}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(camera => (
              <tr key={camera.id}>
                <td style={tdStyle}>{camera.numeroStanza}</td>
                <td style={tdStyle}>{camera.tipo}</td>
                <td style={tdStyle}>€{camera.prezzoNotte}/notte</td>
                <td style={tdStyle}>{camera.occupata ? 'Occupata' : 'Disponibile'}</td>
                <td style={tdStyle}>
                  {camera.occupata && (
                    <button onClick={() => liberaCamera(camera)} style={btnAzione('rgba(93,184,122,0.15)', '#5db87a')}>
                      Libera
                    </button>
                  )}
                  <button onClick={() => dispatch(removeRoom(camera.id))} style={btnAzione('rgba(224,112,112,0.15)', '#e07070')}>
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.8rem' }}>Prenotazioni</h2>
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dark-border)' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Ospite</th>
              <th style={thStyle}>Camera</th>
              <th style={thStyle}>Check-in</th>
              <th style={thStyle}>Check-out</th>
              <th style={thStyle}>Totale</th>
              <th style={thStyle}>Stato</th>
              <th style={thStyle}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => {
              const ospite = trovaOspite(booking.guestId)
              const camera = trovaCamera(booking.roomId)
              return (
                <tr key={booking.id}>
                  <td style={tdStyle}>#{String(booking.id).slice(0, 5)}</td>
                  <td style={tdStyle}>{ospite ? `${ospite.nome} ${ospite.cognome}` : '—'}</td>
                  <td style={tdStyle}>{camera ? camera.numeroStanza : booking.roomId}</td>
                  <td style={tdStyle}>{formatData(booking.checkIn)}</td>
                  <td style={tdStyle}>{formatData(booking.checkOut)}</td>
                  <td style={tdStyle}>€{booking.totale}</td>
                  <td style={tdStyle}>{statoLabel[booking.stato] || booking.stato}</td>
                  <td style={tdStyle}>
                    <button onClick={() => dispatch(removeBooking(booking))} style={btnAzione('rgba(224,112,112,0.15)', '#e07070')}>
                      Elimina
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.8rem' }}>Aggiungi nuova camera</h2>
      <form onSubmit={gestisciNuovaCamera} style={{ maxWidth: '500px', background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tipo camera</label>
          <select name="tipo" value={nuovaCamera.tipo} onChange={gestisciInputCamera} style={inputStyle}>
            <option value="singola">Singola</option>
            <option value="doppia">Doppia</option>
            <option value="suite">Suite</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Numero stanza</label>
          <input type="number" name="numeroStanza" value={nuovaCamera.numeroStanza} onChange={gestisciInputCamera} style={inputStyle} />
          {formCameraErrors.numeroStanza && <span style={{ color: '#e07070', fontSize: '12px' }}>{formCameraErrors.numeroStanza}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prezzo per notte (€)</label>
          <input type="number" name="prezzoNotte" value={nuovaCamera.prezzoNotte} onChange={gestisciInputCamera} style={inputStyle} />
          {formCameraErrors.prezzoNotte && <span style={{ color: '#e07070', fontSize: '12px' }}>{formCameraErrors.prezzoNotte}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Descrizione</label>
          <textarea name="descrizione" value={nuovaCamera.descrizione} onChange={gestisciInputCamera} rows={3} style={inputStyle} />
          {formCameraErrors.descrizione && <span style={{ color: '#e07070', fontSize: '12px' }}>{formCameraErrors.descrizione}</span>}
        </div>
        {nuovaCamera.tipo === 'doppia' && (
          <div style={{ marginBottom: '1rem', fontSize: '13px' }}>
            <label>
              <input type="checkbox" name="lettoAggiuntivo" checked={nuovaCamera.lettoAggiuntivo} onChange={gestisciInputCamera} style={{ marginRight: '0.5rem' }} />
              Letto aggiuntivo (+€20/notte)
            </label>
          </div>
        )}
        {successoCamera && <p style={{ color: '#5db87a', fontSize: '13px' }}>Camera aggiunta con successo!</p>}
        <button type="submit" style={{
          width: '100%', padding: '0.7rem', cursor: 'pointer', background: '#b49650',
          color: '#0d1b2a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
        }}>
          Aggiungi Camera
        </button>
      </form>
    </div>
  )
}

export default GestionePage