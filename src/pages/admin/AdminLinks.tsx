// src/pages/admin/AdminLinks.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { ExternalLink, Trash2, Edit, Copy } from "lucide-react";

type Link = {
  id: number;
  titulo: string;
  url: string;
  created_at: string;
};

interface AdminLinksProps {
  onNavigate?: (page: string) => void;
}

const AdminLinks = ({ onNavigate }: AdminLinksProps) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fixedLink = {
    titulo: "Subafiliados",
    url: "https://app.ana.partners/?paff=386694&mgr=324314",
  };

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

  const handleSave = async () => {
    if (!titulo || !url) return;

    if (editingId) {
      await supabase.from("links").update({ titulo, url }).eq("id", editingId);
    } else {
      await supabase.from("links").insert([{ titulo, url }]);
    }

    setTitulo("");
    setUrl("");
    setEditingId(null);
    fetchLinks();
  };

  const handleEdit = (link: Link) => {
    setTitulo(link.titulo);
    setUrl(link.url);
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
    <div className="space-y-6">
      {/* Link fixo destacado */}
      <Card>
        <CardHeader>
          <CardTitle>{fixedLink.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <a
            href={fixedLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all flex items-center gap-1"
          >
            {fixedLink.url} <ExternalLink className="h-4 w-4" />
          </a>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(fixedLink.url)}
          >
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </CardContent>
      </Card>

      {/* Formulário de adicionar/editar links */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSave}>
            {editingId ? "Atualizar Link" : "Adicionar Link"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de links */}
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
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleDelete(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(link.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLinks;
