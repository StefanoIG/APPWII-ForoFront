// src/routes/protectedRoutes.tsx
import { Route } from 'react-router-dom';

// Componentes
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Páginas protegidas
import { CreateQuestionPage } from '../pages/CreateQuestionPage';
import { ProfilePage } from '../pages/ProfilePage';
import { FavoritesPage } from '../pages/FavoritesPage';

export const protectedRoutes = [
  <Route 
    key="ask" 
    path="/ask" 
    element={
      <ProtectedRoute>
        <CreateQuestionPage />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="profile" 
    path="/profile" 
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="favorites" 
    path="/favorites" 
    element={
      <ProtectedRoute>
        <FavoritesPage />
      </ProtectedRoute>
    } 
  />,
];
