import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-dark-surface border border-dark-border p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-md text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-500 blur-xl opacity-20 rounded-full"></div>
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin relative z-10" />
        </div>
        <h3 className="text-xl font-bold text-white mt-6 mb-2">DevFlow is Thinking</h3>
        <p className="text-dark-muted animate-pulse">{message}</p>
        
        <div className="mt-6 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }}/>
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }}/>
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }}/>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
