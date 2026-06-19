import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom } from '../features/rooms/roomsSlice'
import { insertBookings } from '../features/bookings/bookingsSlice'
import axios from 'axios'

function HomePage() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: bookings } = useSelector(state => state.bookings)
  const [meteo, setMeteo] = useState(null)
  const [meteoError, setMeteoError] = useState(null)

  useEffect(() => {
    dispatch(insertRoom())
    dispatch(insertBookings())
  }, [dispatch])

  useEffect(() => {
    const fetchMeteo = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Lecce&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&units=metric&lang=it`
        )
        setMeteo(response.data)
      } catch (error) {
        setMeteoError('Meteo non disponibile')
      }
    }
    fetchMeteo()
  }, [])
  const camereDisponibili = rooms.filter(r => !r.occupata).length
  const prenotazioniAttive = bookings.filter(b => b.stato === 'confermata').length

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏨 Benvenuto, {user ? user.username : 'Ospite'}!</h1>
      <p style={{ color: '#666' }}>Gestionale Hotel — {new Date().toLocaleDateString('it-IT')}</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#e8f5e9', padding: '1.5rem', borderRadius: '8px', minWidth: '200px' }}>
          <h3>🛏️ Camere Disponibili</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>{camereDisponibili}</p>
        </div>
        <div style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '8px', minWidth: '200px' }}>
          <h3>📋 Prenotazioni Attive</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1565c0' }}>{prenotazioniAttive}</p>
        </div>
        <div style={{ background: '#fff3e0', padding: '1.5rem', borderRadius: '8px', minWidth: '200px' }}>
          <h3>🌤️ Meteo Lecce</h3>
          {meteo ? (
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>
                {Math.round(meteo.main.temp)}°C
              </p>
              <p style={{ color: '#666' }}>{meteo.weather[0].description}</p>
            </div>
          ) : (
            <p>{meteoError || 'Caricamento...'}</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Camere Totali: {rooms.length}</h2>
        <p>Parcheggi disponibili nel sistema: {rooms.length} posti coperti</p>
      </div>
    </div>
  )
}

export default HomePage
