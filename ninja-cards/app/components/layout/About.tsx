'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const controls = useAnimation();
  const sectionControls = useAnimation();
  const headerControls = useAnimation();
  const featuresControls = useAnimation();
  const buttonControls = useAnimation();
  const imageControls = useAnimation();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featuresRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            switch (entry.target) {
              case sectionRef.current:
                sectionControls.start('visible');
                break;
              case headerRef.current:
                headerControls.start('visible');
                break;
              case featuresRef.current:
                featuresControls.start('visible');
                break;
              case buttonRef.current:
                buttonControls.start('visible');
                break;
              case imageRef.current:
                imageControls.start('visible');
                break;
              default:
                break;
            }
            // Stop observing once visible to avoid toggling back to hidden
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [sectionControls, headerControls, featuresControls, buttonControls, imageControls]);

  return (
    <div className='bg-gradient-to-b from-black via-gray-950 to-black p-1'>
      {/* Section Header */}
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={headerControls}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: -10 },
        }}
        transition={{ duration: 0.8 }}
        className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100 mb-4 pt-10 space-y-4 text-center"
      >
        <motion.div
          initial="hidden"
          animate={headerControls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -10 },
          }}
          transition={{ duration: 0.6 }}
          className="inline-block  px-3 py-1  text-sm font-semibold text-indigo-100 bg-[#202c47] rounded-full bg-opacity-70 hover:cursor-pointer hover:bg-opacity-50"
        >
          Профил
        </motion.div>
        <motion.h1
          initial="hidden"
          animate={headerControls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -10 },
          }}
          transition={{ duration: 0.7 }}
          className="text-2xl font-semibold text-white sm:text-3xl"
        >
          Отключете мощта на NFC технологията 
        </motion.h1>
        <motion.p
          initial="hidden"
          animate={headerControls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -10 },
          }}
          transition={{ duration: 0.8 }}
          className="text-md text-gray-200 sm:text-lg"
        >
          Преминете към следващото поколение визитки. Нашите NFC решения правят споделянето на контакт лесно и впечатляващо.
        </motion.p>
      </motion.div>

      <div className="relative text-white flex flex-col md:flex-row items-center justify-evenly p-8 md:p-16">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={sectionControls}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -50 },
          }}
          transition={{ duration: 1 }}
          className="max-w-md about-section"
        >
          <motion.h2
            initial="hidden"
            animate={sectionControls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -50 },
            }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left leading-tight"
          >
            Вашият персонализиран профил в <span className="text-orange">NinjaCard</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -50 },
            }}
            transition={{ duration: 0.9 }}
            className="text-gray-400 mb-6 text-center md:text-left leading-relaxed"
          >
            Получете уникална смарт визитка с изцяло ваш дизайн, която съдържа всичко необходимо за вас и вашите бъдещи клиенти. Профилът Ви ще бъде винаги актуален и лесно достъпен, предоставяйки на клиентите Ви незабавен достъп до важна информация и контакти.
          </motion.p>
          <motion.p
            initial="hidden"
            animate={sectionControls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -50 },
            }}
            transition={{ duration: 1 }}
            className="text-gray-400 mb-8 text-center md:text-left leading-relaxed"
          >
            С <span className="text-orange">NinjaCard</span> профила си можете лесно да споделите всички ваши данни за контакт, връзки към социални мрежи, уебсайтове и още много! Останете свързани в съвременния дигитален свят.
          </motion.p>
          {isMobile === false ? (
            <motion.div
              ref={featuresRef}
              initial="hidden"
              animate={featuresControls}
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 1.4 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm"
            >
              {[
                'Мигновено споделяне',
                'Персонализиран дизайн',
                'Здравина и дълготрайност',
                'Безконтактно използване',
                '60 връзки на едно място',
                'Всичко на едно място',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={featuresControls}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  transition={{ duration: 0.5, delay: index * 0.4 }}
                  className="flex items-center"
                >
                  <span className="mr-2 text-lg text-green-500">✔</span> {item}
                </motion.div>
              ))}
            </motion.div>
          ) : null}
          <motion.div
            ref={buttonRef}
            initial="hidden"
            animate={buttonControls}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.9 },
            }}
            transition={{ duration: 1.4 }}
            className="mt-10 mb-8 flex justify-center md:justify-start"
          >

            <Link href="/products/cards">
              <button className="bg-gradient-to-r from-orange to-teal-600 text-white px-9 py-4 rounded-full transition-transform transform hover:scale-105 focus:outline-none shadow-xl">
                ВЗЕМИ ТВОЯТА ВИЗИТКА
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* iPhone Mockup */}
        <motion.section
          ref={imageRef}
          initial="hidden"
          animate={imageControls}
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          transition={{ duration: 1.5 }}
          className="relative flex items-center justify-center w-[300px] h-[600px] bg-cover bg-center transform transition-transform duration-500 hover:scale-105"
        >
          <img
            src="/realMockup.png"
            alt="Profile Details Screenshot"
            className="absolute w-[99%] h-[100%] object-cover rounded-[29px] shadow-2xl transform transition-transform duration-500 hover:scale-100"
          />
        </motion.section>
        {isMobile === true ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm my-8">
            {[
              'Мигновено споделяне',
              'Персонализиран дизайн',
              'Здравина и дълготрайност',
              'Безконтактно използване',
              '60 връзки на едно място',
              'Всичко на едно място',
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2 text-lg text-green-500">✔</span> {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div >
  );
};

export default About;
