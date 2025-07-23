// src/pages/CreateQuestionPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useToastContext } from '../contexts/ToastContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MarkdownEditor } from '../components/ui/MarkdownEditor';
import apiClient from '../api/axios';
import type { Category, Tag } from '../types';

export const CreateQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading } = useQuestions();
  const { showSuccess, showError } = useToastContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadInfo, setUploadInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    contenido_markdown: '',
    category_id: '',
    tags: [] as number[]
  });

  useEffect(() => {
    // Cargar categorías, etiquetas y información de upload
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [categoriesRes, tagsRes, uploadInfoRes] = await Promise.all([
          apiClient.get('/public/categories'),
          apiClient.get('/public/tags'),
          apiClient.get('/attachments/info')
        ]);
        
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.data || [];
        const tagsData = Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data.data || [];
        
        setCategories(categoriesData);
        setTags(tagsData);
        setUploadInfo(uploadInfoRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setCategories([]);
        setTags([]);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar archivos
    const validFiles = files.filter(file => {
      if (uploadInfo) {
        const isValidType = uploadInfo.allowed_types.includes(file.type);
        const isValidSize = file.size <= uploadInfo.max_file_size;
        
        if (!isValidType) {
          showError(`Archivo ${file.name}: Tipo no permitido`);
          return false;
        }
        
        if (!isValidSize) {
          showError(`Archivo ${file.name}: Tamaño máximo ${Math.round(uploadInfo.max_file_size / 1024 / 1024)}MB`);
          return false;
        }
      }
      return true;
    });

    // Verificar límite total de archivos
    if (attachments.length + validFiles.length > (uploadInfo?.max_files || 5)) {
      showError(`Máximo ${uploadInfo?.max_files || 5} archivos permitidos`);
      return;
    }

    setAttachments(prev => [...prev, ...validFiles]);
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertMarkdownImage = (imageName: string) => {
    const markdownImage = `![${imageName}](imagen:${imageName})`;
    setFormData(prev => ({
      ...prev,
      contenido_markdown: prev.contenido_markdown + '\n' + markdownImage
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || (!formData.contenido.trim() && !formData.contenido_markdown.trim())) {
      showError('Por favor completa el título y contenido del post');
      return;
    }

    if (!formData.category_id) {
      showError('Por favor selecciona una categoría');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('contenido', formData.contenido_markdown || formData.contenido);
      if (formData.contenido_markdown) {
        formDataToSend.append('contenido_markdown', formData.contenido_markdown);
      }
      formDataToSend.append('category_id', formData.category_id);
      formData.tags.forEach(tagId => {
        formDataToSend.append('tags[]', tagId.toString());
      });

      // Agregar archivos adjuntos
      attachments.forEach(file => {
        formDataToSend.append('attachments[]', file);
      });

      const response = await apiClient.post('/questions', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('Post creado exitosamente');
      navigate(`/questions/${response.data.id}`);
    } catch (error: any) {
      console.error('Error creating question:', error);
      // El interceptor maneja errores 422 automáticamente
      if (error.response?.status !== 422) {
        showError('Error al crear el post. Inténtalo de nuevo.');
      }
    }
  };

  if (loadingData) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando datos...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Post</h1>
          <p className="text-gray-600">Comparte tu conocimiento con la comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <Card>
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Post *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe un título claro y descriptivo..."
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Contenido con Markdown */}
          <Card>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Contenido del Post *
              </label>

              <MarkdownEditor
                value={formData.contenido_markdown}
                onChange={(value) => setFormData(prev => ({ ...prev, contenido_markdown: value }))}
                placeholder="Escribe tu post usando Markdown...

Ejemplos:
**negrita** o *cursiva*
`código` o ```bloque de código```
[enlace](URL)
- lista
> cita

¡Puedes agregar imágenes usando los archivos adjuntos!"
                rows={12}
              />

              {/* Fallback para contenido simple */}
              {!formData.contenido_markdown && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O escribe contenido simple:
                  </label>
                  <textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Contenido sin formato..."
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Archivos Adjuntos */}
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Archivos Adjuntos {uploadInfo && `(máx. ${uploadInfo.max_files} archivos)`}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📎 Agregar Archivos
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={uploadInfo?.allowed_types?.join(',') || 'image/*'}
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadInfo && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Tipos permitidos: {uploadInfo.allowed_types?.join(', ')} | 
                  Tamaño máximo: {Math.round(uploadInfo.max_file_size / 1024 / 1024)}MB por archivo
                </div>
              )}

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({Math.round(file.size / 1024)}KB)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {file.type.startsWith('image/') && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => insertMarkdownImage(file.name)}
                          >
                            📝 Insertar
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          ❌
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.nombre}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Botones de acción */}
          <Card>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                icon={loading ? <span>⏳</span> : <span>📝</span>}
              >
                {loading ? 'Creando Post...' : 'Crear Post'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
};
