import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom, removeRoom } from '../features/rooms/roomsSlice'
import { insertBookings, removeBooking } from '../features/bookings/bookingsSlice'
import { insertParking } from '../features/parkings/parkingsSlice'

function DashboardPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: parkings } = useSelector(state => state.parkings)

  useEffect(() => {
    dispatch(insertRoom())
    dispatch(insertBookings())
    dispatch(insertParking())
  }, [dispatch])

  const calcolaTotale = (camera, notti) => {
    let totale = camera.prezzoNotte * notti
    if (camera.tipo === 'doppia' && camera.lettoAggiuntivo) totale += 20 * notti
    if (camera.tipo === 'suite') totale += 50
    return totale
  }

  const totaleGuadagni = bookings.reduce((acc, booking) => acc + booking.totale, 0)

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Dashboard — {user?.role?.toUpperCase()}</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#e8f5e9', padding: '1.5rem', borderRadius: '8px', minWidth: '180px' }}>
          <h3>🛏️ Camere Totali</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{rooms.length}</p>
        </div>
        <div style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '8px', minWidth: '180px' }}>
          <h3>✅ Disponibili</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>
            {rooms.filter(r => !r.occupata).length}
          </p>
        </div>
        <div style={{ background: '#fff3e0', padding: '1.5rem', borderRadius: '8px', minWidth: '180px' }}>
          <h3>📋 Prenotazioni</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e65100' }}>{bookings.length}</p>
        </div>
        <div style={{ background: '#fce4ec', padding: '1.5rem', borderRadius: '8px', minWidth: '180px' }}>
          <h3>💰 Guadagni Totali</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c62828' }}>€{totaleGuadagni}</p>
        </div>
        <div style={{ background: '#f3e5f5', padding: '1.5rem', borderRadius: '8px', minWidth: '180px' }}>
          <h3>🅿️ Parcheggi</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6a1b9a' }}>
            {parkings.filter(p => !p.occupato).length} liberi
          </p>
        </div>
      </div>

      <h2>📋 Lista Prenotazioni</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Camera</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Check-in</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Check-out</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Notti</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Totale</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Stato</th>
            {user?.role === 'admin' && <th style={{ padding: '0.7rem' }}>Azioni</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.7rem' }}>#{booking.id}</td>
              <td style={{ padding: '0.7rem' }}>Camera {booking.roomId}</td>
              <td style={{ padding: '0.7rem' }}>{booking.checkIn}</td>
              <td style={{ padding: '0.7rem' }}>{booking.checkOut}</td>
              <td style={{ padding: '0.7rem' }}>{booking.notti}</td>
              <td style={{ padding: '0.7rem' }}>€{booking.totale}</td>
              <td style={{ padding: '0.7rem' }}>{booking.stato}</td>
              {user?.role === 'admin' && (
                <td style={{ padding: '0.7rem' }}>
                  <button onClick={() => dispatch(removeBooking(booking))}
                    style={{ background: '#e53935', color: 'white', border: 'none', padding: '0.3rem 0.7rem', cursor: 'pointer', borderRadius: '4px' }}>
                    Elimina
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {user?.role === 'admin' && (
        <>
          <h2>🛏️ Gestione Camere</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Stanza</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Prezzo</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Stato</th>
                <th style={{ padding: '0.7rem' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(camera => (
                <tr key={camera.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.7rem' }}>{camera.numeroStanza}</td>
                  <td style={{ padding: '0.7rem' }}>{camera.tipo}</td>
                  <td style={{ padding: '0.7rem' }}>€{camera.prezzoNotte}/notte</td>
                  <td style={{ padding: '0.7rem' }}>{camera.occupata ? '🔴 Occupata' : '🟢 Disponibile'}</td>
                  <td style={{ padding: '0.7rem' }}>
                    <button onClick={() => dispatch(removeRoom(camera.id))}
                      style={{ background: '#e53935', color: 'white', border: 'none', padding: '0.3rem 0.7rem', cursor: 'pointer', borderRadius: '4px' }}>
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default DashboardPage
