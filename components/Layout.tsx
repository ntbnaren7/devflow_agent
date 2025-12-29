import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, GitBranch, CheckCircle2, FileCode, MessageSquare, Sun, Moon, Home } from 'lucide-react';
import { WorkflowStep } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: WorkflowStep;
  onHome: () => void;
}

const steps = [
  { id: WorkflowStep.INTAKE, label: 'Intake', icon: Terminal },
  { id: WorkflowStep.ENUMERATION, label: 'Pipelines', icon: GitBranch },
  { id: WorkflowStep.EVALUATION, label: 'Evaluation', icon: Cpu },
  { id: WorkflowStep.BLUEPRINT, label: 'Blueprint', icon: FileCode },
  { id: WorkflowStep.IMPLEMENTATION, label: 'Implement', icon: MessageSquare },
];

const Layout: React.FC<LayoutProps> = ({ children, currentStep, onHome }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference or local storage on mount
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onHome}
            className="flex items-center space-x-2 group focus:outline-none"
            aria-label="Go to Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-dark-text group-hover:text-brand-500 transition-colors">DevFlow</span>
          </button>
          
          <div className="flex items-center gap-2">
             <div className="text-sm text-dark-muted hidden md:block border-r border-dark-border pr-4 mr-2">
                Agentic Pipeline Architect
             </div>
             
             <button
                onClick={onHome}
                className="p-2 rounded-lg bg-dark-bg border border-dark-border text-dark-muted hover:text-brand-500 hover:border-brand-500/50 hover:bg-dark-surface transition-all duration-200 active:scale-95"
                title="Go Home (Intake)"
             >
                <Home className="w-5 h-5" />
             </button>

             <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-dark-bg border border-dark-border text-dark-muted hover:text-brand-500 hover:border-brand-500/50 hover:bg-dark-surface transition-all duration-200 active:scale-95"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-dark-border bg-dark-bg/95 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-dark-border -z-10 transform -translate-y-1/2" />
            
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex flex-col items-center bg-dark-bg px-2 z-10 transition-colors duration-300">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                    ${isActive ? 'border-brand-500 bg-brand-900/20 text-brand-500 scale-110' : 
                      isPast ? 'border-brand-600 bg-brand-600 text-white' : 
                      'border-dark-border bg-dark-surface text-dark-muted'}`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5 animate-scale-in" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-dark-muted'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border py-6 mt-auto bg-dark-surface/30">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-dark-muted">
          <p>Powered by Google Gemini 2.5 Flash & 3 Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;