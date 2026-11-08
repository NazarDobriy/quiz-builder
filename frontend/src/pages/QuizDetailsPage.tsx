import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchQuizById,
  selectCurrentQuiz,
  selectQuizError,
  selectQuizStatus,
} from '../store/quizSlice';

export default function QuizDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(selectCurrentQuiz);
  const error = useAppSelector(selectQuizError);
  const status = useAppSelector(selectQuizStatus);

  useEffect(() => {
    if (id) {
      void dispatch(fetchQuizById(id));
    }
  }, [dispatch, id]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="page">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="page">
        <p className="alert">{error || 'Quiz not found'}</p>
        <Link to="/quizzes">Back to quizzes</Link>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <Link className="back-link" to="/quizzes">
        <ArrowLeft size={17} />
        Back to quizzes
      </Link>

      <div className="page-heading">
        <span className="eyebrow">QUIZ DETAILS</span>
        <h1>{quiz.title}</h1>
        <p>
          {quiz.questions.length}{' '}
          {quiz.questions.length === 1 ? 'question' : 'questions'} · Read-only
          preview
        </p>
      </div>

      {quiz.questions.map((question, index) => (
        <section className="card detail-card" key={question.id}>
          <div className="question-top">
            <span className="eyebrow">QUESTION {index + 1}</span>
            <span className="type-pill">
              <ListChecks size={14} />
              {question.type}
            </span>
          </div>

          <h2>{question.text}</h2>

          {question.type === 'boolean' && (
            <div className="read-options">
              {['true', 'false'].map((answer) => (
                <div
                  className={`read-option ${
                    question.correctAnswer === answer ? 'correct' : ''
                  }`}
                  key={answer}
                >
                  {question.correctAnswer === answer ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                  {answer === 'true' ? 'True' : 'False'}
                </div>
              ))}
            </div>
          )}

          {question.type === 'input' && (
            <div className="read-answer">
              <span className="eyebrow">CORRECT ANSWER</span>
              <p>{question.correctAnswer}</p>
            </div>
          )}

          {question.type === 'checkbox' && (
            <div className="read-options">
              {question.options?.map((option) => (
                <div
                  className={`read-option ${option.isCorrect ? 'correct' : ''}`}
                  key={option.id}
                >
                  {option.isCorrect ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                  {option.text}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
