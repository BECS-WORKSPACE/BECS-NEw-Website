import React from 'react';

const AutoCarousel = ({ children, speed = 1, reverse = false }) => {
  return (
    <div className="auto-carousel-wrapper" style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', position: 'relative' }}>
      <style>
        {`
          @keyframes scroll-carousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-carousel-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .auto-carousel-track {
            display: inline-flex;
            width: max-content;
            animation: scroll-carousel ${40 / speed}s linear infinite;
          }
          .auto-carousel-track.reverse {
            animation-name: scroll-carousel-reverse;
          }
          .auto-carousel-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className={`auto-carousel-track ${reverse ? 'reverse' : ''}`}>
        <div style={{ display: 'flex', gap: '20px', paddingRight: '20px' }}>{children}</div>
        <div style={{ display: 'flex', gap: '20px', paddingRight: '20px' }}>{children}</div>
      </div>
    </div>
  );
};

export default AutoCarousel;
