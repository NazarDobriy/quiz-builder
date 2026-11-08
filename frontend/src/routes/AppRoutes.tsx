import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

const CreateQuizPage = lazy(() => import('../pages/CreateQuizPage'));
const QuizListPage = lazy(() => import('../pages/QuizListPage'));
const QuizDetailsPage = lazy(() => import('../pages/QuizDetailsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div role="status">Loading page...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/quizzes" replace />} />
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/create" element={<CreateQuizPage />} />
        <Route path="/quizzes/:id" element={<QuizDetailsPage />} />
        <Route
          path="*"
          element={
            <section className="empty">
              <h2>Page not found</h2>
              <Link to="/quizzes">Back to quizzes</Link>
            </section>
          }
        />
      </Routes>
    </Suspense>
  );
}
