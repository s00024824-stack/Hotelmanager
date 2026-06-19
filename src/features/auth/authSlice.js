import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import localApi from '../../utils/localApi'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await localApi.get('/users')
      const user = response.data.find(
        (u) => u.email === email && u.password === password
      )
      if (!user) throw new Error('Credenziali non valide')
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.error = null
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(loginUser.fulfilled, (state, action) =>{
        state.isLoading = false
        state.user = action.payload
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false 
        state.error = action.payload
    })
},
})
export const { logout } = authSlice.actions
export default authSlice.reducer 

