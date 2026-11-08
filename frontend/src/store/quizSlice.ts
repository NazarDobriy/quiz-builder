import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { errorMessage, quizService } from '../services/quizService';
import type { Quiz, QuizInput, QuizSummary } from '../types/quiz';
import type { RootState } from './store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type QuizState = {
  quizzes: QuizSummary[];
  listStatus: RequestStatus;
  listError: string | null;
  deletingIds: number[];
  currentQuiz: Quiz | null;
  detailStatus: RequestStatus;
  detailError: string | null;
  detailRequestId: string | null;
  createStatus: RequestStatus;
  createError: string | null;
};

const initialState: QuizState = {
  quizzes: [],
  listStatus: 'idle',
  listError: null,
  deletingIds: [],
  currentQuiz: null,
  detailStatus: 'idle',
  detailError: null,
  detailRequestId: null,
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

export const fetchQuizById = createAsyncThunk<
  Quiz,
  string,
  { rejectValue: string }
>('quizzes/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await quizService.get(id);
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

const quizSlice = createSlice({
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
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload ?? 'Unable to load quizzes.';
      })
      .addCase(fetchQuizById.pending, (state, action) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.currentQuiz = null;
        state.detailRequestId = action.meta.requestId;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) {
          return;
        }

        state.detailStatus = 'succeeded';
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) {
          return;
        }

        state.detailStatus = 'failed';
        state.detailError = action.payload ?? 'Unable to load this quiz.';
      })
      .addCase(createQuiz.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const quiz = action.payload;
        state.quizzes = [
          {
            id: quiz.id,
            title: quiz.title,
            questionCount: quiz.questions.length,
            createdAt: quiz.createdAt,
          },
          ...state.quizzes.filter((item) => item.id !== quiz.id),
        ];
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload ?? 'Unable to create this quiz.';
      })
      .addCase(deleteQuiz.pending, (state, action) => {
        state.listError = null;
        state.deletingIds.push(action.meta.arg);
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
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
        state.listError = action.payload ?? 'Unable to delete this quiz.';
      });
  },
});

export const { clearCreateError } = quizSlice.actions;
export const selectQuizzes = (state: RootState) => state.quizzes.quizzes;
export const selectListStatus = (state: RootState) => state.quizzes.listStatus;
export const selectListError = (state: RootState) => state.quizzes.listError;
export const selectDeletingIds = (state: RootState) =>
  state.quizzes.deletingIds;
export const selectCurrentQuiz = (state: RootState) =>
  state.quizzes.currentQuiz;
export const selectDetailStatus = (state: RootState) =>
  state.quizzes.detailStatus;
export const selectDetailError = (state: RootState) =>
  state.quizzes.detailError;
export const selectCreateStatus = (state: RootState) =>
  state.quizzes.createStatus;
export const selectCreateError = (state: RootState) =>
  state.quizzes.createError;

export default quizSlice.reducer;
