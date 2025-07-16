// src/components/common/AnswerCard.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAnswers } from '../../hooks/useAnswers';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VoteButtons } from './VoteButtons';
import { ReportButton } from './ReportButton';

interface Answer {
  id: number;
  contenido: string;
  es_mejor_respuesta?: boolean;
  votos?: number;
  user?: {
    id: number;
    name: string;
  };
}

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId?: number; // ID del autor de la pregunta para permitir marcar como mejor
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  questionAuthorId 
}) => {
  const { user } = useAuth();
  const { markAsBest, loading } = useAnswers();

  const handleMarkAsBest = async () => {
    if (!user || user.id !== questionAuthorId) return;
    
    const result = await markAsBest(answer.id);
    if (result) {
      // Aquí podrías actualizar el estado local o recargar la pregunta
      window.location.reload(); // Solución temporal
    }
  };

  return (
    <Card className={`mb-4 ${answer.es_mejor_respuesta ? 'border-green-500 border-2' : ''}`}>
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <VoteButtons 
            votableType="App\Models\Answer"
            votableId={answer.id}
            initialScore={answer.votos || 0}
          />
        </div>
        
        <div className="flex-grow">
          {answer.es_mejor_respuesta && (
            <div className="mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded font-medium">
                ✓ Mejor Respuesta
              </span>
            </div>
          )}
          
          <div className="prose max-w-none mb-4">
            <p className="whitespace-pre-wrap">{answer.contenido}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>Respondido por <strong>{answer.user?.name || 'Usuario'}</strong></p>
            </div>
            
            <div className="flex space-x-2">
              {/* Solo el autor de la pregunta puede marcar como mejor respuesta */}
              {user && user.id === questionAuthorId && !answer.es_mejor_respuesta && (
                <Button 
                  onClick={handleMarkAsBest}
                  variant="secondary"
                  disabled={loading}
                  className="text-sm"
                >
                  {loading ? 'Marcando...' : 'Marcar como mejor'}
                </Button>
              )}
              
              <ReportButton 
                reportableType="App\Models\Answer"
                reportableId={answer.id}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
