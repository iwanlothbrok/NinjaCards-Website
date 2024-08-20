import React from 'react';

export const Testimonies: React.FC = () => {
  return (
    <section id="testimonies" className="py-12 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
          <div className="mb-8 space-y-4 text-center">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40">
              Words from Others
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              It's not just us.
            </h1>
            <p className="text-lg text-gray-100 sm:text-xl">
              Here's what others have to say about us.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <a href={testimonial.link} className="cursor-pointer">
                  <div className="relative p-4 space-y-4 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image}
                        className="w-10 h-10 bg-center bg-cover border rounded-full"
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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    name: 'Kanye West',
    title: 'Rapper & Entrepreneur',
    quote: 'Find God.',
    image:
      'https://pbs.twimg.com/profile_images/1276461929934942210/cqNhNk6v_400x400.jpg',
    link: 'https://twitter.com/kanyewest',
  },
  {
    name: 'Tim Cook',
    title: 'CEO of Apple',
    quote:
      'Diam quis enim lobortis scelerisque fermentum dui faucibus in ornare. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum.',
    image:
      'https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg',
    link: 'https://twitter.com/tim_cook',
  },
  {
    name: 'Parag Agrawal',
    title: 'CEO of Twitter',
    quote:
      'Enim neque volutpat ac tincidunt vitae semper. Mattis aliquam faucibus purus in massa tempor.',
    image:
      'https://pbs.twimg.com/profile_images/1375285353146327052/y6jeByyD_400x400.jpg',
    link: 'https://twitter.com/paraga',
  },
  {
    name: 'Satya Nadella',
    title: 'CEO of Microsoft',
    quote:
      'Tortor dignissim convallis aenean et tortor at. At ultrices mi tempus imperdiet nulla malesuada.',
    image:
      'https://pbs.twimg.com/profile_images/1221837516816306177/_Ld4un5A_400x400.jpg',
    link: 'https://twitter.com/satyanadella',
  },
  {
    name: 'Dan Schulman',
    title: 'CEO of PayPal',
    quote: 'Quam pellentesque nec nam aliquam sem et tortor consequat id.',
    image:
      'https://pbs.twimg.com/profile_images/516916920482672641/3jCeLgFb_400x400.jpeg',
    link: 'https://twitter.com/dan_schulman',
  },
  {
    name: 'Elon Musk',
    title: 'CEO of Tesla',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image:
      'https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg',
    link: 'https://twitter.com/elonmusk',
  },
];

export default Testimonies;
