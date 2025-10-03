// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Clock, FileText, LucideIcon } from "lucide-react";
import { Submission } from "@/lib/types";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  submissions: Submission[];
  showLogo?: boolean;
}

const AdminDashboard = ({ onNavigate, submissions }: AdminDashboardProps) => {
  const [loading, setLoading] = useState(false);

  // Estatísticas
  const stats = {
    total: submissions.length,
    pendentes: submissions.filter((s) => s.status === "pendente").length,
    aprovados: submissions.filter((s) => s.status === "aprovado").length,
    emConversa: submissions.filter((s) => s.status === "em conversa").length,
  };

  const getStatusLabel = (status: Submission["status"]) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "aprovado":
        return "Aprovado";
      case "em conversa":
        return "Em Conversa";
      default:
        return status;
    }
  };

  const getStatusColor = (status: Submission["status"]) => {
    switch (status) {
      case "pendente":
        return "bg-warning/20 text-warning";
      case "aprovado":
        return "bg-success/20 text-success";
      case "em conversa":
        return "bg-info/20 text-info";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
  }) => (
    <Card className="shadow-card bg-card border-border hover-scale">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Grid de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Formulários" value={stats.total} icon={FileText} color="text-primary" />
        <StatCard title="Pendentes" value={stats.pendentes} icon={Clock} color="text-warning" />
        <StatCard title="Em Conversa" value={stats.emConversa} icon={Users} color="text-info" />
        <StatCard title="Aprovados" value={stats.aprovados} icon={CheckCircle} color="text-success" />
      </div>

      {/* Últimas inscrições */}
      <Card className="shadow-card bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Inscrições Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando inscrições...</p>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma inscrição encontrada</p>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{submission.nome}</p>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                    <p className="text-xs text-muted-foreground">{submission.data}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {getStatusLabel(submission.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {submissions.length > 0 && (
            <div className="mt-4">
              <Button onClick={() => onNavigate("respostas")} variant="outline" className="w-full">
                Ver Todas as Respostas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
