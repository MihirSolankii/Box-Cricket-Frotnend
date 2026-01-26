import { Search, CalendarDays, Trophy } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Choose Turf',
      description: 'Browse and find the perfect box cricket turf near you with our easy search.',
    },
    {
      icon: CalendarDays,
      title: 'Select Slot',
      description: 'Pick your preferred date and time slot that works for you and your team.',
    },
    {
      icon: Trophy,
      title: 'Play & Enjoy',
      description: 'Show up, play your heart out, and create amazing cricket memories.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book your turf in just 3 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center group">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground max-w-xs">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;