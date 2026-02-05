import React from "react";

const WaveSVG = ({ className }) => {
  return (
    <svg
      viewBox="0 0 1200 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="white" strokeWidth="2" fill="none">
        {[
          480,460,440,420,400,380,360,340,320,300,
          280,260,240,220,200,180,160,140,120,100
        ].map((y, i) => (
          <path
            key={i}
            d={`M-100 ${y} 
                C 100 ${y-60}, 300 ${y+60}, 500 ${y}, 
                  700 ${y-60}, 900 ${y+60}, 
                  1100 ${y}, 1300 ${y-60}`}
          />
        ))}
      </g>
    </svg>
  );
};

export default WaveSVG;
