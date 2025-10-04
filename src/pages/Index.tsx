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
    {/* Facebook */}
    <a href="#" className="hover:text-white transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 
        24h11.495v-9.294H9.691V11.01h3.129V8.413c0-3.1 1.893-4.788 
        4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 
        0-1.796.715-1.796 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116C23.4 
        24 24 23.4 24 22.676V1.325C24 .6 23.4 0 22.675 0z"/>
      </svg>
    </a>

    {/* Twitter */}
    <a href="#" className="hover:text-white transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 
        4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 
        1.184A4.916 4.916 0 0 0 16.616 3c-2.724 0-4.932 
        2.208-4.932 4.932 0 .386.045.762.127 
        1.124C7.728 8.87 4.1 6.89 1.671 
        3.905a4.93 4.93 0 0 0-.666 
        2.479c0 1.708.869 3.216 2.188 
        4.099a4.904 4.904 0 0 1-2.229-.616v.062c0 
        2.385 1.693 4.374 3.946 
        4.827a4.935 4.935 0 0 1-2.224.084 
        4.928 4.928 0 0 0 4.6 3.417A9.867 
        9.867 0 0 1 0 19.54a13.933 13.933 0 0 0 
        7.548 2.212c9.057 0 14.01-7.514 
        14.01-14.01 0-.213-.005-.425-.014-.636A10.012 
        10.012 0 0 0 24 4.557z"/>
      </svg>
    </a>

    {/* Instagram */}
    <a href="#" className="hover:text-white transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 
        4.85.07 1.366.062 2.633.35 3.608 
        1.325.975.975 1.263 2.242 1.325 
        3.608.058 1.266.07 1.646.07 
        4.85s-.012 3.584-.07 4.85c-.062 
        1.366-.35 2.633-1.325 3.608-.975.975-2.242 
        1.263-3.608 1.325-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.35-3.608-1.325-.975-.975-1.263-2.242-1.325-3.608C2.175 
        15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.35-2.633 
        1.325-3.608.975-.975 2.242-1.263 3.608-1.325C8.416 
        2.175 8.796 2.163 12 2.163zm0 
        1.837c-3.17 0-3.549.012-4.796.07-1.05.048-1.62.218-1.993.465-.423.27-.723.59-.993 
        1.012-.247.373-.417.943-.465 
        1.993-.058 1.247-.07 1.626-.07 
        4.796s.012 3.549.07 4.796c.048 1.05.218 
        1.62.465 1.993.27.423.59.723 
        1.012.993.373.247.943.417 
        1.993.465 1.247.058 1.626.07 
        4.796.07s3.549-.012 4.796-.07c1.05-.048 
        1.62-.218 1.993-.465.423-.27.723-.59.993-1.012.247-.373.417-.943.465-1.993.058-1.247.07-1.626.07-4.796s-.012-3.549-.07-4.796c-.048-1.05-.218-1.62-.465-1.993-.27-.423-.59-.723-1.012-.993-.373-.247-.943-.417-1.993-.465-1.247-.058-1.626-.07-4.796-.07zm0 
        3.738a6.299 6.299 0 1 1 0 12.598 6.299 6.299 0 0 1 0-12.598zm0 
        10.413a4.114 4.114 0 1 0 0-8.228 4.114 4.114 0 0 0 0 8.228zm6.406-11.845a1.44 
        1.44 0 1 1 0-2.881 1.44 1.44 0 0 1 0 2.881z"/>
      </svg>
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
