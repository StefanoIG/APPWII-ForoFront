// src/pages/admin/AdminStats.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../api/axios';

interface AdminStatsData {
  total_users: number;
  total_questions: number;
  total_answers: number;
  total_reports: number;
  recent_users: number;
  recent_questions: number;
  pending_reports: number;
}

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        setStats(response.data);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-500 text-center">{error}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-center">No hay datos disponibles</p>
      </Card>
    );
  }

  const statCards = [
    { title: 'Total Usuarios', value: stats.total_users, color: 'blue' },
    { title: 'Total Preguntas', value: stats.total_questions, color: 'green' },
    { title: 'Total Respuestas', value: stats.total_answers, color: 'purple' },
    { title: 'Total Reportes', value: stats.total_reports, color: 'red' },
    { title: 'Usuarios Recientes (7 días)', value: stats.recent_users, color: 'indigo' },
    { title: 'Preguntas Recientes (7 días)', value: stats.recent_questions, color: 'teal' },
    { title: 'Reportes Pendientes', value: stats.pending_reports, color: 'orange' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Estadísticas del Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="text-center">
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.title}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos o tablas adicionales */}
      <div className="mt-8">
        <Card>
          <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Nuevos usuarios esta semana</span>
              <span className="font-bold text-blue-600">{stats.recent_users}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Nuevas preguntas esta semana</span>
              <span className="font-bold text-green-600">{stats.recent_questions}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Reportes pendientes de revisión</span>
              <span className="font-bold text-red-600">{stats.pending_reports}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
