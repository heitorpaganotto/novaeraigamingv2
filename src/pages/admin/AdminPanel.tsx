// src/pages/admin/AdminPanel.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  BarChart3,
  MessageSquare,
  Link as LinkIcon,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import AdminLinks from "./AdminLinks";
import AdminDashboard from "./AdminDashboard";
import AdminRespostas from "./AdminRespostas";
import AdminLogin from "./AdminLogin";
import AdminMetrics from "./AdminMetrics";
import AdminWhatsapp from "./AdminWhatsapp";
import FormModal from "@/components/FormModal";
import { supabase } from "@/lib/supabaseClient";
import { Submission } from "@/lib/types";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type ExternalLink = {
  label: string;
  url: string;
};

type LinkAnalytics = {
  id: number;
  titulo: string;
  url: string;
  clicks: number;
};

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [links, setLinks] = useState<LinkAnalytics[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    fetchLinksAnalytics();
    fetchFormSubmissions();
    setupRealtime();
  }, []);

  const handleLogin = () => {
    localStorage.setItem("adminLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  const fetchLinksAnalytics = async () => {
    const { data, error } = await supabase
      .from("links")
      .select(`id, titulo, url, link_clicks(id)`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((link: any) => ({
        id: link.id,
        titulo: link.titulo,
        url: link.url,
        clicks: link.link_clicks?.length || 0,
      }));
      setLinks(formatted);
      if (formatted.length > 0 && !selectedLinkId) setSelectedLinkId(formatted[0].id);
    }
  };

  const fetchFormSubmissions = async () => {
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("timestamp", { ascending: false });

    if (!error && data) setFormSubmissions(data as Submission[]);
  };

  const setupRealtime = () => {
    const subscription = supabase
      .channel("public:form_submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "form_submissions" },
        (payload) => {
          setFormSubmissions((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Submission, ...prev];
              case "UPDATE":
                return prev.map((item) =>
                  item.id === (payload.new as Submission).id ? (payload.new as Submission) : item
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
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  };

  if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "respostas", label: "Respostas", icon: MessageSquare },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare }, 

  ];

  const externalLinks: ExternalLink[] = [
    { label: "Dash AnaGaming", url: "https://app.ana.partners/pt/auth/login" },
    { label: "Dash BlackSheep", url: "https://portal.socioblacksheep.com.br/dashboard" },
  ];

  const renderContent = () => {
  switch (currentPage) {
    case "respostas":
      return <AdminRespostas />;
    case "links":
      return <AdminLinks onNavigate={fetchLinksAnalytics} />;
    case "analytics":
      return <AdminMetrics />;
    case "whatsapp":
      return <AdminWhatsapp />; // ✅ nova aba
    case "dashboard":
    default:
      return (
        <AdminDashboard
          onNavigate={setCurrentPage}
          submissions={formSubmissions}
        />
      );
  }
};


  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm relative">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/assets/log_blacksheep3.0.png" alt="Logo BlackSheep" className="h-12 w-auto" />
          </div>

          <div className="ml-auto">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${currentPage === item.id ? "gradient-primary text-white hover:shadow-glow" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}

            <div className="pt-4 mt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2 px-2">Links Externos</p>
              {externalLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 lg:hidden">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${currentPage === item.id ? "gradient-primary text-white hover:shadow-glow" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">{renderContent()}</main>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        linkId={selectedLinkId ?? undefined} // ✅ evita erro se null
      />
    </div>
  );
};

export default AdminPanel;
