🏨 HotelManager — Gestionale Hotel
Progetto finale del corso Frontend Programming presso Epicode Institute of Technology.
📋 Descrizione
HotelManager è un'applicazione React per la gestione di un hotel. Permette al personale (Admin e Receptionist) di gestire camere, prenotazioni e parcheggi. Il progetto estende il dominio del progetto OOP Java precedentemente sviluppato, aggiungendo un'interfaccia frontend completa.
🚀 Tecnologie utilizzate

React 18 + Vite
Redux Toolkit + Redux Thunk — gestione stato globale
React Router v6 — navigazione e routing
Axios — chiamate HTTP
JSON Server — backend simulato
OpenWeather API — meteo in tempo reale

⚙️ Installazione e avvio
1. Clona il repository
git clone https://github.com/s00024824-stack/Hotelmanager.git

cd Hotelmanager
2. Installa le dipendenze
npm install
3. Configura le variabili d'ambiente
Crea un file .env nella root del progetto:

VITE_OPENWEATHER_KEY=la_tua_chiave_openweather
4. Avvia JSON Server (terminale 1)
npm run server
5. Avvia l'applicazione (terminale 2)
npm run dev
Apri il browser su http://localhost:5173
👥 Credenziali di accesso
RuoloEmailPasswordAdminadmin@hotel.comadmin123Receptionistreceptionist@hotel.comrecep123
📄 Funzionalità

Login con autenticazione fake e 2 ruoli (Admin, Receptionist)
Homepage con statistiche e meteo in tempo reale (OpenWeather API)
Lista camere con filtri per tipo e disponibilità + paginazione
Dettaglio camera con form prenotazione
Dashboard admin con gestione prenotazioni e camere
Profilo utente modificabile
Gestione parcheggi coperti
Calcolo totale prenotazione (logica OOP replicata in JavaScript)
Protected Routes in base al ruolo

🔗 Collegamento al progetto OOP
Il frontend estende il progetto Java OOP GestionaleHotelReception. La gerarchia Camera → CameraSingola, CameraDoppia, Suite è replicata nel db.json. Il calcolaTotale() è stato riscritto in JavaScript con la stessa logica. Il Parcheggio è una nuova entità aggiunta rispetto al progetto OOP originale.

