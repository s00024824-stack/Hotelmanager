import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { insertRoom } from '../features/rooms/roomsSlice'
import { insertBookings } from '../features/bookings/bookingsSlice'
import { insertParking } from '../features/parkings/parkingsSlice'
import axios from 'axios'

function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: parkings } = useSelector(state => state.parkings)
  const [meteo, setMeteo] = useState(null)
  const [meteoError, setMeteoError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(insertRoom())
    dispatch(insertBookings())
    dispatch(insertParking())
  }, [user, dispatch])

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
  const parcheggiLiberi = parkings.filter(p => !p.occupato).length
  const totaleGuadagni = bookings.reduce((acc, b) => acc + b.totale, 0)

  const cardStyle = {
    background: 'rgba(13,27,42,0.75)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '1.2rem',
    flex: 1,
    minWidth: '180px',
  }

  const labelStyle = {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '0.5rem',
  }

  const numStyle = {
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
  }

  if (!user) return null

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(13,27,42,0.5), rgba(13,27,42,0.7)), url('https://plus.unsplash.com/premium_photo-1661928260943-4aa36c5e1acc?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
        <i className="ti ti-building" style={{ color: '#b49650' }}></i>
        Benvenuto, {user.username}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.3rem' }}>
        Gestionale Hotel — {new Date().toLocaleDateString('it-IT')}
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={labelStyle}>Camere disponibili</div>
              <div style={{ ...numStyle, color: '#5db87a' }}>
                {camereDisponibili}
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>/{rooms.length}</span>
              </div>
            </div>
            <i className="ti ti-bed" style={{ fontSize: '24px', color: '#b49650' }}></i>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={labelStyle}>Prenotazioni attive</div>
              <div style={{ ...numStyle, color: '#5b9bd5' }}>{prenotazioniAttive}</div>
            </div>
            <i className="ti ti-calendar-event" style={{ fontSize: '24px', color: '#b49650' }}></i>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={labelStyle}>Parcheggi liberi</div>
              <div style={numStyle}>{parcheggiLiberi}</div>
            </div>
            <i className="ti ti-parking" style={{ fontSize: '24px', color: '#b49650' }}></i>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={labelStyle}>Incassi totali</div>
              <div style={{ ...numStyle, color: '#b49650' }}>€{totaleGuadagni}</div>
            </div>
            <i className="ti ti-coin" style={{ fontSize: '24px', color: '#b49650' }}></i>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={labelStyle}>Meteo Lecce</div>
              {meteo ? (
                <>
                  <div style={{ ...numStyle, color: '#e0a050' }}>{Math.round(meteo.main.temp)}°C</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{meteo.weather[0].description}</div>
                </>
              ) : (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{meteoError || 'Caricamento...'}</div>
              )}
            </div>
            <i className="ti ti-sun" style={{ fontSize: '24px', color: '#b49650' }}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage