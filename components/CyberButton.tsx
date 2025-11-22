import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "relative px-6 py-3 font-bold font-mono transition-all duration-200 uppercase tracking-widest clip-path-polygon";
  
  const variants = {
    primary: "bg-green-600 text-black hover:bg-green-500 hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] border-2 border-green-400",
    secondary: "bg-transparent text-fuchsia-400 border-2 border-fuchsia-500 hover:bg-fuchsia-900/20 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]",
    danger: "bg-red-900/50 text-red-400 border-2 border-red-500 hover:bg-red-800/50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          CALCULATING KARMA...
        </span>
      ) : children}
    </button>
  );
};