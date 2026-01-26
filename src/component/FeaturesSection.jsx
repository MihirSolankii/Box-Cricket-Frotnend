import { Building2, Trophy, Calendar } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'List Your Venue',
    description: 'Register your cricket box and reach thousands of players',
  },
  {
    icon: Trophy,
    title: 'Host Cricket',
    description: 'Organize matches and tournaments with ease',
  },
  {
    icon: Calendar,
    title: 'Your Bookings',
    description: 'Manage all your reservations in one place',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon size={28} />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
