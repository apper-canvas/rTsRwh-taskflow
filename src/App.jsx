import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { selectIsAuthenticated, setUser, clearUser } from './store/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans text-surface-800 dark:text-surface-100 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="text-primary font-bold text-2xl"
            >
              TaskFlow
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="p-2 rounded-full text-surface-600 hover:text-primary dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
                <Link 
                  to="/profile" 
                  className="p-2 rounded-full text-surface-600 hover:text-primary dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Profile"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-surface-600 hover:text-primary dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:taskId" element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-6 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-surface-500">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;