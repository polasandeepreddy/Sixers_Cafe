import React, { useEffect, useRef, useState } from 'react';

const images = [
  'https://blog.cricheroes.com/wp-content/uploads/2023/12/World-of-Box-Cricket.jpg',
  'https://images.pexels.com/photos/9882088/pexels-photo-9882088.jpeg',
  'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg',
  'https://images.pexels.com/photos/21264/pexels-photo.jpg',
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
];

const AutoScrollingImages: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    let animationFrameId: number;

    const scrollImages = () => {
      if (!isHovered) {
        scrollAmount += 1;
        if (scrollAmount >= container.scrollWidth / 2) {
          scrollAmount = 0;
          container.scrollLeft = 0;
        } else {
          container.scrollLeft = scrollAmount;
        }
      }
      animationFrameId = requestAnimationFrame(scrollImages);
    };

    animationFrameId = requestAnimationFrame(scrollImages);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ maxWidth: '100%', userSelect: 'none' }}
    >
      {[...images, ...images].map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          className="inline-block w-64 h-40 object-cover rounded-lg mx-2"
          draggable={false}
        />
      ))}
    </div>
  );
};

export default AutoScrollingImages;
