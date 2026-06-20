import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import localApi from '../../utils/localApi'

export const insertGuests = createAsyncThunk(
  'guests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localApi.get('/guests')
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addGuest = createAsyncThunk(
  'guests/add',
  async (guestData, { rejectWithValue }) => {
    try {
      const response = await localApi.post('/guests', guestData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateGuest = createAsyncThunk(
  'guests/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await localApi.patch(`/guests/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const guestsSlice = createSlice({
  name: 'guests',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(insertGuests.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addGuest.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateGuest.fulfilled, (state, action) => {
        const index = state.items.findIndex(g => g.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
  },
})

export default guestsSlice.reducer
