import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import localApi from '../../utils/localApi'

export const insertRoom = createAsyncThunk(
  'rooms/fetchALL',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localApi.get('/rooms')
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addRoom = createAsyncThunk(
  'rooms/add',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await localApi.post('/rooms', roomData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateRoom = createAsyncThunk(
  'rooms/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await localApi.patch(`/rooms/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeRoom = createAsyncThunk(
  'rooms/remove',
  async (Id, { rejectWithValue }) => {
    try {
      await localApi.delete(`/rooms/${Id}`)
      return Id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    currentRoom: null,
    status: 'in attesa',
    error: null,
  },
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertRoom.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(insertRoom.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(insertRoom.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.items.findIndex(r => r.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(removeRoom.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r.id !== action.payload)
      })
  },
})

export const { setCurrentRoom, clearError } = roomsSlice.actions
export default roomsSlice.reducer