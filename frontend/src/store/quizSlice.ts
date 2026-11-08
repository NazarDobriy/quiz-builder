import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { errorMessage, quizService } from '../services/quizService';
import type { Quiz } from '../types/quiz';
import type { RootState } from './store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type QuizState = {
  current: Quiz | null;
  status: RequestStatus;
  error: string | null;
  requestId: string | null;
};

const initialState: QuizState = {
  current: null,
  status: 'idle',
  error: null,
  requestId: null,
};

export const fetchQuizById = createAsyncThunk<
  Quiz,
  string,
  { rejectValue: string }
>('quiz/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await quizService.get(id);
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizById.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.current = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load this quiz.';
      });
  },
});

export const selectCurrentQuiz = (state: RootState) => state.quiz.current;
export const selectQuizStatus = (state: RootState) => state.quiz.status;
export const selectQuizError = (state: RootState) => state.quiz.error;

export default quizSlice.reducer;
