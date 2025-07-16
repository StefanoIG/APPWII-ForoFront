// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  rol: 'admin' | 'moderador' | 'usuario';
  reputacion: number;
}

export interface Tag {
  id: number;
  nombre: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Answer {
  id: number;
  contenido: string;
  es_mejor_respuesta?: boolean;
  votos?: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: number;
  titulo: string;
  contenido: string;
  estado?: 'abierta' | 'resuelta' | 'cerrada';
  votos?: number;
  vistas?: number;
  user: User;
  category: Category;
  tags: Tag[];
  answers?: Answer[];
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: number;
  motivo: string;
  descripcion?: string;
  estado: 'pendiente' | 'revisado' | 'descartado';
  reportable_type: string;
  reportable_id: number;
  user: User;
  created_at: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  question_id: number;
  question?: Question;
  created_at: string;
}
