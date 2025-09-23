import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { getSubmissions, updateSubmissionStatus } from "@/lib/supabaseApi";
import { Submission, SubmissionStatus } from "@/lib/types";

type FilterType = "todos" | SubmissionStatus;

const AdminRespostas = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<FilterType>("todos");
  const [loading, setLoading] = useState(true);

  // Type guard
  const isSubmissionStatus = (value: string): value is SubmissionStatus =>
    ["pendente", "aprovado", "em conversa"].includes(value);

  useEffect(() => {
    // Busca inicial
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetch();

    // Realtime subscription
    const subscription = supabase
      .channel("form_submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "form_submissions" },
        (payload) => {
          console.log("Evento Realtime:", payload);
          setSubmissions((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Submission, ...prev];
              case "UPDATE":
                return prev.map((item) =>
                  item.id === (payload.new as Submission).id ? (payload.new as Submission) : item
                );
              case "DELETE":
                return prev.filter((item) => item.id !== (payload.old as Submission).id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filtered = submissions.filter((s) => (filter === "todos" ? true : s.status === filter));

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    try {
      await updateSubmissionStatus(id, status);
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast({ title: "✅ Status atualizado", description: `Status alterado para "${status}".` });
    } catch {
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "aprovado":
        return "bg-green-100 text-green-700 border-green-300";
      case "em conversa":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com filtro */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">Respostas</h1>

        <Select
          value={filter}
          onValueChange={(value) => setFilter(value === "todos" || isSubmissionStatus(value) ? value : "todos")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em conversa">Em Conversa</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            {loading
              ? "Carregando inscrições..."
              : `${filtered.length} inscrição${filtered.length !== 1 ? "es" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma inscrição encontrada para este filtro.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((sub) => (
                <div key={sub.id} className="border border-border rounded-lg p-4 bg-background/50 transition hover:shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium text-foreground">{sub.data}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium text-foreground">{sub.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground break-all">{sub.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{sub.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status</p>
                      <Select
                        value={sub.status}
                        onValueChange={(v) => isSubmissionStatus(v) && handleStatusChange(sub.id, v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            <Badge className={`${getStatusColor(sub.status)} px-3 py-1`}>{sub.status}</Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">
                            <Badge className={getStatusColor("pendente")}>Pendente</Badge>
                          </SelectItem>
                          <SelectItem value="em conversa">
                            <Badge className={getStatusColor("em conversa")}>Em Conversa</Badge>
                          </SelectItem>
                          <SelectItem value="aprovado">
                            <Badge className={getStatusColor("aprovado")}>Aprovado</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRespostas;
