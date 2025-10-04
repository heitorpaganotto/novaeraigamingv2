import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Casino {
  id: string;
  name: string;
  image: string;
  benefits: string[];
  packages: {
    title: string;
    type: 'CPA' | 'Híbrido' | 'REV';
    items: string[];
  }[];
}

const casinos: Casino[] = [
  {
    id: 'bet7k',
    name: 'BET7K',
    image: '/assets/logo-bet7k.webp',
    benefits: ['Alto renome no mercado', 'CRM Integrado', 'LTV eterno', 'Pagamentos Semanais'],
    packages: [
      {
        title: 'CPA',
        type: 'CPA',
        items: [
          'R$30 CPA com Baseline 10',
          'R$60 CPA com Baseline 30',
          'R$90 CPA com Baseline 40'
        ]
      },
      {
        title: 'Modelo Híbrido (CPA + REV)',
        type: 'Híbrido',
        items: [
          'R$30 CPA com Baseline 15 + 10% REV',
          'R$50 CPA com Baseline 30 + 15% REV',
          'R$80 CPA com Baseline 40 + 20% REV'
        ]
      },
      {
        title: 'FULL REV',
        type: 'REV',
        items: ['30% REV']
      }
    ]
  },
  {
    id: 'cassinobet',
    name: 'CassinoBet',
    image: '/assets/logo-cassino-bet.jpg',
    benefits: ['Conhecida em todo Brasil', 'CRM Integrado', 'LTV eterno', 'Pagamentos Semanais'],
    packages: [
      {
        title: 'CPA',
        type: 'CPA',
        items: [
          'R$30 CPA com Baseline 10',
          'R$60 CPA com Baseline 30',
          'R$90 CPA com Baseline 40'
        ]
      },
      {
        title: 'Modelo Híbrido (CPA + REV)',
        type: 'Híbrido',
        items: [
          'R$30 CPA com Baseline 15 + 10% REV',
          'R$50 CPA com Baseline 30 + 15% REV',
          'R$80 CPA com Baseline 40 + 20% REV'
        ]
      },
      {
        title: 'FULL REV',
        type: 'REV',
        items: ['30% REV']
      }
    ]
  },
  {
    id: 'betvera',
    name: 'BetVera',
    image: '/assets/logo-betvera.png',
    benefits: ['Base Zerada', 'CRM Integrado', 'LTV eterno', 'Pagamentos Semanais'],
    packages: [
      {
        title: 'CPA',
        type: 'CPA',
        items: [
          'R$20 CPA com Baseline 10',
          'R$40 CPA com Baseline 20',
          'R$60 CPA com Baseline 30'
        ]
      },
      {
        title: 'Modelo Híbrido (CPA + REV)',
        type: 'Híbrido',
        items: ['R$30 CPA com Baseline 30 + 20% REV']
      },
      {
        title: 'FULL REV',
        type: 'REV',
        items: ['30% REV']
      }
    ]
  }
];

const PropostaSection = () => {
  const [selectedCasino, setSelectedCasino] = useState<Casino | null>(null);

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'CPA': return 'border-accent text-accent bg-accent/10';
      case 'Híbrido': return 'border-primary text-primary bg-primary/10';
      case 'REV': return 'border-success text-success bg-success/10';
      default: return 'border-muted text-muted-foreground bg-muted/10';
    }
  };

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-32 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-32 w-64 h-64 bg-accent/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-black mb-6 gradient-primary bg-clip-text text-transparent">
            Nossas
          </h2>
          <h2 className="text-5xl md:text-7xl font-black mb-6 white bg-clip-text">Propostas</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <span className="text-primary font-semibold">Três cassinos premium</span> com ofertas exclusivas. Clique em cada proposta para descobrir <span className="text-accent font-semibold">oportunidades únicas</span> de ganhos.
          </p>
        </div>

        {/* Casino Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {casinos.map((casino, index) => (
            <Card
              key={casino.id}
              className="overflow-hidden hover-lift cursor-pointer shadow-card bg-card border border-primary/10 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedCasino(casino)}
            >
              {/* Image with hover */}
              <div className="relative h-72 md:h-96 overflow-hidden rounded-xl">
                <img
                  src={casino.image}
                  alt={casino.name}
                  className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-black text-3xl mb-2">{casino.name}</h3>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-lg">🎯</span>
                    <span className="font-medium">Clique para ver as propostas</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="glass rounded-full px-3 py-1">
                    <span className="text-white font-bold text-sm">Premium</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Casino Details Modal */}
      <Dialog open={!!selectedCasino} onOpenChange={() => setSelectedCasino(null)}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto glass border border-primary/20">
          {selectedCasino && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-4xl font-black text-center gradient-primary bg-clip-text text-transparent">
                  🎯 {selectedCasino.name}
                </DialogTitle>
                <p className="text-center text-muted-foreground text-lg mt-2">
                  Ofertas exclusivas e benefícios premium para sub afiliados
                </p>
              </DialogHeader>

              {/* Benefits */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                    ✨ Benefícios Adicionais
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCasino.benefits.map((benefit, index) => (
                      <div key={index} className="glass rounded-xl p-4 text-center hover-scale border border-primary/10">
                        <div className="text-2xl mb-2">
                          {index === 0 ? '🔄' : index === 1 ? '🎯' : index === 2 ? '♾️' : '💰'}
                        </div>
                        <p className="text-sm font-bold text-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packages */}
                <div className="space-y-8">
                  {selectedCasino.packages.map((pkg, index) => (
                    <div key={index} className={`border-2 rounded-2xl p-8 glass hover-lift ${getPackageColor(pkg.type).replace('bg-', 'border-').replace('/10', '/30')}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPackageColor(pkg.type)}`}>
                          <span className="font-bold">
                            {pkg.type === 'CPA' ? '💰' : pkg.type === 'Híbrido' ? '🔀' : '🚀'}
                          </span>
                        </div>
                        <h4 className={`text-2xl font-black ${getPackageColor(pkg.type).split(' ')[1]}`}>
                          {pkg.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pkg.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start glass rounded-xl p-4">
                            <span className="w-3 h-3 bg-accent rounded-full mr-3 mt-1 shrink-0" />
                            <span className="text-foreground font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="text-center pt-6">
                  <div className="glass rounded-2xl p-8 border border-primary/10">
                    <h4 className="text-2xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
                      🎉 Pronto para Começar?
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      Junte-se ao <span className="text-primary font-bold">{selectedCasino.name}</span> e comece a ganhar com as melhores condições do mercado
                    </p>
                    <Button className="gradient-elegant hover:shadow-glow font-bold px-8 py-3 rounded-xl hover-scale border border-primary/20">
                       Quero Me Inscrever Agora
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PropostaSection;
