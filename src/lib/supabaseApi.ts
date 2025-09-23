// src/lib/supabaseApi.ts
import { supabase } from './supabaseClient';
import { toast } from '@/hooks/use-toast';

export interface Submission {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'pendente' | 'aprovado' | 'em conversa';
  data: string;
  timestamp: string;
}

// Buscar todas as inscrições
export const getSubmissions = async (): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Erro ao buscar inscrições:', error);
    toast({
      title: 'Erro ao carregar',
      description: 'Não foi possível buscar as inscrições.',
      variant: 'destructive',
    });
    return [];
  }

  return data as Submission[] || [];
};

// Atualizar status de uma inscrição
export const updateSubmissionStatus = async (id: string, newStatus: Submission['status']) => {
  const { error } = await supabase
    .from('form_submissions')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar status:', error);
    toast({
      title: 'Erro',
      description: 'Não foi possível atualizar o status.',
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: '✅ Status atualizado',
    description: `O status foi alterado para "${newStatus}".`,
  });

  return true;
};
