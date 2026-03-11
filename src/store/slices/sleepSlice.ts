import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sleepAPI, analyticsAPI } from '../../services/api';

export const fetchSessions = createAsyncThunk('sleep/fetchAll', async (params: any, { rejectWithValue }) => {
  try {
    const { data } = await sleepAPI.getAll(params);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchLatestSession = createAsyncThunk('sleep/fetchLatest', async (_, { rejectWithValue }) => {
  try {
    const { data } = await sleepAPI.getLatest();
    return data.data.session;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const logSleepSession = createAsyncThunk('sleep/create', async (payload: any, { rejectWithValue }) => {
  try {
    const { data } = await sleepAPI.create(payload);
    return data.data.session;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchSummary = createAsyncThunk('sleep/summary', async (period: any, { rejectWithValue }) => {
  try {
    const { data } = await analyticsAPI.getSummary(period);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchTrends = createAsyncThunk('sleep/trends', async (days: number, { rejectWithValue }) => {
  try {
    const { data } = await analyticsAPI.getTrends(days);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchInsights = createAsyncThunk('sleep/insights', async (_, { rejectWithValue }) => {
  try {
    const { data } = await analyticsAPI.getInsights();
    return data.data.insights;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

interface SleepState {
  sessions: any[];
  latest: any | null;
  summary: any | null;
  trends: any[];
  insights: any[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
}

const initialState: SleepState = {
  sessions: [],
  latest: null,
  summary: null,
  trends: [],
  insights: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
};

const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    clearSleepError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending,  (s) => { s.isLoading = true; })
      .addCase(fetchSessions.fulfilled,(s, { payload }) => {
        s.isLoading = false;
        s.sessions = payload.data.sessions;
        s.total = payload.total;
        s.page  = payload.page;
      })
      .addCase(fetchSessions.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.error = payload as string;
      })

      .addCase(fetchLatestSession.fulfilled, (s, { payload }) => { s.latest = payload; })

      .addCase(logSleepSession.fulfilled, (s, { payload }) => {
        s.sessions.unshift(payload);
        s.latest = payload;
      })

      .addCase(fetchSummary.fulfilled,  (s, { payload }) => { s.summary = payload; })
      .addCase(fetchTrends.fulfilled,   (s, { payload }) => { s.trends = payload; })
      .addCase(fetchInsights.fulfilled, (s, { payload }) => { s.insights = payload; });
  },
});

export const { clearSleepError } = sleepSlice.actions;
export default sleepSlice.reducer;