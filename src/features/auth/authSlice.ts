// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login } from './authAPI';
import type { LoginResponse } from './authAPI';

interface AuthState {
  user: LoginResponse['user'] | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

// thunk calls the login function from authAPI
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const data = await login(credentials)
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
  },
})

export const { logout, clearError } = authSlice.actions

export default authSlice.reducer
