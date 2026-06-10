import React, { useRef, useEffect, useState } from 'react';
import { Droplets, GraduationCap, HeartPulse, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';


interface ImpactBentoGridProps {
  isUrdu: boolean;
}

/** Animated counter that counts up to a target value */
const CountUp = ({ target, suffix = '', isInView }: { target: number; suffix?: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      start = start || timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);
  return <>{count.toLocaleString()}{suffix}</>;
};

const ImpactBentoGrid: React.FC<ImpactBentoGridProps> = ({ isUrdu }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      id: 'medical',
      value: 500,
      suffix: '+',
      labelEn: 'Medical Camps Organized',
      labelUr: 'طبی کیمپ منعقد ہوئے',
      icon: HeartPulse,
      bg: 'bg-brand-teal',
      textColor: 'text-brand-white',
      colSpan: 'col-span-2',
      hasPattern: true,
    },
    {
      id: 'children',
      value: 50,
      suffix: 'K',
      labelEn: 'Children Educated',
      labelUr: 'بچوں کو تعلیم دی گئی',
      icon: GraduationCap,
      bg: 'bg-brand-gold',
      textColor: 'text-brand-navy',
      colSpan: 'col-span-1',
      hasPattern: false,
    },
    {
      id: 'water',
      value: 1200,
      suffix: '+',
      labelEn: 'Water Projects',
      labelUr: 'پانی کے منصوبے',
      icon: Droplets,
      bg: 'bg-brand-white border border-brand-navy/10',
      textColor: 'text-brand-navy',
      colSpan: 'col-span-1',
      hasPattern: false,
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl md:text-5xl font-extrabold text-brand-navy mb-4 ${isUrdu ? 'font-urduHeading' : ''}`}>
            {isUrdu ? 'ہمارا اثر — ارقام میں' : 'Our Impact — In Numbers'}
          </h2>
          <p className="text-brand-navy/60 text-base md:text-lg max-w-2xl">
            {isUrdu ? 'ہر عدد ایک کہانی بیان کرتا ہے — ایک زندگی بدلی، ایک کمیونٹی مضبوط ہوئی۔' : 'Every number tells a story — a life changed, a community strengthened.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className={`${stat.colSpan} ${stat.bg} ${stat.textColor} rounded-[2rem] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {stat.hasPattern && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: 'url("/assets/pattern-jali-accent.webp")', backgroundSize: '150px' }}
                  />
                )}
                <Icon className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
                <div className="relative z-10">
                  <p className="text-3xl md:text-5xl font-extrabold">
                    {isInView ? <CountUp target={stat.value} suffix={stat.suffix} isInView={isInView} /> : '0'}
                  </p>
                  <p className={`text-sm md:text-lg mt-1 opacity-80 ${isUrdu ? 'font-urduBody' : ''}`}>
                    {isUrdu ? stat.labelUr : stat.labelEn}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Full-width certification box */}
          <motion.div
            className="col-span-2 bg-brand-gray border border-brand-navy/5 rounded-[2rem] p-6 md:p-10 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className={`text-3xl md:text-5xl font-extrabold text-brand-navy ${isUrdu ? 'font-urduHeading' : ''}`}>
              {isUrdu ? '٪100' : '100%'}
            </p>
            <div>
              <p className={`text-sm md:text-lg text-brand-navy/70 mb-4 ${isUrdu ? 'font-urduBody' : ''}`}>
                {isUrdu ? 'آپ کا عطیہ مستحقین تک پہنچتا ہے' : 'of your donation reaches those in need'}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-xs bg-brand-white border border-brand-navy/10 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" />
                  {isUrdu ? 'PCP تصدیق شدہ' : 'PCP Certified'}
                </span>
                <span className="flex items-center gap-1.5 text-xs bg-brand-white border border-brand-navy/10 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" />
                  {isUrdu ? 'FBR ٹیکس فری' : 'FBR Tax Exempt'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactBentoGrid;
