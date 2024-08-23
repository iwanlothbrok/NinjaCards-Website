'use client';

import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <div className="bg-black text-white flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why is it so great?
        </h2>
        <p className="text-gray-400 mb-8">
          Nunc tincidunt vulputate elit. Mauris varius purus malesuada neque
          iaculis malesuada. Aenean gravida magna orci, non efficitur est porta
          id. Donec magna diam.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Support 24/7
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Updates
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Modules
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Analytics
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Reports
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Blocks
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Components
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Mobile
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-green-500">✔</span> Templates
            </div>
          </div>
        </div>
      </div>

      {/* iPhone Mockup */}
      <section
        className="relative flex items-center justify-center mt-8 md:mt-0 w-[212px] h-[438px] bg-cover bg-center rounded-[35px] border border-white"
        style={{
          backgroundImage:
            "url('https://webdevartur.com/wp-content/uploads/2022/08/ryan-klaus-8QjsdoXDsZs-unsplash-scaled.jpg')",
        }}
      >
        <div className="absolute left-[-2px] top-[81.5px] w-[2px] h-[13px] bg-white rounded opacity-80"></div>
        <div className="absolute left-[-1.5px] top-[110px] w-[1px] h-[28px] bg-white rounded opacity-80"></div>
        <div className="absolute left-[-1.5px] top-[148px] w-[1px] h-[28px] bg-white rounded opacity-80"></div>
        <div className="absolute right-[-2px] top-[121px] w-[2px] h-[45px] bg-white rounded opacity-80"></div>
        <div className="relative w-full h-full border-6 border-black rounded-[35px] flex items-center justify-center">
          <div className="absolute top-0 flex items-center justify-center w-[76px] h-[20px] bg-black rounded-b-[15px]">
            <div className="absolute left-[12px] top-[5px] w-[5px] h-[5px] bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-[4px] h-[4px] bg-white bg-opacity-30 rounded-full blur-[1px]"></div>
              <div className="w-[1px] h-[1px] bg-black bg-opacity-70 rounded-full"></div>
            </div>
            <div className="absolute top-[-3px] w-[28px] h-[1px] bg-white bg-opacity-20 rounded-full"></div>
          </div>
          <div className="absolute top-[34px] w-[12px] h-[10px] bg-white rounded-[2px]">
            <div className="absolute top-[-7px] left-[1.7px] w-[9px] h-[15px] border border-[1.5px] border-white rounded-[20px]"></div>
          </div>
          <div className="absolute top-[46px] text-[42px] font-thin">19:53</div>
          <div className="absolute top-[92px] text-[10px] font-thin">
            Tuesday, 9 August
          </div>
          <div className="absolute top-[8px] right-[17px] flex items-center space-x-[5px] text-[10px]">
            <div className="relative flex items-center justify-center w-[14px] h-[7px] border border-white border-opacity-70 rounded-[2px]">
              <div className="absolute left-[1px] top-[1px] w-[11px] h-[5px] bg-white rounded-[1px]"></div>
              <div className="absolute right-[-2px] top-[1.5px] w-[1px] h-[3px] bg-white rounded-[2px]"></div>
            </div>
          </div>
          <div className="absolute left-[29px] bottom-[30px] w-[23px] h-[23px] bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-250 hover:scale-110">
            <div className="w-[6px] h-[1px] bg-white rounded"></div>
            <div className="mt-[1px] w-[6px] h-[4px] bg-white rounded-t-[0.5px] rounded-b-[50%]"></div>
            <div className="mt-[-1px] w-[3px] h-[9px] bg-white rounded"></div>
            <div className="absolute top-[10px] left-[10.5px] w-[2px] h-[4px] bg-black rounded-full flex items-center justify-center">
              <div className="w-[1.2px] h-[1.2px] bg-white rounded-full"></div>
            </div>
          </div>
          <div className="absolute right-[29px] bottom-[30px] w-[23px] h-[23px] bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-250 hover:scale-110">
            <div className="w-[12px] h-[8px] bg-white rounded"></div>
            <div className="absolute top-[6px] w-[5px] h-[2px] bg-white rounded-t-[1px]"></div>
            <div className="absolute top-[9px] w-[5px] h-[5px] border border-black rounded-full"></div>
            <div className="absolute top-[7px] right-[5.2px] w-[5px] h-[5px] bg-black rounded-full transform scale-[0.2]"></div>
          </div>
          <div className="absolute bottom-[6px] w-[80px] h-[2px] bg-white bg-opacity-80 rounded-[2px]"></div>
        </div>
      </section>
      <div className="absolute left-[35px] top-[35px] text-xs">
        Codepen by{' '}
        <a
          href="https://webdevartur.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#fc7904]"
        >
          Artur Burkalo
        </a>
      </div>
    </div>
  );
};

export default About;
