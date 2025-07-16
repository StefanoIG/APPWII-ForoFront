// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { QuestionCard } from '../components/common/QuestionCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MainLayout } from '../components/layout/MainLayout';

export const HomePage: React.FC = () => {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions({ sort: 'created_at', direction: 'desc' });
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header con estadísticas y CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Últimas Preguntas</h1>
                <p className="text-gray-600">
                  Encuentra respuestas a tus dudas académicas o ayuda a otros estudiantes
                </p>
              </div>
              
              {user ? (
                <Link to="/ask">
                  <Button variant="primary" className="px-6 py-3">
                    Hacer Pregunta
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="primary" className="px-6 py-3">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>

            {/* Lista de preguntas */}
            {loading && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
            
            {error && (
              <Card>
                <p className="text-red-500 text-center">{error}</p>
              </Card>
            )}
            
            <div>
              {questions.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>

            {questions.length === 0 && !loading && (
              <Card>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay preguntas disponibles</p>
                  {user && (
                    <Link to="/ask">
                      <Button variant="primary">
                        ¡Sé el primero en hacer una pregunta!
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Enlaces rápidos */}
              <Card>
                <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
                <div className="space-y-2">
                  <Link to="/categories" className="block text-blue-600 hover:underline">
                    Ver Categorías
                  </Link>
                  <Link to="/search" className="block text-blue-600 hover:underline">
                    Buscar Preguntas
                  </Link>
                  {user && (
                    <>
                      <Link to="/favorites" className="block text-blue-600 hover:underline">
                        Mis Favoritos
                      </Link>
                      <Link to="/profile" className="block text-blue-600 hover:underline">
                        Mi Perfil
                      </Link>
                    </>
                  )}
                </div>
              </Card>

              {/* Estadísticas */}
              <Card>
                <h3 className="font-bold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preguntas</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  {user && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tu Reputación</span>
                      <span className="font-medium text-green-600">{user.reputacion}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Call to Action para usuarios no registrados */}
              {!user && (
                <Card>
                  <h3 className="font-bold mb-2">¡Únete a la Comunidad!</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Regístrate para hacer preguntas, responder y ganar reputación
                  </p>
                  <div className="space-y-2">
                    <Link to="/register" className="block">
                      <Button variant="primary" className="w-full">
                        Registrarse
                      </Button>
                    </Link>
                    <Link to="/login" className="block">
                      <Button variant="secondary" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};