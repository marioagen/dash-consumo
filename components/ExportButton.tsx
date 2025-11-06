
import React from 'react';

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-secondary text-brand-text-secondary border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Exportar dados para CSV"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Exportar CSV</span>
    </button>
  );
};

export default ExportButton;
