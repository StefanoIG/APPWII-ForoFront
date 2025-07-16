// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { QuestionCard } from '../components/common/QuestionCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MainLayout } from '../components/layout/MainLayout';

export const HomePage: React.FC = () => {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchQuestions({ sort: 'created_at', direction: 'desc' });
  }, []);

  // Categorías con estadísticas en tiempo real
  const categories = [
    { 
      id: 'all', 
      name: 'Todas', 
      icon: '🎯', 
      gradient: 'from-blue-500 to-indigo-600',
      count: questions.length,
      description: 'Todas las preguntas'
    },
    { 
      id: 'matematicas', 
      name: 'Matemáticas', 
      icon: '🔢', 
      gradient: 'from-purple-500 to-pink-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'matematicas').length,
      description: 'Álgebra, Cálculo, Geometría'
    },
    { 
      id: 'ciencias', 
      name: 'Ciencias', 
      icon: '🔬', 
      gradient: 'from-green-500 to-emerald-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'ciencias').length,
      description: 'Física, Química, Biología'
    },
    { 
      id: 'historia', 
      name: 'Historia', 
      icon: '📜', 
      gradient: 'from-yellow-500 to-orange-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'historia').length,
      description: 'Historia Universal, Nacional'
    },
    { 
      id: 'literatura', 
      name: 'Literatura', 
      icon: '📖', 
      gradient: 'from-red-500 to-pink-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'literatura').length,
      description: 'Análisis, Ensayos, Poesía'
    },
    { 
      id: 'idiomas', 
      name: 'Idiomas', 
      icon: '🗣️', 
      gradient: 'from-indigo-500 to-purple-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'idiomas').length,
      description: 'Inglés, Francés, Alemán'
    },
    { 
      id: 'tecnologia', 
      name: 'Tecnología', 
      icon: '💻', 
      gradient: 'from-cyan-500 to-blue-600',
      count: questions.filter(q => q.category?.nombre?.toLowerCase() === 'tecnologia').length,
      description: 'Programación, Informática'
    }
  ];

  // Filtrar preguntas por categoría activa
  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category?.nombre?.toLowerCase() === activeCategory);

  // Estadísticas dinámicas
  const stats = {
    totalQuestions: questions.length,
    totalAnswers: questions.reduce((acc, q) => acc + (q.answers?.length || 0), 0),
    totalUsers: new Set(questions.map(q => q.user.id)).size,
    avgRating: questions.length > 0 ? (questions.reduce((acc, q) => acc + (q.votos || 0), 0) / questions.length).toFixed(1) : '0'
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Spinner size="lg" color="white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando el universo del conocimiento...</h2>
            <p className="text-gray-600">Preparando las mejores preguntas para ti ✨</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <Card className="max-w-md mx-auto bg-white shadow-2xl">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Oops! Algo salió mal</h2>
              <div className="text-red-600 mb-6">Error: {error}</div>
              <Button onClick={() => fetchQuestions()} variant="primary" size="lg" className="shadow-lg">
                🔄 Reintentar
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section Ultra Premium */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse delay-2000"></div>
              <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse delay-3000"></div>
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white">
              {/* Header con animación */}
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="inline-flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <span className="text-4xl">🎓</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-5xl md:text-7xl font-black leading-tight">
                      <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                        Rincón del Vago
                      </span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold opacity-90">
                      La Revolución 2.0 🚀
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-95 font-medium">
                🌟 La comunidad estudiantil más <span className="text-yellow-300 font-bold">innovadora</span> donde el conocimiento fluye libremente. 
                <br />
                <span className="text-pink-300">Pregunta, aprende, enseña y crece</span> junto a miles de estudiantes apasionados.
              </p>
              
              {/* Estadísticas Premium */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                  <div className="text-3xl md:text-4xl font-black text-yellow-300">{stats.totalQuestions}</div>
                  <div className="text-sm font-semibold opacity-90">Preguntas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                  <div className="text-3xl md:text-4xl font-black text-green-300">{stats.totalAnswers}</div>
                  <div className="text-sm font-semibold opacity-90">Respuestas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                  <div className="text-3xl md:text-4xl font-black text-blue-300">{stats.totalUsers}</div>
                  <div className="text-sm font-semibold opacity-90">Estudiantes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                  <div className="text-3xl md:text-4xl font-black text-purple-300">{stats.avgRating}★</div>
                  <div className="text-sm font-semibold opacity-90">Promedio</div>
                </div>
              </div>
              
              {/* CTAs Premium */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                {user ? (
                  <>
                    <Link to="/ask">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 px-8 py-4"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-xl">✏️</span>
                          <span>¡Hacer una Pregunta!</span>
                        </span>
                      </Button>
                    </Link>
                    <Link to="/search">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl transform hover:scale-110 transition-all duration-300 px-8 py-4 font-bold"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-xl">🔍</span>
                          <span>Explorar Conocimiento</span>
                        </span>
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 px-8 py-4"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-xl">🚀</span>
                          <span>¡Únete GRATIS!</span>
                        </span>
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl transform hover:scale-110 transition-all duration-300 px-8 py-4 font-bold"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-xl">🔐</span>
                          <span>Iniciar Sesión</span>
                        </span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Badges de características */}
              <div className="flex flex-wrap justify-center gap-3">
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-semibold">
                  ✅ 100% Gratis
                </Badge>
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-semibold">
                  🚀 Respuestas Rápidas
                </Badge>
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-semibold">
                  👥 Comunidad Activa
                </Badge>
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-semibold">
                  🏆 Reputación
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Categorías Ultra Premium */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              🎯 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Explora por Categorías</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre el conocimiento organizado por áreas de estudio. Cada categoría te conecta con expertos y estudiantes apasionados.
            </p>
          </div>

          {/* Grid de Categorías Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2
                  ${activeCategory === category.id ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'}
                `}
              >
                <div className={`
                  bg-gradient-to-br ${category.gradient} p-6 rounded-2xl text-white
                  ${activeCategory === category.id ? 'ring-4 ring-blue-300 ring-opacity-50' : ''}
                `}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-bold">{category.count}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                      {category.count} pregunta{category.count !== 1 ? 's' : ''}
                    </span>
                    <div className="text-sm opacity-75">
                      {activeCategory === category.id ? '✅ Activa' : 'Explorar →'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sección de Preguntas con filtro activo */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {activeCategory === 'all' ? '🌟 Todas las Preguntas' : `${categories.find(c => c.id === activeCategory)?.icon} ${categories.find(c => c.id === activeCategory)?.name}`}
                </h3>
                {activeCategory !== 'all' && (
                  <Button
                    onClick={() => setActiveCategory('all')}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    ← Ver Todas
                  </Button>
                )}
              </div>
              
              <Badge size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                {filteredQuestions.length} resultado{filteredQuestions.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Lista de preguntas filtradas */}
            {filteredQuestions.length > 0 ? (
              <div className="space-y-6">
                {filteredQuestions.slice(0, 10).map(question => (
                  <QuestionCard key={question.id} question={question} />
                ))}
                
                {filteredQuestions.length > 10 && (
                  <div className="text-center pt-8">
                    <Link to="/search">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                        Ver todas las preguntas ({filteredQuestions.length}) →
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🤔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeCategory === 'all' 
                    ? 'No hay preguntas aún' 
                    : `No hay preguntas en ${categories.find(c => c.id === activeCategory)?.name}`
                  }
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {activeCategory === 'all'
                    ? '¡Sé el primero en hacer una pregunta y comenzar la conversación!'
                    : '¡Sé el pionero en esta categoría y haz la primera pregunta!'
                  }
                </p>
                {user && (
                  <Link to="/ask">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-xl">
                      <span className="flex items-center space-x-2">
                        <span className="text-xl">✨</span>
                        <span>¡Hacer la Primera Pregunta!</span>
                      </span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action Final Premium */}
        {!user && (
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                ¿Listo para unirte a la revolución educativa?
              </h2>
              <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
                Miles de estudiantes ya forman parte de nuestra comunidad. 
                Obtén respuestas instantáneas, comparte tu conocimiento y alcanza tus metas académicas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100 font-black shadow-2xl transform hover:scale-110 transition-all duration-300 px-10 py-5 text-lg"
                  >
                    🎯 ¡Crear Cuenta GRATIS!
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-purple-600 font-black shadow-2xl transform hover:scale-110 transition-all duration-300 px-10 py-5 text-lg"
                  >
                    🔐 Ya tengo cuenta
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-bold">
                  🆓 Sin costo oculto
                </Badge>
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-bold">
                  ⚡ Respuestas en minutos
                </Badge>
                <Badge size="lg" className="bg-white/20 text-white border-white/30 font-bold">
                  👑 Construye tu reputación
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;