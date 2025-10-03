// src/pages/Index.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import FormModal from '@/components/FormModal';
import PremiosSection from '@/components/PremiosSection';
import PropostaSection from '@/components/PropostaSection';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<"home" | "premios" | "proposta">("home");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const renderSection = () => {
    switch (currentSection) {
      case 'premios':
        return <PremiosSection />;
      case 'proposta':
        return <PropostaSection />;
      default:
        return <HomeSection onOpenForm={() => setIsFormOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onSectionChange={(section: string) =>
          setCurrentSection(section as "home" | "premios" | "proposta")
        }
        onOpenForm={() => setIsFormOpen(true)}
        currentSection={currentSection}
      />

      <main className="pt-20">
        {renderSection()}
      </main>

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

const HomeSection = ({ onOpenForm }: { onOpenForm: () => void }) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="block gradient-primary bg-clip-text text-transparent">
                Nova Era
              </span>
              <span className="block text-foreground mt-2">
               Igaming
              </span>
              <span className="block text-xl md:text-2xl font-semibold text-accent mt-4">
                Programa de Afiliados
              </span>
            </h1>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Junte-se à <span className="text-primary font-semibold">elite dos afiliados</span> e 
              <span className="text-accent font-semibold"> maximize seus resultados</span> com as 
              melhores oportunidades do mercado
            </p>
          </div>

          <div
  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up"
  style={{ animationDelay: "0.4s" }}
>
  {/* Botão Inscrever-se Agora (borda verde neon girando) */}
  <div className="glow-border glow-green rounded-2xl">
    <Button
      onClick={onOpenForm}
      size="lg"
      className="relative z-10 bg-background font-bold text-lg px-12 py-6 rounded-2xl"
    >
      <span className="flex items-center gap-3">
        Inscrever-se Agora
        <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
      </span>
    </Button>
  </div>

  {/* Botão Ver Detalhes (borda prata girando) */}
  <div className="glow-border glow-silver rounded-2xl">
    <Button
      variant="outline"
      size="lg"
      className="relative z-10 bg-background font-semibold text-lg px-12 py-6 rounded-2xl"
    >
      Ver Detalhes
    </Button>
  </div>
</div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-8 glass rounded-2xl hover-lift group border border-primary/10">
              <div className="w-16 h-16 gradient-elegant rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-500">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-foreground">Altas Comissões</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ganhe até <span className="text-accent font-semibold">R$90 por CPA</span>
              </p>
            </div>

            <div className="text-center p-8 glass rounded-2xl hover-lift group border border-primary/10" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 gradient-elegant rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-500">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-foreground">Suporte Completo</h3>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-primary font-semibold">CRM integrado</span>, base zerada e 
                <span className="text-accent font-semibold"> suporte dedicado</span>
              </p>
            </div>

            <div className="text-center p-8 glass rounded-2xl hover-lift group border border-primary/10" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 gradient-elegant rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-500">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="font-bold text-xl mb-4 text-foreground">Pagamentos Semanais</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receba seus ganhos <span className="text-success font-semibold">semanalmente</span>, 
                sem burocracias e com <span className="text-primary font-semibold">transparência total</span>
              </p>
            </div>
          </div>
          <footer className="bg-[#080808] text-gray-300 py-16">
  <div className="container mx-auto px-6">

    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between gap-12 items-start">

      {/* Logo + descrição */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <img src="/assets/log_blacksheep2.0.png" alt="Logo BlackSheep" className="h-14 w-auto" />
        <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">
          A BlackSheep é o maior programa de afiliados de cassino do mundo, oferecendo soluções digitais confiáveis e seguras para maximizar sua performance e ganhos online.
        </p>
      </div>

      {/* Selos de confiança */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { icon: "✅", label: "100% Seguro", color: "text-green-500" },
          { icon: "🛡️", label: "Licenciado", color: "text-blue-500" },
          { icon: "⭐", label: "5 Estrelas", color: "text-yellow-400" },
          { icon: "🏆", label: "Líderes do Mercado", color: "text-purple-500" },
        ].map((selo, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-[#101010] px-4 py-2 rounded-lg border border-gray-800 transition-transform transform hover:scale-105"
          >
            <span className={`${selo.color} text-lg`}>{selo.icon}</span>
            <span className="font-medium text-sm">{selo.label}</span>
          </div>
        ))}
      </div>

      {/* Links Rápidos */}
      <div className="flex flex-col items-center md:items-end gap-2">
        <h3 className="text-white font-semibold mb-2">Links Rápidos</h3>
        {["Sobre Nós", "Contato", "Política de Privacidade", "Termos de Serviço"].map((link, idx) => (
          <a
            key={idx}
            href="#"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {link}
          </a>
        ))}
      </div>

    </div>

    {/* Divider */}
    <div className="my-10 border-t border-gray-800"></div>

    {/* Bottom Section */}
    <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">
      <span>© {new Date().getFullYear()} BlackSheep. Todos os direitos reservados.</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
        </a>
      </div>
    </div>

  </div>
</footer>


        </div>
      </div>
    </section>
  );
};

export default Index;
