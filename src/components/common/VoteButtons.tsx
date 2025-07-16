// src/components/common/VoteButtons.tsx
import React, { useState } from 'react';
import { useVoting } from '../../hooks/useVoting';
import { Button } from '../ui/Button';

type VotableType = 'App\\Models\\Question' | 'App\\Models\\Answer';

interface VoteButtonsProps {
  votableType: VotableType;
  votableId: number;
  initialScore: number;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({ votableType, votableId, initialScore }) => {
  const { handleVote, loading } = useVoting();
  const [score] = useState(initialScore);

  const onVote = async (value: 1 | -1) => {
    const result = await handleVote(votableType, votableId, value);
    if (result) {
      // Lógica para actualizar el puntaje localmente basado en la respuesta de la API
      // Esta parte puede ser más compleja dependiendo de si quieres una UI optimista
      // Por ahora, asumimos que refetching es una opción o que la API devuelve el nuevo puntaje.
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={() => onVote(1)} disabled={loading}>+1</Button>
      <span className="font-bold text-lg">{score}</span>
      <Button onClick={() => onVote(-1)} disabled={loading} variant="secondary">-1</Button>
    </div>
  );
};