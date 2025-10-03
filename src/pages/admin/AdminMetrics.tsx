// src/pages/admin/AdminMetrics.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type FormData = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  timestamp: string;
};

type LinkMetric = {
  id: string;
  titulo: string;
  url: string;
  clicks: number;
  forms: FormData[];
};

export default function AdminMetrics() {
  const [links, setLinks] = useState<LinkMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);

    const { data: linksData, error: linksError } = await supabase
      .from("links")
      .select("id, titulo, url")
      .order("created_at", { ascending: false });

    if (linksError || !linksData) {
      console.error(linksError);
      setLoading(false);
      return;
    }

    const metrics: LinkMetric[] = await Promise.all(
      linksData.map(async (link: any) => {
        // Cliques
        const { count: clicksCount } = await supabase
          .from("link_clicks")
          .select("id", { count: "exact", head: true })
          .eq("link_id", link.id);

        // Formulários
        const { data: formsData } = await supabase
          .from("form_submissions")
          .select("id, nome, email, telefone, timestamp")
          .eq("link_id", link.id)
          .order("timestamp", { ascending: false });

        return {
          id: link.id,
          titulo: link.titulo,
          url: link.url,
          clicks: clicksCount || 0,
          forms: formsData || [],
        };
      })
    );

    setLinks(metrics);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Carregando métricas...</p>
      ) : (
        links.map((link) => (
          <Collapsible key={link.id} className="border rounded-lg">
            <CollapsibleTrigger className="p-4 bg-primary/10 flex justify-between items-center font-semibold">
              <span>{link.titulo}</span>
              <span>
                Cliques: {link.clicks} | Formulários: {link.forms.length}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 space-y-2">
              {link.forms.length === 0 ? (
                <p className="text-muted-foreground">Nenhum formulário enviado ainda.</p>
              ) : (
                link.forms.map((form) => (
                  <Card key={form.id}>
                    <CardHeader>
                      <CardTitle>{form.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Email: {form.email}</p>
                      <p>Telefone: {form.telefone}</p>
                      <p>Enviado em: {new Date(form.timestamp).toLocaleString("pt-BR")}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        ))
      )}
    </div>
  );
}
