import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';
import quizzesReducer from './quizzesSlice';

export const store = configureStore({
  reducer: {
    quizzes: quizzesReducer,
    quiz: quizReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
