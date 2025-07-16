import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Contextos
import { ToastProvider } from './contexts/ToastContext';

// Páginas
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { QuestionDetailPage } from './pages/QuestionDetailPage';
import { QuestionDetailPageDemo } from './pages/QuestionDetailPageDemo';
import { CreateQuestionPage } from './pages/CreateQuestionPage';
import { ProfilePage } from './pages/ProfilePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/demo/question" element={<QuestionDetailPageDemo />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/search" element={<SearchPage />} />
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/ask" element={<ProtectedRoute><CreateQuestionPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
