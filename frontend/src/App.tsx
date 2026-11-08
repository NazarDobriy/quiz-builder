import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/quizzes">
            <BookOpen size={23} />
            Quiz Builder
          </Link>

          <nav>
            <NavLink to="/quizzes">
              All quizzes
            </NavLink>

            <NavLink className="nav-create" to="/create">
              <Plus size={17} />
              Create quiz
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <AppRoutes />
      </main>
    </>
  );
}
