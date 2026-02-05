import React from "react";

const WaveSVG = ({ className }) => {
  const lines = Array.from({ length: 22 });

  return (
    <svg
      viewBox="0 0 1400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="white" strokeWidth="2" fill="none" >
        {lines.map((_, i) => {
          const y = 40 + i * 16;

          // 🔑 magic numbers (image-matched)
          const amp = 38 + i * 0.8;
          const baseWidth = 1200;
          const cut = i * 18;                    // each line gets shorter
          const width = baseWidth - cut;

          return (
            <path
              key={i}
              d={`
                M -200 ${y}
                C ${width * 0.25} ${y - amp},
                  ${width * 0.45} ${y + amp},
                  ${width * 0.6} ${y}

                C ${width * 0.75} ${y - amp},
                  ${width * 0.9} ${y + amp},
                  ${width} ${y}
              `}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default WaveSVG;
