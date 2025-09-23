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

  // Campos administrativos opcionais
  casa?: string;
  tipoComissao?: string; // mapeado do tipo_comissao no banco
  observacoes?: string;
}

// Buscar todas as inscrições
export const getSubmissions = async (): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*, tipo_comissao') // seleciona o campo com underscore
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

  // Mapear snake_case para camelCase
  return (data as any[]).map((d) => ({
    ...d,
    tipoComissao: d.tipo_comissao,
  })) as Submission[];
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

// Atualizar dados de uma inscrição (campos administrativos)
export const updateSubmissionData = async (id: string, data: Partial<Submission>) => {
  // Mapear camelCase para snake_case
  const payload: any = { ...data };
  if (data.tipoComissao) payload.tipo_comissao = data.tipoComissao;
  delete payload.tipoComissao;

  const { error } = await supabase
    .from('form_submissions')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar inscrição:', error);
    toast({
      title: 'Erro',
      description: 'Não foi possível atualizar a inscrição.',
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: '✅ Inscrição atualizada',
    description: 'Os dados da inscrição foram atualizados com sucesso.',
  });

  return true;
};

// Excluir inscrição
export const deleteSubmission = async (id: string) => {
  const { error } = await supabase
    .from('form_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir inscrição:', error);
    toast({
      title: 'Erro',
      description: 'Não foi possível excluir a inscrição.',
      variant: 'destructive',
    });
    return false;
  }

  toast({
    title: '✅ Inscrição excluída',
    description: 'A inscrição foi removida com sucesso.',
  });

  return true;
};
