// src/pages/CreateQuestionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import apiClient from '../api/axios';
import type { Category, Tag } from '../types';

export const CreateQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createQuestion, loading, error } = useQuestions();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    category_id: '',
    tags: [] as number[]
  });

  useEffect(() => {
    // Cargar categorías y etiquetas disponibles
    const loadData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          apiClient.get('/public/categories'),
          apiClient.get('/public/tags')
        ]);
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.tags.length === 0) {
      alert('Debes seleccionar al menos una etiqueta');
      return;
    }

    const questionData = {
      ...formData,
      category_id: parseInt(formData.category_id)
    };

    const result = await createQuestion(questionData);
    if (result) {
      navigate(`/questions/${result.id}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Hacer una Pregunta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título de la pregunta *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                placeholder="¿Cuál es tu pregunta?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada *
              </label>
              <textarea
                id="contenido"
                name="contenido"
                required
                value={formData.contenido}
                onChange={handleChange}
                placeholder="Describe tu pregunta con el mayor detalle posible..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas * (selecciona al menos una)
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.tags.includes(tag.id)
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag.nombre}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formData.tags.length} etiqueta(s) seleccionada(s)
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar Pregunta'}
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};
