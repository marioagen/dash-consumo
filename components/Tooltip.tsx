import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  const arrowClasses = {
      top: 'left-1/2 -translate-x-1/2 top-full',
      bottom: 'left-1/2 -translate-x-1/2 bottom-full rotate-180',
      left: 'left-full top-1/2 -translate-y-1/2 -rotate-90',
      right: 'right-full top-1/2 -translate-y-1/2 rotate-90',
  }

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-20 w-max max-w-xs p-2 text-xs font-normal text-white bg-gray-800 rounded-md shadow-lg transition-opacity duration-300 ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 border-solid border-transparent border-t-gray-800 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
