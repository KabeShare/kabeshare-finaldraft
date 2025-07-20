import React, { useState, useEffect } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      imgSrc: assets.home1,
    },
    {
      id: 2,
      imgSrc: assets.home2,
    },
    {
      id: 3,
      imgSrc: assets.home3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full h-[500px]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex items-center justify-center py-8 md:px-0 px-0 mt-6 rounded-xl min-w-full h-full relative"
          >
            <div className="w-full h-full relative">
              <Image
                className="object-cover rounded-xl"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
              />
            </div>
            <p className="text-center mt-4 relative z-10">{slide.title}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index ? 'bg-orange-600' : 'bg-white'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
