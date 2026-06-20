import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import roomsReducer from '../features/rooms/roomsSlice'
import bookingsReducer from '../features/bookings/bookingsSlice'
import parkingsReducer from '../features/parkings/parkingsSlice'
import guestsReducer from '../features/guests/guestsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
    parkings: parkingsReducer,
    guests: guestsReducer,
  },
})

export default store 

