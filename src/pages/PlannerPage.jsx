import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { insertRoom } from '../features/rooms/roomsSlice'
import { insertBookings } from '../features/bookings/bookingsSlice'
import { insertGuests } from '../features/guests/guestsSlice'

function PlannerPage() {
  const dispatch = useDispatch()
  const { items: rooms } = useSelector(state => state.rooms)
  const { items: bookings } = useSelector(state => state.bookings)
  const { items: guests } = useSelector(state => state.guests)
  const [meseOffset, setMeseOffset] = useState(0)

  useEffect(() => {
    dispatch(insertRoom())
    dispatch(insertBookings())
    dispatch(insertGuests())
  }, [dispatch])

  const oggi = new Date()
  const baseDate = new Date(oggi.getFullYear(), oggi.getMonth() + meseOffset, 1)
  const giorniNelMese = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate()
  const giorni = Array.from({ length: giorniNelMese }, (_, i) => new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1))

  const nomeMese = baseDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

  const trovaOspite = (guestId) => guests.find(g => g.id === guestId)

  const coloriStato = {
    confermata: '#5b9bd5',
    in_corso: '#5db87a',
    completata: 'rgba(255,255,255,0.2)',
  }

  const calcolaPosizioneBarra = (booking) => {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const meseInizio = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
    const meseFine = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)

    if (checkOut < meseInizio || checkIn > meseFine) return null

    const inizioVisibile = checkIn < meseInizio ? meseInizio : checkIn
    const fineVisibile = checkOut > meseFine ? meseFine : checkOut

    const giornoInizio = inizioVisibile.getDate()
    const giornoFine = fineVisibile.getDate()
    const durata = giornoFine - giornoInizio + 1

    return { giornoInizio, durata }
  }

  const cellWidth = 36

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="ti ti-calendar" style={{ color: '#b49650' }}></i>
        Planner
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
        <button onClick={() => setMeseOffset(m => m - 1)} style={{
          padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--dark-card)',
          border: '1px solid var(--dark-border)', color: 'inherit', borderRadius: '8px', fontSize: '12px',
        }}>← Mese prec.</button>
        <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' }}>{nomeMese}</span>
        <button onClick={() => setMeseOffset(m => m + 1)} style={{
          padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--dark-card)',
          border: '1px solid var(--dark-border)', color: 'inherit', borderRadius: '8px', fontSize: '12px',
        }}>Mese succ. →</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#5b9bd5', borderRadius: '2px', marginRight: '4px' }}></span>Confermata</span>
        <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#5db87a', borderRadius: '2px', marginRight: '4px' }}></span>In casa</span>
        <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginRight: '4px' }}></span>Completata</span>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--dark-border)', borderRadius: '12px', background: 'var(--dark-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${giorniNelMese}, ${cellWidth}px)`, minWidth: 'fit-content' }}>

          <div style={{ padding: '0.6rem', fontSize: '11px', fontWeight: '600', borderBottom: '1px solid var(--dark-border)', borderRight: '1px solid var(--dark-border)', position: 'sticky', left: 0, background: 'var(--dark-card)', zIndex: 2 }}>
            Camera
          </div>
          {giorni.map(g => (
            <div key={g.toISOString()} style={{
              padding: '0.4rem 0', fontSize: '10px', textAlign: 'center',
              borderBottom: '1px solid var(--dark-border)', borderRight: '1px solid var(--dark-border)',
              color: g.toDateString() === oggi.toDateString() ? '#b49650' : 'var(--text-muted)',
              fontWeight: g.toDateString() === oggi.toDateString() ? '700' : '400',
            }}>
              {g.getDate()}
            </div>
          ))}

          {rooms.map(camera => (
            <>
              <div key={`label-${camera.id}`} style={{
                padding: '0.7rem 0.6rem', fontSize: '12px', borderBottom: '1px solid var(--dark-border)',
                borderRight: '1px solid var(--dark-border)', position: 'sticky', left: 0, background: 'var(--dark-card)', zIndex: 1,
              }}>
                {camera.numeroStanza}
              </div>
              <div key={`row-${camera.id}`} style={{
                gridColumn: `2 / span ${giorniNelMese}`, display: 'grid',
                gridTemplateColumns: `repeat(${giorniNelMese}, ${cellWidth}px)`,
                position: 'relative', borderBottom: '1px solid var(--dark-border)',
              }}>
                {giorni.map((g, i) => (
                  <div key={i} style={{ borderRight: '1px solid var(--dark-border)', height: '40px' }}></div>
                ))}
                {bookings.filter(b => String(b.roomId) === String(camera.id)).map(booking => {
                  const pos = calcolaPosizioneBarra(booking)
                  if (!pos) return null
                  const ospite = trovaOspite(booking.guestId)
                  return (
                    <div key={booking.id} title={ospite ? `${ospite.nome} ${ospite.cognome}` : ''} style={{
                      position: 'absolute',
                      left: `${(pos.giornoInizio - 1) * cellWidth}px`,
                      width: `${pos.durata * cellWidth - 2}px`,
                      top: '6px', height: '28px',
                      background: coloriStato[booking.stato] || '#888',
                      borderRadius: '4px', fontSize: '10px', color: 'white',
                      display: 'flex', alignItems: 'center', padding: '0 6px',
                      overflow: 'hidden', whiteSpace: 'nowrap',
                    }}>
                      {ospite ? `${ospite.nome} ${ospite.cognome}` : 'Prenotato'}
                    </div>
                  )
                })}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlannerPage