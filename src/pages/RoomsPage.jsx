import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom } from '../features/rooms/roomsSlice'
import { useNavigate } from 'react-router-dom'

const immaginiCamere = {
  singola: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
  doppia: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
  suite: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
}

function RoomsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: rooms, status } = useSelector(state => state.rooms)
  const [filtroTipo, setFiltroTipo] = useState('tutti')
  const [filtroDisponibilita, setFiltroDisponibilita] = useState('tutte')
  const [pagina, setPagina] = useState(1)
  const perPagina = 3

  useEffect(() => {
    dispatch(insertRoom())
  }, [dispatch])

  const camereFiltrate = rooms
    .filter(r => filtroTipo === 'tutti' || r.tipo === filtroTipo)
    .filter(r => {
      if (filtroDisponibilita === 'disponibili') return !r.occupata
      if (filtroDisponibilita === 'occupate') return r.occupata
      return true
    })

  const totPagine = Math.ceil(camereFiltrate.length / perPagina)
  const camereVisibili = camereFiltrate.slice((pagina - 1) * perPagina, pagina * perPagina)

  const inputStyle = {
    padding: '0.6rem 0.8rem', borderRadius: '8px',
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    color: 'inherit', fontSize: '13px',
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="ti ti-bed" style={{ color: '#b49650' }}></i>
        Camere
      </h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setPagina(1) }} style={inputStyle}>
          <option value="tutti">Tutti i tipi</option>
          <option value="singola">Singola</option>
          <option value="doppia">Doppia</option>
          <option value="suite">Suite</option>
        </select>
        <select value={filtroDisponibilita} onChange={e => { setFiltroDisponibilita(e.target.value); setPagina(1) }} style={inputStyle}>
          <option value="tutte">Tutte</option>
          <option value="disponibili">Disponibili</option>
          <option value="occupate">Occupate</option>
        </select>
      </div>

      {status === 'loading' && <p style={{ color: 'var(--text-muted)' }}>Caricamento...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {camereVisibili.map(camera => (
          <div key={camera.id} style={{
            border: '1px solid var(--dark-border)', borderRadius: '12px', overflow: 'hidden',
            background: 'var(--dark-card)',
          }}>
            <div style={{
              height: '140px',
              backgroundImage: `url('${immaginiCamere[camera.tipo] || immaginiCamere.singola}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: '10px', right: '10px',
                fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                background: camera.occupata ? 'rgba(224,112,112,0.9)' : 'rgba(93,184,122,0.9)',
                color: 'white',
              }}>
                {camera.occupata ? 'Occupata' : 'Disponibile'}
              </span>
            </div>
            <div style={{ padding: '1.2rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Camera {camera.numeroStanza}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {camera.tipo}
              </p>
              <p style={{ fontSize: '13px', marginTop: '0.6rem', color: 'var(--text-muted)' }}>{camera.descrizione}</p>
              <p style={{ fontSize: '14px', marginTop: '0.6rem', fontWeight: '600' }}>
                €{camera.prezzoNotte}<span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-muted)' }}>/notte</span>
              </p>
              <button onClick={() => navigate(`/rooms/${camera.id}`)} style={{
                marginTop: '0.8rem', padding: '0.6rem', cursor: 'pointer', width: '100%',
                background: '#b49650', color: '#0d1b2a', border: 'none', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600',
              }}>
                Dettagli
              </button>
            </div>
          </div>
        ))}
      </div>

      {camereVisibili.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Nessuna camera trovata con questi filtri.</p>
      )}

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', alignItems: 'center' }}>
        <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1} style={{
          padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--dark-card)',
          border: '1px solid var(--dark-border)', color: 'inherit', borderRadius: '8px', fontSize: '12px',
        }}>← Precedente</button>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pagina {pagina} di {totPagine || 1}</span>
        <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totPagine || totPagine === 0} style={{
          padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--dark-card)',
          border: '1px solid var(--dark-border)', color: 'inherit', borderRadius: '8px', fontSize: '12px',
        }}>Successiva →</button>
      </div>
    </div>
  )
}

export default RoomsPage