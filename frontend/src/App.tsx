import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizListPage from './pages/QuizListPage';
import QuizDetailsPage from './pages/QuizDetailsPage';
export default function App() {
  return <><header className="site-header"><div className="container header-inner"><Link className="brand" to="/quizzes"><BookOpen size={23}/> Quiz Builder</Link><nav><NavLink to="/quizzes">All quizzes</NavLink><NavLink className="nav-create" to="/create"><Plus size={17}/> Create quiz</NavLink></nav></div></header><main className="container"><Routes><Route path="/" element={<Navigate to="/quizzes" replace/>}/><Route path="/quizzes" element={<QuizListPage/>}/><Route path="/create" element={<CreateQuizPage/>}/><Route path="/quizzes/:id" element={<QuizDetailsPage/>}/><Route path="*" element={<section className="empty"><h2>Page not found</h2><Link to="/quizzes">Back to quizzes</Link></section>}/></Routes></main></>;
}
