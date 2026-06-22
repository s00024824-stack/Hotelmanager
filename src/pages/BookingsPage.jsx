import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertBookings, removeBooking } from '../features/bookings/bookingsSlice'
import { insertRoom } from '../features/rooms/roomsSlice'
import { insertGuests } from '../features/guests/guestsSlice'

function BookingsPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: guests } = useSelector(state => state.guests)
  const [filtroStato, setFiltroStato] = useState('tutte')

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

  const statoLabel = {
    confermata: 'Confermata',
    in_corso: 'In casa',
    completata: 'Completata',
  }

  const filtri = [
    { key: 'tutte', label: 'Tutte' },
    { key: 'confermata', label: 'In arrivo' },
    { key: 'in_corso', label: 'In casa' },
    { key: 'completata', label: 'Partiti' },
  ]

  const prenotazioniOrdinate = [...bookings]
    .filter(b => filtroStato === 'tutte' || b.stato === filtroStato)
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))

  const thStyle = { padding: '0.7rem', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }
  const tdStyle = { padding: '0.7rem', fontSize: '13px', borderBottom: '1px solid var(--dark-border)' }
  const btnAzione = (bg, color) => ({
    background: bg, color, border: 'none', padding: '0.4rem 0.8rem',
    cursor: 'pointer', borderRadius: '6px', fontSize: '12px', marginRight: '0.4rem',
  })

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="ti ti-calendar-event" style={{ color: '#b49650' }}></i>
        Prenotazioni
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', flexWrap: 'wrap', gap: '0.6rem' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {prenotazioniOrdinate.length} prenotazion{prenotazioniOrdinate.length === 1 ? 'e' : 'i'} {filtroStato !== 'tutte' ? `(${statoLabel[filtroStato] || filtroStato})` : 'totali'}
        </span>
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

      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '12px', overflow: 'hidden' }}>
        {prenotazioniOrdinate.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            <i className="ti ti-calendar-off" style={{ fontSize: '32px', display: 'block', marginBottom: '0.5rem' }}></i>
            Nessuna prenotazione al momento.
          </div>
        ) : (
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
              {prenotazioniOrdinate.map(booking => {
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
                      {user?.role === 'admin' && (
                        <button onClick={() => dispatch(removeBooking(booking))} style={btnAzione('rgba(224,112,112,0.15)', '#e07070')}>
                          Elimina
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default BookingsPage