import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isActive?: boolean;
  clickHandler?: (e: React.MouseEvent<SVGSVGElement>) => void;
  size: 'big' | 'small';
  content?: string;
  positionRight?: boolean;
}

const InformationCircle = ({ isActive, clickHandler, size, content, positionRight }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const sizeClass = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();

      if (positionRight) {
        setTooltipPosition({
          top: rect.top + rect.height / 2, // 垂直置中
          left: rect.right + 8,           // 調整為 8px 右邊距離，避免過遠
        });
      } else {
        setTooltipPosition({
          top: rect.bottom + 4,
          left: rect.left + rect.width / 2,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`relative ${sizeClass} ${
        isActive ? 'text-[#4F4F4F]' : 'text-[#BDBDBD] hover:text-[#F2F2F2]'
      } z-[9999999999]`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 24 24"
        strokeWidth="0"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        onClick={clickHandler}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
      </svg>

      {/* Tooltip 使用 Portal */}
      {isHovered &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              backgroundColor: "#333",
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: positionRight ? 'translateY(-50%)' : 'translateX(-50%)',  // 根據位置調整 transform
              pointerEvents: 'none',
            }}
            className="p-2 w-[240px] bg-[#333] text-white text-sm rounded-md shadow-lg z-[9999999]"
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export default InformationCircle;
