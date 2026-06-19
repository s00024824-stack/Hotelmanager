import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import localApi from '../../utils/localApi'

export const insertBookings = createAsyncThunk (
    'bookings/fetchALL',
    async (_, {rejectWithValue}) => {
        try {
            const response = await localApi.get('/bookings')
            return response.data
        }catch (error) {
            return rejectWithValue( error.message)
        }
    }
)
export const addBooking = createAsyncThunk(
    'bookings/add',
    async (bookingData,{rejectWithValue}) => {
    try {
       const response = await localApi.post('/bookings', bookingData)
       await localApi.patch(`/rooms/${bookingData.roomId}`, {occupata:true})
       if(bookingData.parkingId) {
        await localApi.patch(`/parkings/${bookingData.parkingId}`,{occupato:true})
    }
    
        return response.data 
    }   catch (error) {
        return rejectWithValue (error.message) 
    }
 }
)
export const removeBooking = createAsyncThunk(
    'bookings/delete',
    async (booking,{rejectWithValue}) => {
      try {
        await localApi.delete(`/bookings/${booking.id}`)
        await localApi.patch(`/rooms/${booking.roomId}`, {occupata:false})
        if (booking.parkingId) {
            await localApi.patch(`/parkings/${booking.parkingId}`, {occupato: false})
        }
        return booking.id
    } catch (error) {
        return rejectWithValue(error.message)
    }
}
)
const bookingsSlice = createSlice({
    name : 'bookings',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers : {
        clearError:(state) => {
            state.error = null 
        },
    },
    extraReducers : (builder)=> {
        builder
        .addCase(insertBookings.pending, (state) => {
         state.status = 'loading'

        })
        .addCase(insertBookings.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })
        .addCase(insertBookings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
     
        })
        .addCase(removeBooking.fulfilled, (state,action) => {
           state.items = state.items.filter(b => b.id !== action.payload)
        })

    }
})
export const { clearError} = bookingsSlice.actions
export default bookingsSlice.reducer