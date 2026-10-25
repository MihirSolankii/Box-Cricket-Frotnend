import { Zap, Users2, Trophy, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    tag: 'Fast & Live',
    title: 'Instant Slot Booking',
    description: 'Real-time pitch availability with 30-second checkout. No phone calls needed.',
    gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    icon: Users2,
    tag: 'Squad Friendly',
    title: 'Split Bills with Team',
    description: 'Split box cricket fees evenly among your players directly via UPI or cards.',
    gradient: 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20',
  },
  {
    icon: ShieldCheck,
    tag: 'Verified Quality',
    title: 'Pro Turf & Floodlights',
    description: 'Pitches inspected for premium shock-absorbing artificial turf, boundary nets & pro lighting.',
    gradient: 'from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20',
  },
  {
    icon: Trophy,
    tag: 'Competitive',
    title: 'Host Box Tournaments',
    description: 'Organize weekend corporate or neighborhood box cricket leagues and track match stats.',
    gradient: 'from-purple-500/10 to-pink-500/10 text-purple-500 border-purple-500/20',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-14 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Intro Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
            <Flame size={13} className="text-emerald-500 fill-emerald-500" />
            <span>Built For Cricket Lovers</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Why Players Book With Us
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            The easiest way to discover, reserve, and enjoy box cricket under floodlights with your team.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="flex flex-col p-6 rounded-2xl bg-card border border-border/60 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${feature.gradient} border flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <feature.icon size={26} />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {feature.tag}
                </span>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-emerald-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

