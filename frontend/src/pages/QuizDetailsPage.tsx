import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { errorMessage, quizService } from '../services/quizService';
import type { Quiz } from '../types/quiz';
export default function QuizDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; if (!id) return; setLoading(true); quizService.get(id).then((data) => { if (active) setQuiz(data); }).catch((e: unknown) => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  if (loading) return <div className="page"><p>Loading quiz...</p></div>;
  if (error || !quiz) return <div className="page"><p className="alert">{error || 'Quiz not found'}</p><Link to="/quizzes">Back to quizzes</Link></div>;
  return <div className="page narrow"><Link className="back-link" to="/quizzes"><ArrowLeft size={17}/> Back to quizzes</Link><div className="page-heading"><span className="eyebrow">QUIZ DETAILS</span><h1>{quiz.title}</h1><p>{quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'} · Read-only preview</p></div>{quiz.questions.map((question, index) => <section className="card detail-card" key={question.id}><div className="question-top"><span className="eyebrow">QUESTION {index + 1}</span><span className="type-pill"><ListChecks size={14}/>{question.type}</span></div><h2>{question.text}</h2>{question.type === 'boolean' && <div className="read-options">{['true', 'false'].map((answer) => <div className={`read-option ${question.correctAnswer === answer ? 'correct' : ''}`} key={answer}>{question.correctAnswer === answer ? <CheckCircle2 size={18}/> : <Circle size={18}/>} {answer === 'true' ? 'True' : 'False'}</div>)}</div>}{question.type === 'input' && <div className="read-answer"><span className="eyebrow">CORRECT ANSWER</span><p>{question.correctAnswer}</p></div>}{question.type === 'checkbox' && <div className="read-options">{question.options?.map((option) => <div className={`read-option ${option.isCorrect ? 'correct' : ''}`} key={option.id}>{option.isCorrect ? <CheckCircle2 size={18}/> : <Circle size={18}/>} {option.text}</div>)}</div>}</section>)}</div>;
}
