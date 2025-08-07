// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from './authAPI';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk to login
export const loginUser = createAsyncThunk<
    { token: string },
    { email: string; password: string },
    { rejectValue: string }
>('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const data = await login(credentials);
    localStorage.setItem('token', data.token); // ✅ Save token
    return data;
  } catch (error: unknown) {
    console.error('Login failed:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Login failed';
        });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
