// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { QuestionCard } from '../components/common/QuestionCard';
import { Spinner } from '../components/ui/Spinner';
import apiClient from '../api/axios';
import type { Question, Answer } from '../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, activeTab]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (activeTab === 'questions') {
        const response = await apiClient.get(`/users/${user.id}/questions`);
        setUserQuestions(response.data);
      } else if (activeTab === 'answers') {
        const response = await apiClient.get(`/users/${user.id}/answers`);
        setUserAnswers(response.data);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center">
          <p>No estás autenticado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header del Perfil */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {user.rol}
                </span>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm ml-2">
                  {user.reputacion} puntos de reputación
                </span>
              </div>
            </div>
            <div>
              <Button variant="secondary">
                Editar Perfil
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userQuestions.length}</div>
              <div className="text-gray-600">Preguntas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userAnswers.length}</div>
              <div className="text-gray-600">Respuestas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.reputacion}</div>
              <div className="text-gray-600">Reputación</div>
            </div>
          </Card>
        </div>

        {/* Tabs de Contenido */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Preguntas
              </button>
              <button
                onClick={() => setActiveTab('answers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'answers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Respuestas
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Actividad Reciente
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {activeTab === 'questions' && (
                  <div>
                    {userQuestions.length > 0 ? (
                      userQuestions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No has hecho ninguna pregunta aún.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'answers' && (
                  <div>
                    {userAnswers.length > 0 ? (
                      userAnswers.map(answer => (
                        <Card key={answer.id} className="mb-4">
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{answer.contenido}</p>
                          </div>
                          {answer.es_mejor_respuesta && (
                            <div className="mt-2">
                              <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">
                                ✓ Mejor Respuesta
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-gray-500 mt-2">
                            {answer.votos || 0} votos
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No has respondido ninguna pregunta aún.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <p className="text-gray-500 text-center py-8">
                      Actividad reciente - Próximamente
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
