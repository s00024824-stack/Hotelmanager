# HotelManager — Gestionale Hotel

Progetto finale del corso Frontend Programming presso Epicode Institute of Technology.

## Descrizione

HotelManager è un'applicazione React per la gestione completa di un hotel, ispirata ai PMS (Property Management System) professionali utilizzati nel settore alberghiero. Permette al personale (Admin e Receptionist) di gestire camere, prenotazioni, check-in/check-out, anagrafica ospiti e parcheggi attraverso un'interfaccia moderna in stile dark theme.

## Tecnologie utilizzate

- React 18 + Vite
- Redux Toolkit + Redux Thunk — gestione stato globale
- React Router v6 — navigazione e routing
- Axios — chiamate HTTP
- JSON Server — backend simulato
- OpenWeather API — meteo in tempo reale
- Tabler Icons — set di icone

## Funzionalità principali

### Autenticazione e ruoli
Login con autenticazione fake e due ruoli distinti (Admin e Receptionist), ciascuno con permessi e viste differenziate tramite Protected Routes.

### Gestione camere
Listing camere con filtri per tipo e disponibilità, paginazione, immagini reali per ogni tipologia (singola, doppia, suite). Calcolo automatico del totale soggiorno con supplementi (letto aggiuntivo, suite).

### Prenotazioni
Form di prenotazione con raccolta dati del prenotante (nome, cognome, email, telefono), selezione date e parcheggio opzionale, calcolo automatico del totale.

### Check-in e Check-out
Flusso completo ispirato ai gestionali alberghieri professionali:
- Check-in: raccolta anagrafica completa dell'ospite (documento d'identità, data e luogo di nascita, cittadinanza, indirizzo)
- Check-out: liberazione automatica di camera e parcheggio, aggiornamento stato pagamento

### Filtri prenotazioni
Vista filtrata per stato (In arrivo, In casa, Partiti, Tutte), replicando l'interfaccia di un PMS reale.

### Planner
Vista calendario stile Gantt con camere sulle righe e giorni del mese sulle colonne, barre colorate per stato prenotazione, navigazione tra mesi.

### Dashboard amministrativa
Statistiche in tempo reale (camere disponibili, prenotazioni attive, guadagni totali, parcheggi liberi), gestione camere (aggiunta, eliminazione, liberazione manuale), gestione prenotazioni.

### Tema chiaro/scuro
Toggle dark/light mode gestito con useState e variabili CSS dinamiche.

## Struttura del progetto
src/

├── app/              → Redux store

├── features/         → Slice Redux (auth, rooms, bookings, parkings, guests)

├── pages/            → Pagine dell'applicazione

├── components/       → Componenti riutilizzabili (Sidebar)

└── utils/            → Configurazioni axios e validators

## Installazione e avvio

### 1. Clona il repository
git clone https://github.com/s00024824-stack/Hotelmanager.git

cd Hotelmanager

### 2. Installa le dipendenze
npm install

### 3. Configura le variabili d'ambiente
Crea un file `.env` nella root del progetto:
VITE_OPENWEATHER_KEY=la_tua_chiave_openweather

### 4. Avvia JSON Server (terminale 1)
npm run server

### 5. Avvia l'applicazione (terminale 2)
npm run dev

Apri il browser su `http://localhost:5173`

## Credenziali di accesso

| Ruolo | Email | Password |
|---|---|---|
| Admin | admin@hotel.com | admin123 |
| Receptionist | receptionist@hotel.com | recep123 |

## Collegamento al progetto OOP

Il frontend estende il progetto Java OOP GestionaleHotelReception sviluppato in precedenza. La gerarchia Camera, CameraSingola, CameraDoppia, Suite è replicata nel db.json, e il metodo calcolaTotale() è stato riscritto in JavaScript mantenendo la stessa logica di business. Parcheggio e Guest (anagrafica ospite) sono nuove entità aggiunte rispetto al progetto OOP originale.

## Note di sicurezza

L'autenticazione implementata è esclusivamente client-side, a scopo didattico. Non sono presenti hashing delle password né validazione lato server (JWT), pertanto il sistema non è da considerarsi sicuro per un ambiente di produzione reale.