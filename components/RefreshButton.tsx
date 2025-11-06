import React from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-accent text-white shadow-sm hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-wait"
      aria-label="Atualizar dados"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      <span>Atualizar</span>
    </button>
  );
};

export default RefreshButton;