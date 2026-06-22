import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertBookings, checkInBooking, checkOutBooking } from '../features/bookings/bookingsSlice'
import { insertRoom } from '../features/rooms/roomsSlice'
import { insertGuests } from '../features/guests/guestsSlice'

function CheckInPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: guests } = useSelector(state => state.guests)

  const [filtroStato, setFiltroStato] = useState('confermata')
  const [checkinAperto, setCheckinAperto] = useState(null)
  const [datiDocumento, setDatiDocumento] = useState({
    dataNascita: '', luogoNascita: '', indirizzo: '', cittadinanza: '',
    tipoDocumento: "Carta d'identità", numeroDocumento: '', luogoRilascio: '',
  })

  useEffect(() => {
    dispatch(insertBookings())
    dispatch(insertRoom())
    dispatch(insertGuests())
  }, [dispatch])

  const trovaOspite = (guestId) => guests.find(g => g.id === guestId)
  const trovaCamera = (roomId) => rooms.find(r => String(r.id) === String(roomId))

  const formatData = (data) => {
    if (!data) return '—'
    const [y, m, d] = data.split('-')
    return `${d}/${m}/${y}`
  }

  const gestisciInputDocumento = (e) => {
    const { name, value } = e.target
    setDatiDocumento(prev => ({ ...prev, [name]: value }))
  }

  const apriCheckin = (booking) => {
    setCheckinAperto(booking.id)
    setDatiDocumento({
      dataNascita: '', luogoNascita: '', indirizzo: '', cittadinanza: '',
      tipoDocumento: "Carta d'identità", numeroDocumento: '', luogoRilascio: '',
    })
  }

  const confermaCheckin = async (booking) => {
    if (!datiDocumento.numeroDocumento) {
      alert('Numero documento obbligatorio per il check-in')
      return
    }
    await dispatch(checkInBooking({
    bookingId: booking.id,
    guestId: booking.guestId,
    datiDocumento,
    roomId: booking.roomId,
    parkingId: booking.parkingId,
}))

    setCheckinAperto(null)
  }

  const gestisciCheckout = async (booking) => {
    await dispatch(checkOutBooking(booking))
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

  const filtri = [
    { key: 'confermata', label: 'In arrivo' },
    { key: 'in_corso', label: 'In casa' },
    { key: 'completata', label: 'Partiti' },
    { key: 'tutte', label: 'Tutte' },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="ti ti-door-enter" style={{ color: '#b49650' }}></i>
        Check-in / Check-out — {user?.role?.toUpperCase()}
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', flexWrap: 'wrap', gap: '0.6rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Prenotazioni</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filtri.map(f => (
            <button key={f.key} onClick={() => setFiltroStato(f.key)} style={{
              padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
              border: '1px solid var(--dark-border)',
              background: filtroStato === f.key ? '#b49650' : 'var(--dark-card)',
              color: filtroStato === f.key ? '#0d1b2a' : 'var(--text-muted)',
              fontWeight: filtroStato === f.key ? '600' : '400',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

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
            {bookings
              .filter(b => filtroStato === 'tutte' || b.stato === filtroStato)
              .map(booking => {
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
                      {booking.stato === 'confermata' && (
                        <button onClick={() => apriCheckin(booking)} style={btnAzione('rgba(91,155,213,0.15)', '#5b9bd5')}>
                          Check-in
                        </button>
                      )}
                      {booking.stato === 'in_corso' && (
                        <button onClick={() => gestisciCheckout(booking)} style={btnAzione('rgba(93,184,122,0.15)', '#5db87a')}>
                          Check-out
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {checkinAperto && (
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '1rem', color: '#b49650' }}>
            Check-in — Documento ospite
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Data di nascita</label>
              <input type="date" name="dataNascita" value={datiDocumento.dataNascita} onChange={gestisciInputDocumento} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Luogo di nascita</label>
              <input name="luogoNascita" value={datiDocumento.luogoNascita} onChange={gestisciInputDocumento} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Indirizzo</label>
            <input name="indirizzo" value={datiDocumento.indirizzo} onChange={gestisciInputDocumento} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cittadinanza</label>
            <input name="cittadinanza" value={datiDocumento.cittadinanza} onChange={gestisciInputDocumento} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tipo documento</label>
              <select name="tipoDocumento" value={datiDocumento.tipoDocumento} onChange={gestisciInputDocumento} style={inputStyle}>
                <option>Carta d'identità</option>
                <option>Passaporto</option>
                <option>Patente</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>N. documento</label>
              <input name="numeroDocumento" value={datiDocumento.numeroDocumento} onChange={gestisciInputDocumento} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Luogo di rilascio</label>
            <input name="luogoRilascio" value={datiDocumento.luogoRilascio} onChange={gestisciInputDocumento} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={() => confermaCheckin(bookings.find(b => b.id === checkinAperto))} style={{
              flex: 1, padding: '0.7rem', cursor: 'pointer', background: '#b49650',
              color: '#0d1b2a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
            }}>
              Conferma Check-in
            </button>
            <button onClick={() => setCheckinAperto(null)} style={{
              padding: '0.7rem 1rem', cursor: 'pointer', background: 'transparent',
              color: 'var(--text-muted)', border: '1px solid var(--dark-border)', borderRadius: '8px', fontSize: '13px',
            }}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInPage