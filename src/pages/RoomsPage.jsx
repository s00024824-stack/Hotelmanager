import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom } from '../features/rooms/roomsSlice'
import { useNavigate } from 'react-router-dom'

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

  const calcolaTotale = (camera, notti = 1) => {
    let totale = camera.prezzoNotte * notti
    if (camera.tipo === 'doppia' && camera.lettoAggiuntivo) totale += 20 * notti
    if (camera.tipo === 'suite') totale += 50
    return totale
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛏️ Camere</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setPagina(1) }}
          style={{ padding: '0.5rem', borderRadius: '4px' }}>
          <option value="tutti">Tutti i tipi</option>
          <option value="singola">Singola</option>
          <option value="doppia">Doppia</option>
          <option value="suite">Suite</option>
        </select>
        <select value={filtroDisponibilita} onChange={e => { setFiltroDisponibilita(e.target.value); setPagina(1) }}
          style={{ padding: '0.5rem', borderRadius: '4px' }}>
          <option value="tutte">Tutte</option>
          <option value="disponibili">Disponibili</option>
          <option value="occupate">Occupate</option>
        </select>
      </div>

      {status === 'loading' && <p>Caricamento...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {camereVisibili.map(camera => (
          <div key={camera.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', background: camera.occupata ? '#fff3f3' : '#f9f9f9' }}>
            <h3>Camera {camera.numeroStanza} — {camera.tipo.toUpperCase()}</h3>
            <p>{camera.descrizione}</p>
            <p><strong>Prezzo:</strong> €{camera.prezzoNotte}/notte</p>
            <p><strong>Totale 1 notte:</strong> €{calcolaTotale(camera, 1)}</p>
            <p><strong>Stato:</strong> {camera.occupata ? '🔴 Occupata' : '🟢 Disponibile'}</p>
            <button onClick={() => navigate(`/rooms/${camera.id}`)}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Dettagli
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
        <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>← Precedente</button>
        <span>Pagina {pagina} di {totPagine || 1}</span>
        <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totPagine || totPagine === 0}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Successiva →</button>
      </div>
    </div>
  )
}

export default RoomsPage