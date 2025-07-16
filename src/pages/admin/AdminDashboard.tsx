// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { AdminStats } from './AdminStats';
import { ManageUsers } from './ManageUsers';
import { ManageCategories } from './ManageCategories';
import { ManageTags } from './ManageTags';
import { ManageReports } from './ManageReports';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Estadísticas', component: AdminStats },
    { path: '/admin/users', label: 'Usuarios', component: ManageUsers },
    { path: '/admin/categories', label: 'Categorías', component: ManageCategories },
    { path: '/admin/tags', label: 'Etiquetas', component: ManageTags },
    { path: '/admin/reports', label: 'Reportes', component: ManageReports }
  ];

  if (!user || user.rol !== 'admin') {
    return (
      <MainLayout>
        <div className="text-center">
          <p className="text-red-500">No tienes permisos para acceder a esta página</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona el sistema del foro</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Navegación */}
          <div className="lg:col-span-1">
            <Card>
              <nav className="space-y-2">
                {menuItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Card>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<AdminStats />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/categories" element={<ManageCategories />} />
              <Route path="/tags" element={<ManageTags />} />
              <Route path="/reports" element={<ManageReports />} />
            </Routes>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
