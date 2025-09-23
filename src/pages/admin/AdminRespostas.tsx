// src/pages/admin/AdminRespostas.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { getSubmissions, updateSubmissionData, deleteSubmission } from "@/lib/supabaseApi";
import { Submission, SubmissionStatus } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type FilterType = "todos" | SubmissionStatus;

const AdminRespostas = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<FilterType>("todos");
  const [loading, setLoading] = useState(true);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);

  const [adminForm, setAdminForm] = useState({
    casa: "",
    tipo_comissao: "",
    observacoes: "",
  });

  const isSubmissionStatus = (value: string): value is SubmissionStatus =>
    ["pendente", "aprovado", "em conversa"].includes(value);

  // Fetch + Realtime
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch {
        toast({ title: "Erro", description: "Não foi possível carregar.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    const subscription = supabase
      .channel("form_submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "form_submissions" },
        (payload) => {
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
      await updateSubmissionData(id, { status });
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
      toast({ title: "✅ Status atualizado", description: `Status alterado para "${status}".` });
    } catch {
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta inscrição?")) return;
    const success = await deleteSubmission(id);
    if (success) setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const openViewModal = (submission: Submission) => {
    setCurrentSubmission(submission);
    setViewModalOpen(true);
  };

  const openEditModal = (submission: Submission) => {
    setCurrentSubmission(submission);
    setAdminForm({
      casa: submission.casa || "",
      tipo_comissao: submission.tipo_comissao || "",
      observacoes: submission.observacoes || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!currentSubmission) return;

    const updatedData: Partial<Submission> = {
      casa: adminForm.casa,
      tipo_comissao: adminForm.tipo_comissao,
      observacoes: adminForm.observacoes,
    };

    await updateSubmissionData(currentSubmission.id, updatedData);

    setSubmissions((prev) =>
      prev.map((s) => (s.id === currentSubmission.id ? { ...s, ...updatedData } : s))
    );

    toast({ title: "✅ Atualizado", description: "Informações administrativas salvas." });
    setEditModalOpen(false);
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
      {/* Cabeçalho */}
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
                <div key={sub.id} className="border border-border rounded-lg p-4 bg-background/50 transition hover:shadow-lg hover:bg-background/70">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
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

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => openViewModal(sub)}>Visualizar</Button>
                      <Button size="sm" variant="outline" className="bg-green-600 text-white hover:bg-green-700" onClick={() => openEditModal(sub)}>Adicionar Observações</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(sub.id)}>Excluir</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Visualizar */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <div className="bg-gray-900 p-6 rounded-xl text-white max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Informações da Inscrição</h2>
          {currentSubmission && (
            <div className="space-y-2">
              <p><strong>Nome:</strong> {currentSubmission.nome}</p>
              <p><strong>Email:</strong> {currentSubmission.email}</p>
              <p><strong>Telefone:</strong> {currentSubmission.telefone}</p>
              <p><strong>Status:</strong> {currentSubmission.status}</p>
              <p><strong>Data:</strong> {currentSubmission.data}</p>
              <p><strong>Casa:</strong> {currentSubmission.casa || "-"}</p>
              <p><strong>Tipo Comissão:</strong> {currentSubmission.tipo_comissao || "-"}</p>
              <p><strong>Observações:</strong> {currentSubmission.observacoes || "-"}</p>
            </div>
          )}
          <div className="mt-4 text-right">
            <Button onClick={() => setViewModalOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Observações */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="bg-gray-900 p-6 rounded-xl text-white max-w-lg mx-auto space-y-4">
          <h2 className="text-xl font-bold">Adicionar Observações</h2>
          <div className="space-y-2">
            <label className="block">Casa:</label>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              value={adminForm.casa}
              onChange={(e) => setAdminForm({ ...adminForm, casa: e.target.value })}
              placeholder="Ex: Bet7k, Cassino Pix, Betvera"
            />
            <label className="block">Tipo Comissão:</label>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              value={adminForm.tipo_comissao}
              onChange={(e) => setAdminForm({ ...adminForm, tipo_comissao: e.target.value })}
              placeholder="Ex: CPA, RevShare, Bônus"
            />
            <label className="block">Observações:</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              value={adminForm.observacoes}
              onChange={(e) => setAdminForm({ ...adminForm, observacoes: e.target.value })}
              rows={4}
              placeholder="Anotações administrativas..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRespostas;
