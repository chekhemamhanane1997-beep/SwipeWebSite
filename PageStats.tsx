import { motion } from 'motion/react';

interface PageStatsProps {
  sectionsCount: number;
  cardsCount: number;
  mediasCount: number;
  className?: string;
}

export function PageStats({ 
  sectionsCount, 
  cardsCount, 
  mediasCount,
  className = '' 
}: PageStatsProps) {
  const stats = [
    {
      label: 'Sections',
      value: sectionsCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      color: 'from-[#003b71] to-[#0055a5]'
    },
    {
      label: 'Cartes',
      value: cardsCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-[#e63946] to-[#d4183d]'
    },
    {
      label: 'Médias',
      value: mediasCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-[#ff6b35] to-[#ff8c5a]'
    }
  ];

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            
            <div className="text-sm text-white/70">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
