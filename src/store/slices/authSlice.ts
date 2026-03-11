import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, saveToken, clearToken } from '../../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  timezone: string;
  sleepGoal: { targetHours: number; bedtime: string; wakeTime: string };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ── Thunks ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(email, password);
      await saveToken(data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.register(payload);
      await saveToken(data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.me();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearToken();
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state: AuthState) => { state.isLoading = true;  state.error = null; };
    const rejected = (state: AuthState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, rejected)

      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;