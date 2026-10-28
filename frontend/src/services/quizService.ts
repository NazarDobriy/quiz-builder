import axios from 'axios';
import type { Quiz, QuizInput, QuizSummary } from '../types/quiz';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', timeout: 10000 });
export const quizService = {
  list: async () => (await api.get<QuizSummary[]>('/quizzes')).data,
  get: async (id: string) => (await api.get<Quiz>(`/quizzes/${id}`)).data,
  create: async (data: QuizInput) => (await api.post<Quiz>('/quizzes', data)).data,
  remove: async (id: number) => { await api.delete(`/quizzes/${id}`); },
};
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.filter((x): x is string => typeof x === 'string').join(', ');
  }
  return 'Something went wrong. Please try again.';
}
