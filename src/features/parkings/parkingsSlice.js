import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import localApi from '../../utils/localApi'

export const insertParking = createAsyncThunk(
  'parkings/fetchALL',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localApi.get('/parkings')
      return response.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeParking = createAsyncThunk(
  'parkings/remove',
  async (Id, { rejectWithValue }) => {
    try {
      await localApi.delete(`/parkings/${Id}`)
      return Id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const parkingsSlice = createSlice({
  name: 'parkings',
  initialState: {
    items: [],
    currentParking: null,
    status: 'in attesa',
    error: null,
  },
  reducers: {
    setCurrentParking: (state, action) => {
      state.currentParking = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertParking.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(insertParking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(insertParking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(removeParking.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload)
      })
  },
})

export const { setCurrentParking, clearError } = parkingsSlice.actions
export default parkingsSlice.reducer
