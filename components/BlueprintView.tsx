import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Blueprint } from '../types';
import { MessageSquare, Download, Copy, Workflow, ArrowLeft, FileText, Sparkles } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';

interface BlueprintViewProps {
  blueprint: Blueprint;
  onContinue: () => void;
  onBack: () => void;
}

const BlueprintView: React.FC<BlueprintViewProps> = ({ blueprint, onContinue, onBack }) => {
  const [summarizeMode, setSummarizeMode] = useState(false);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-dark-surface rounded-lg text-dark-muted hover:text-dark-text transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Go Back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Execution Blueprint</h2>
                    <p className="text-dark-muted text-sm">Follow this plan to build your project efficiently.</p>
                </div>
            </div>
            <div className="flex gap-2 self-end md:self-auto">
                 <button
                    onClick={() => setSummarizeMode(!summarizeMode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 mr-2
                    ${summarizeMode 
                        ? 'bg-brand-500 text-white border-brand-600 shadow-md shadow-brand-500/20' 
                        : 'bg-dark-surface text-dark-muted border-dark-border hover:border-brand-500/50 hover:text-brand-500'}`}
                 >
                    {summarizeMode ? <Sparkles className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span>{summarizeMode ? "Summarized" : "Summarize"}</span>
                 </button>

                 <button className="p-2 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-border text-dark-muted hover:text-dark-text transition-all duration-200 hover:scale-105 active:scale-95" title="Copy">
                    <Copy className="w-4 h-4" />
                 </button>
                 <button className="p-2 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-border text-dark-muted hover:text-dark-text transition-all duration-200 hover:scale-105 active:scale-95" title="Download">
                    <Download className="w-4 h-4" />
                 </button>
            </div>
       </div>

      {/* Mermaid Diagram always visible */}
      <div className="mb-8 animate-scale-in">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-1 overflow-hidden shadow-lg">
            <div className="px-4 py-2 bg-dark-bg/50 border-b border-dark-border flex items-center gap-2">
                <Workflow className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-medium text-dark-muted uppercase tracking-wider">Workflow Visualization</span>
            </div>
            <div className="p-4">
                <MermaidDiagram chart={blueprint.flowchart} />
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`bg-dark-surface border border-dark-border rounded-2xl p-8 mb-8 prose prose-invert max-w-none break-words animate-slide-up
        ${summarizeMode ? 'border-brand-500/50 shadow-lg shadow-brand-500/5' : ''}`}>
        
        {summarizeMode ? (
            <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-brand-500 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Executive Summary
                </h3>
                <p className="text-dark-text/90 leading-relaxed text-lg">{blueprint.summary}</p>
            </div>
        ) : (
            <ReactMarkdown
                className="animate-fade-in"
                components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-brand-600 dark:text-brand-400 border-b border-dark-border pb-2 mb-4 mt-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-dark-text mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-brand-700 dark:text-brand-200 mt-4 mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 text-dark-text/80" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-dark-text font-bold" {...props} />,
                    code: ({node, ...props}) => <code className="bg-black/10 dark:bg-black/30 text-brand-700 dark:text-brand-300 px-1 py-0.5 rounded text-sm font-mono break-all border border-black/5 dark:border-white/10" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-black/90 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm border border-dark-border my-4" {...props} />,
                }}
            >
            {blueprint.markdown}
            </ReactMarkdown>
        )}
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <span>Start Implementation Assistant</span>
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BlueprintView;