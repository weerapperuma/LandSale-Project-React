// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from './authAPI';

interface AuthState {
  token: string | null;
  userId: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  loading: false,
  error: null,
};

// Async thunk to login
export const loginUser = createAsyncThunk<
    { token: string ,userId: string,role: string},
    { email: string; password: string },
    { rejectValue: string }
>('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const data = await login(credentials);
    localStorage.setItem('token', data.token); // ✅ Save token
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role', data.role);
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
      state.userId = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      if (token && userId && role) {
        state.token = token;
        state.userId = userId;
        state.role = role;
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
          state.userId = action.payload.userId;
          state.role = action.payload.role;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Login failed';
        });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
