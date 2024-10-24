import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const Testimonies: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start('visible');
          } else {
            controls.start('hidden');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
      id="testimonies"
      className="py-12 px-4 bg-gray-950 p-1"
    >
      <div className="max-w-6xl mx-auto">
        <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
          <div className="mb-8 space-y-4 text-center">
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40"
            >
              Клиенти
            </motion.div>
            <motion.h1
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.7 }}
              className="text-2xl font-semibold text-white sm:text-3xl"
            >
              Гласовете на нашите клиенти
            </motion.h1>
            <motion.p
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -20 },
              }}
              transition={{ duration: 0.8 }}
              className="text-md text-gray-100 sm:text-lg"
            >
              Чуйте какво споделят нашите доволни клиенти за продуктите и услугите ни.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-sm leading-6"
            >
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-orange to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-4 space-y-4 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      className="w-16 h-16 bg-center bg-cover border rounded-full"
                      alt={testimonial.name}
                    />
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-sm">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const testimonials = [
  {
    name: 'ImpeRiums',
    title: 'Предприемач',
    quote: 'Ninja Cards напълно промени начина, по който се запознавам с хора. Винаги се срещам с нови клиенти и да имам интелигентна визитна картичка, която може незабавно да прехвърли данните ми на техния телефон, е изключително удобно. Възможностите за персонализиране също ми позволиха да създам визитка, която наистина отразява моята марка. Силно препоръчвам!',
    image:
      '/logos/impr.png',
  },
  {
    name: 'Whiz Academy',
    title: 'Менторство по програмиране',
    quote:
      'Преминаването към смарт визитките на Ninja Cards беше едно от най-добрите решения за моя бизнес! Сега мога лесно да споделям данните си за контакт и портфолиото си с едно докосване. Няма повече да печатам стотици традиционни визитки. Това е огромно подобрение, а клиентите ми харесват елегантния дизайн и лекотата на използване!',
    image:
      '/logos/whiz.png',
  },
  {
    name: 'Рай 25',
    title: 'Архитектурни и инженерни дейности',
    quote:
      'В Рай 25 сме развълнувани от невероятния отклик на Google Ревюта! Само за една седмица получихме повече от 40 положителни отзива и беше много вълнуващо да видим колко много хората реагират в сравнение с преди.Лесно споделяне на информация и препращане към ревю.Препоръчвам на всеки физически бизнес!',
    image:
      '/logos/gr.png',
  },
];
// В Рай 25 сме развълнувани от невероятния отклик на Google Ревюта! Само за една седмица получихме повече от 40 положителни отзива и беше много вълнуващо да видим колко много хората реагират в сравнение с преди. Лесно споделяне на информация и препращане към ревю. Препоръчвам на всеки физически бизнес!
export default Testimonies;
