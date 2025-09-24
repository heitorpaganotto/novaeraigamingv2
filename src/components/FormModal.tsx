import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Importa o client do Supabase

interface FormData {
  nome: string;
  email: string;
  telefone: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal = ({ isOpen, onClose }: FormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Inserção no Supabase (tipo corrigido)
      const { error } = await supabase
        .from("form_submissions") // só o nome da tabela
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          status: "pendente",
          data: new Date().toLocaleDateString("pt-BR"),
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "🎉 Sucesso!",
        description:
          "Sua inscrição foi enviada com sucesso. Entraremos em contato em breve!",
      });

      setFormData({ nome: "", email: "", telefone: "" });
      onClose();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "❌ Erro",
        description:
          error.message || "Houve um erro ao enviar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass border border-primary/30 rounded-3xl">
        <div className="relative">
          {/* Background Effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-accent/15 rounded-full blur-3xl" />

          <DialogHeader className="text-center pb-6 relative z-10">
            <DialogTitle className="text-3xl font-black white bg-clip-text">
              Inscrever-se Agora
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              <span className="text-primary font-semibold">Últimos dias</span>{" "}
              para aproveitar essas
              <span className="text-accent font-semibold">
                {" "}
                condições especiais
              </span>
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="font-semibold flex items-center gap-2">
                Nome Completo
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold flex items-center gap-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="font-semibold flex items-center gap-2">
                Telefone
              </Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "⏳ Enviando..." : "Enviar Inscrição"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
