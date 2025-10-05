// src/pages/admin/AdminRespostas.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  getSubmissions,
  updateSubmissionData,
  deleteSubmission,
} from "@/lib/supabaseApi";
import { Submission, SubmissionStatus } from "@/lib/types";
import { Modal } from "@/components/ui/modal";

type FilterType = "todos" | SubmissionStatus;

const AdminRespostas = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<FilterType>("todos");
  const [loading, setLoading] = useState(true);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] =
    useState<Submission | null>(null);

  const [adminForm, setAdminForm] = useState({
    casa: "",
    tipo_comissao: "",
    observacoes: "",
  });

  const isSubmissionStatus = (value: string): value is SubmissionStatus =>
    ["pendente", "aprovado", "em conversa"].includes(value);

  // Fetch + Realtime
  useEffect(() => {
    let subscriptionCleanup: (() => void) | null = null;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = async () => {
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
                    item.id === (payload.new as Submission).id
                      ? (payload.new as Submission)
                      : item
                  );
                case "DELETE":
                  return prev.filter(
                    (item) => item.id !== (payload.old as Submission).id
                  );
                default:
                  return prev;
              }
            });
          }
        );

      await subscription.subscribe();

      subscriptionCleanup = () => supabase.removeChannel(subscription);
    };

    fetchSubmissions();
    setupSubscription();

    return () => {
      if (subscriptionCleanup) subscriptionCleanup();
    };
  }, []);

  const filtered = submissions.filter((s) =>
    filter === "todos" ? true : s.status === filter
  );

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    try {
      await updateSubmissionData(id, { status });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
      toast({
        title: "✅ Status atualizado",
        description: `Status alterado para "${status}".`,
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
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
      prev.map((s) =>
        s.id === currentSubmission.id ? { ...s, ...updatedData } : s
      )
    );

    toast({
      title: "✅ Atualizado",
      description: "Informações administrativas salvas.",
    });
    setEditModalOpen(false);
  };

  const getStatusColor = (status: SubmissionStatus) => {
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

  const getStatusLabel = (status: SubmissionStatus) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Respostas
        </h1>

        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(
              value === "todos" || isSubmissionStatus(value) ? value : "todos"
            )
          }
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

      {/* Lista */}
      <Card className="shadow-card bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            {loading
              ? "Carregando inscrições..."
              : `${filtered.length} inscrição${
                  filtered.length !== 1 ? "es" : ""
                } encontrada${filtered.length !== 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma inscrição encontrada para este filtro.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-background rounded-lg border border-border hover-scale"
                >
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
                      <p className="font-medium text-foreground break-all">
                        {sub.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">
                        {sub.telefone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Status
                      </p>
                      <Select
                        value={sub.status}
                        onValueChange={(v) =>
                          isSubmissionStatus(v) &&
                          handleStatusChange(sub.id, v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                sub.status
                              )}`}
                            >
                              {getStatusLabel(sub.status)}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">
                            <Badge
                              className={`px-2 py-1 text-xs font-medium ${getStatusColor(
                                "pendente"
                              )}`}
                            >
                              Pendente
                            </Badge>
                          </SelectItem>
                          <SelectItem value="em conversa">
                            <Badge
                              className={`px-2 py-1 text-xs font-medium ${getStatusColor(
                                "em conversa"
                              )}`}
                            >
                              Em Conversa
                            </Badge>
                          </SelectItem>
                          <SelectItem value="aprovado">
                            <Badge
                              className={`px-2 py-1 text-xs font-medium ${getStatusColor(
                                "aprovado"
                              )}`}
                            >
                              Aprovado
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
  <Button
    size="sm"
    variant="outline"
    onClick={() => openViewModal(sub)}
  >
    Visualizar
  </Button>
  <Button
    size="sm"
    variant="secondary"
    onClick={() => openEditModal(sub)}
  >
    Editar
  </Button>
  <Button
    size="sm"
    variant="destructive"
    onClick={() => handleDelete(sub.id)}
  >
    Excluir
  </Button>
  <Button
    size="sm"
    className="bg-green-600 hover:bg-green-700 text-white"
    onClick={() => {
      const cleanedPhone = sub.telefone
        .replace(/\D/g, "") // Remove não-números
        .replace(/^0+/, ""); // Remove zeros à esquerda

      if (cleanedPhone.length < 10) {
        alert("Número de telefone inválido.");
        return;
      }

      const defaultMessage = encodeURIComponent(
        `Olá ${sub.nome}, tudo bem? Estou entrando em contato sobre sua inscrição.`
      );

      const whatsappUrl = `https://wa.me/55${cleanedPhone}?text=${defaultMessage}`;
      window.open(whatsappUrl, "_blank");
    }}
  >
    Conversar
  </Button>
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
        <div className="bg-card p-6 rounded-xl max-w-lg mx-auto space-y-4">
          <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Informações da Inscrição
          </h2>

          {currentSubmission && (
            <div className="space-y-4">
              <Card className="bg-background border-border shadow-card">
                <CardContent className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-muted-foreground">Nome:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.nome}
                  </p>

                  <p className="text-sm text-muted-foreground">Email:</p>
                  <p className="font-medium text-foreground break-all">
                    {currentSubmission.email}
                  </p>

                  <p className="text-sm text-muted-foreground">Telefone:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.telefone}
                  </p>

                  <p className="text-sm text-muted-foreground">Data:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.data}
                  </p>

                  <p className="text-sm text-muted-foreground">Status:</p>
                  <Badge
                    className={`px-3 py-1 text-xs font-medium ${getStatusColor(
                      currentSubmission.status
                    )}`}
                  >
                    {getStatusLabel(currentSubmission.status)}
                  </Badge>

                  <p className="text-sm text-muted-foreground">Casa:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.casa || "-"}
                  </p>

                  <p className="text-sm text-muted-foreground">Tipo Comissão:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.tipo_comissao || "-"}
                  </p>

                  <p className="text-sm text-muted-foreground">Observações:</p>
                  <p className="font-medium text-foreground">
                    {currentSubmission.observacoes || "-"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-right">
            <Button onClick={() => setViewModalOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="bg-card p-6 rounded-xl text-foreground max-w-lg mx-auto space-y-4">
          <h2 className="text-xl font-bold">Editar Informações</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Casa</label>
              <Input
                placeholder="Ex: Bet7k, Cassino Pix, Betvera"
                value={adminForm.casa}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, casa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                Tipo Comissão
              </label>
              <Input
                placeholder="Ex: CPA, RevShare, Bônus"
                value={adminForm.tipo_comissao}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, tipo_comissao: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Observações</label>
              <Textarea
                placeholder="Anotações administrativas..."
                value={adminForm.observacoes}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, observacoes: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRespostas;
