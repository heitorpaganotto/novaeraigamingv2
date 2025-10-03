// src/pages/admin/AdminLinks.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import { ExternalLink, Trash2, Edit, Copy, HelpCircle } from "lucide-react";

type Link = {
  id: number;
  titulo: string;
  url: string;
  created_at: string;
};

interface AdminLinksProps {
  onNavigate?: (page: string) => void;
  openFormModal?: (linkId?: number) => void;
}

const AdminLinks = ({ onNavigate, openFormModal }: AdminLinksProps) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [titulo, setTitulo] = useState("");
  const [urlBase, setUrlBase] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Links fixos
  const fixedLinks = [
    {
      titulo: "Subafiliado",
      url: "https://app.ana.partners/?paff=386694&mgr=324314",
    },
    {
      titulo: "Link Site BlackSheep",
      url: "https://teamblacksheep.vercel.app",
    },
  ];

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const buildFinalUrl = () => {
    let params = new URLSearchParams();
    if (utmSource) params.append("utm_source", utmSource);
    if (utmMedium) params.append("utm_medium", utmMedium);
    if (utmCampaign) params.append("utm_campaign", utmCampaign);
    if (utmContent) params.append("utm_content", utmContent);
    if (utmTerm) params.append("utm_term", utmTerm);

    return `${urlBase}${params.toString() ? "?" + params.toString() : ""}`;
  };

  const handleSave = async () => {
    if (!titulo || !urlBase) return;

    const finalUrl = buildFinalUrl();

    if (editingId) {
      await supabase.from("links").update({ titulo, url: finalUrl }).eq("id", editingId);
    } else {
      await supabase.from("links").insert([{ titulo, url: finalUrl }]);
    }

    setTitulo("");
    setUrlBase("");
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
    setUtmContent("");
    setUtmTerm("");
    setEditingId(null);
    fetchLinks();
  };

  const handleEdit = (link: Link) => {
    setTitulo(link.titulo);
    try {
      const urlObj = new URL(link.url);
      setUrlBase(urlObj.origin + urlObj.pathname);
      const params = urlObj.searchParams;
      setUtmSource(params.get("utm_source") || "");
      setUtmMedium(params.get("utm_medium") || "");
      setUtmCampaign(params.get("utm_campaign") || "");
      setUtmContent(params.get("utm_content") || "");
      setUtmTerm(params.get("utm_term") || "");
    } catch {
      setUrlBase(link.url);
    }
    setEditingId(link.id);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copiado!");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Links fixos */}
        {fixedLinks.map((link, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{link.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all flex items-center gap-1"
              >
                {link.url} <ExternalLink className="h-4 w-4" />
              </a>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(link.url)}>
                <Copy className="h-4 w-4 mr-1" /> Copiar
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Formulário de links dinâmicos */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Links com UTM</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <Input placeholder="URL Base" value={urlBase} onChange={(e) => setUrlBase(e.target.value)} />

            <div className="grid grid-cols-2 gap-2">
              {["Source", "Medium", "Campaign", "Content", "Term"].map((utm, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder={`utm_${utm.toLowerCase()}`}
                    value={
                      utm === "Source"
                        ? utmSource
                        : utm === "Medium"
                        ? utmMedium
                        : utm === "Campaign"
                        ? utmCampaign
                        : utm === "Content"
                        ? utmContent
                        : utmTerm
                    }
                    onChange={(e) => {
                      if (utm === "Source") setUtmSource(e.target.value);
                      else if (utm === "Medium") setUtmMedium(e.target.value);
                      else if (utm === "Campaign") setUtmCampaign(e.target.value);
                      else if (utm === "Content") setUtmContent(e.target.value);
                      else setUtmTerm(e.target.value);
                    }}
                  />
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {utm === "Source"
                        ? "Origem do tráfego"
                        : utm === "Medium"
                        ? "Meio de divulgação"
                        : utm === "Campaign"
                        ? "Nome da campanha"
                        : utm === "Content"
                        ? "Diferencia criativos"
                        : "Palavra-chave usada em anúncios pagos"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            <Button onClick={handleSave}>{editingId ? "Atualizar Link" : "Adicionar Link"}</Button>

            {urlBase && (
              <div className="text-sm text-gray-500">
                <strong>Preview:</strong> {buildFinalUrl()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de links dinâmicos */}
        <div className="space-y-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{link.titulo}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm flex items-center gap-1"
                  >
                    {link.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(link.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(link.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminLinks;
