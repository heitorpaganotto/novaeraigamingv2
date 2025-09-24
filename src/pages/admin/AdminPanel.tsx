import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, MessageSquare, ExternalLink, Menu } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminRespostas from './AdminRespostas';
import AdminLogin from './AdminLogin';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const openExternalLink = (url: string) => window.open(url, '_blank');

  if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'respostas', label: 'Respostas', icon: MessageSquare },
  ];

  const externalLinks = [
    { label: 'Dash AnaGaming', url: 'https://app.ana.partners/pt/auth/login' },
    { label: 'Dash BlackSheep', url: 'https://portal.socioblacksheep.com.br/dashboard' },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'respostas':
        return <AdminRespostas />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} showLogo />; // Logo no Dashboard
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          {/* Botão hamburger para mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo e título */}
          <img src="/assets/log_blacksheep2.0.png" alt="Logo BlackSheep" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl">Painel Administrativo</span>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-card border-r border-border w-64 flex-shrink-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 md:relative fixed z-20 top-16 bottom-0`}
        >
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  currentPage === item.id
                    ? "gradient-primary text-white hover:shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false); // fecha sidebar no mobile ao clicar
                }}
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
                  onClick={() => openExternalLink(link.url)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminPanel;
