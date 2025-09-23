export type SubmissionStatus = 'pendente' | 'aprovado' | 'em conversa';

export interface Submission {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: SubmissionStatus;
  data: string;
  timestamp: string;
}
