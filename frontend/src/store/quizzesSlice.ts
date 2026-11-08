import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { errorMessage, quizService } from '../services/quizService';
import type { Quiz, QuizInput, QuizSummary } from '../types/quiz';
import type { RootState } from './store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type QuizzesState = {
  items: QuizSummary[];
  status: RequestStatus;
  error: string | null;
  deletingIds: number[];
  createStatus: RequestStatus;
  createError: string | null;
};

const initialState: QuizzesState = {
  items: [],
  status: 'idle',
  error: null,
  deletingIds: [],
  createStatus: 'idle',
  createError: null,
};

export const fetchQuizzes = createAsyncThunk<
  QuizSummary[],
  void,
  { rejectValue: string }
>('quizzes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await quizService.list();
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const createQuiz = createAsyncThunk<
  Quiz,
  QuizInput,
  { rejectValue: string }
>('quizzes/create', async (data, { rejectWithValue }) => {
  try {
    return await quizService.create(data);
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const deleteQuiz = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('quizzes/delete', async (id, { rejectWithValue }) => {
  try {
    await quizService.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load quizzes.';
      })
      .addCase(createQuiz.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const quiz = action.payload;
        state.items = [
          {
            id: quiz.id,
            title: quiz.title,
            questionCount: quiz.questions.length,
            createdAt: quiz.createdAt,
          },
          ...state.items.filter((item) => item.id !== quiz.id),
        ];
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload ?? 'Unable to create this quiz.';
      })
      .addCase(deleteQuiz.pending, (state, action) => {
        state.error = null;
        state.deletingIds.push(action.meta.arg);
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (quiz) => quiz.id !== action.payload,
        );
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.error = action.payload ?? 'Unable to delete this quiz.';
      });
  },
});

export const { clearCreateError } = quizzesSlice.actions;
export const selectQuizzes = (state: RootState) => state.quizzes.items;
export const selectQuizzesStatus = (state: RootState) => state.quizzes.status;
export const selectQuizzesError = (state: RootState) => state.quizzes.error;
export const selectDeletingIds = (state: RootState) =>
  state.quizzes.deletingIds;
export const selectCreateStatus = (state: RootState) =>
  state.quizzes.createStatus;
export const selectCreateError = (state: RootState) =>
  state.quizzes.createError;

export default quizzesSlice.reducer;
