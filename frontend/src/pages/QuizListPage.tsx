import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Trash2, ArrowRight } from 'lucide-react';
import { errorMessage, quizService } from '../services/quizService';
import type { QuizSummary } from '../types/quiz';
export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  useEffect(() => { let active = true; quizService.list().then((data) => { if (active) setQuizzes(data); }).catch((e: unknown) => { if (active) setError(errorMessage(e)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const remove = async (id: number) => { if (!window.confirm('Delete this quiz permanently?')) return; setDeletingId(id); setError(''); try { await quizService.remove(id); setQuizzes((prev) => prev.filter((q) => q.id !== id)); } catch (e) { setError(errorMessage(e)); } finally { setDeletingId(null); } };
  return <div className="page"><div className="page-heading split"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>All quizzes</h1><p>Manage and explore your quizzes in one place.</p></div><Link to="/create" className="button primary"><Plus size={18}/> Create quiz</Link></div>{error && <p role="alert" className="alert">{error}</p>}{loading ? <p>Loading quizzes...</p> : quizzes.length === 0 ? <div className="card empty"><ClipboardList size={42}/><h2>No quizzes yet</h2><p>Create your first quiz to get started.</p><Link className="button primary" to="/create"><Plus size={18}/> Create quiz</Link></div> : <div className="quiz-grid">{quizzes.map((quiz) => <article className="card quiz-tile" key={quiz.id}><div className="tile-top"><span className="tile-icon"><ClipboardList size={23}/></span><button type="button" className="icon-button danger" title={`Delete ${quiz.title}`} aria-label={`Delete ${quiz.title}`} disabled={deletingId === quiz.id} onClick={() => void remove(quiz.id)}><Trash2 size={19}/></button></div><h2>{quiz.title}</h2><p>{quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'}</p><Link to={`/quizzes/${quiz.id}`} className="tile-link">View quiz <ArrowRight size={17}/></Link></article>)}</div>}</div>;
}
