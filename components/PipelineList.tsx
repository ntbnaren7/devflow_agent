import React, { useState } from 'react';
import { Pipeline, EvaluationResult } from '../types';
import { Check, AlertTriangle, Layers, Server, Brain, ArrowLeft, FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface PipelineListProps {
  pipelines: Pipeline[];
  onEvaluate: () => void;
  evaluation: EvaluationResult | null;
  onProceed: () => void;
  onBack: () => void;
}

interface PipelineCardProps {
  pipeline: Pipeline;
  isSelected: boolean;
  isRejected: boolean | null;
  scores: any;
  summarizeMode: boolean;
  index: number;
}

const PipelineCard: React.FC<PipelineCardProps> = ({ pipeline, isSelected, isRejected, scores, summarizeMode, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic card styling based on state
  const cardBgClass = isSelected 
    ? 'bg-brand-50/50 dark:bg-brand-950/30' 
    : isRejected 
      ? 'bg-dark-surface grayscale-[0.3] opacity-70' 
      : 'bg-dark-surface';

  return (
    <div 
      className={`relative border rounded-2xl p-5 transition-all duration-500 overflow-hidden flex flex-col animate-scale-in
        ${isSelected 
          ? `${cardBgClass} border-brand-500 shadow-2xl shadow-brand-900/10 dark:shadow-brand-900/20 ring-1 ring-brand-500` 
          : 'border-dark-border hover:border-brand-500/50 hover:shadow-xl'
        }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
          RECOMMENDED
        </div>
      )}

      {/* Persistent Header: Visible always */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-4">
          <h3 className={`text-lg font-bold leading-tight ${isSelected ? 'text-brand-800 dark:text-white' : 'text-dark-text'}`}>
            {pipeline.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest
              ${pipeline.complexity === 'High' ? 'border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400' : 
                pipeline.complexity === 'Medium' ? 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                'border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400'}`}>
              {pipeline.complexity}
            </span>
          </div>
        </div>
        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-brand-500/20 text-brand-500' : 'bg-dark-bg text-dark-muted'}`}>
          {isSelected ? <Check className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
        </div>
      </div>

      {/* Summary Text: Visible always */}
      <div className="mb-4">
        <p className="text-sm text-dark-text/90 leading-relaxed font-medium">
          {pipeline.summary}
        </p>
      </div>

      {/* Expandable Section: Contains all detailed info */}
      <div 
        className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
          isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 border-t border-dark-border/50 mt-2 space-y-5">
          {/* Detailed Architecture */}
          {!summarizeMode && (
            <div>
              <h4 className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mb-2">Detailed Architecture</h4>
              <p className="text-xs text-dark-text/70 leading-relaxed whitespace-pre-line">
                {pipeline.architecture}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h4 className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {pipeline.tools.map((tool, i) => (
                <span key={i} className="text-[10px] bg-dark-bg border border-dark-border px-2 py-1 rounded-md text-dark-text/80 font-mono">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Scores Visualization */}
          {scores && (
            <div className="grid grid-cols-2 gap-3 bg-dark-bg/40 p-3 rounded-xl border border-dark-border/40">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter">
                        <span className="text-dark-muted">Speed</span>
                        <span className="text-blue-400 font-bold">{scores.speed}/10</span>
                    </div>
                    <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: isExpanded ? `${scores.speed * 10}%` : '0%' }}></div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter">
                        <span className="text-dark-muted">Stability</span>
                        <span className="text-green-400 font-bold">{scores.reliability}/10</span>
                    </div>
                    <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: isExpanded ? `${scores.reliability * 10}%` : '0%' }}></div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter">
                        <span className="text-dark-muted">Simplicity</span>
                        <span className="text-yellow-400 font-bold">{(10 - scores.cognitiveLoad)}/10</span>
                    </div>
                    <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: isExpanded ? `${(10 - scores.cognitiveLoad) * 10}%` : '0%' }}></div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter">
                        <span className="text-dark-muted">Scalability</span>
                        <span className="text-purple-400 font-bold">{scores.extensibility}/10</span>
                    </div>
                    <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: isExpanded ? `${scores.extensibility * 10}%` : '0%' }}></div>
                    </div>
                </div>
            </div>
          )}

          {/* Risks & Constraints */}
          <div>
            <h4 className="text-[10px] font-bold text-dark-muted uppercase tracking-wider mb-2">Risks & Constraints</h4>
            <div className="space-y-1.5">
               {pipeline.risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-amber-600/90 dark:text-amber-500/80 leading-snug">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{risk}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Trigger */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        className={`mt-4 w-full py-2 flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300
          ${isExpanded 
            ? 'bg-dark-bg text-dark-text border border-dark-border' 
            : 'bg-brand-500/10 text-brand-500 border border-brand-500/20 hover:bg-brand-500 hover:text-white hover:border-brand-500'}`}
      >
        <span>{isExpanded ? 'Collapse Blueprint' : 'View Full Pipeline'}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

const PipelineList: React.FC<PipelineListProps> = ({ pipelines, onEvaluate, evaluation, onProceed, onBack }) => {
  const isEvaluated = !!evaluation;
  const [summarizeMode, setSummarizeMode] = useState(false);

  // The "Why wins" section should only render if we have a valid selection that matches one of our current pipelines
  const selectedPipeline = pipelines.find(p => p.id === evaluation?.selectedPipelineId);

  return (
    <div className="space-y-6 animate-fade-in pb-24">
       <div className="flex flex-col md:flex-row items-center gap-4 mb-4 relative">
        <button 
            onClick={onBack}
            className="absolute left-0 top-1 p-2 hover:bg-dark-surface rounded-lg text-dark-muted hover:text-dark-text transition-all duration-200 hover:scale-105 active:scale-95"
            title="Go Back"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 text-center px-12 w-full">
            <h2 className="text-2xl font-bold text-dark-text mb-1 tracking-tight">
            {isEvaluated ? "Architectural Decision" : "System Proposals"}
            </h2>
            <p className="text-dark-muted max-w-2xl mx-auto text-xs md:text-sm font-medium">
            {isEvaluated 
                ? "Optimal path selected based on constraints and multi-modal evaluation." 
                : "Explore multiple viable architectures tailored to your specific project needs."}
            </p>
        </div>

        <button
            onClick={() => setSummarizeMode(!summarizeMode)}
            className={`absolute right-0 top-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95
            ${summarizeMode 
                ? 'bg-brand-500 text-white border-brand-600 shadow-md shadow-brand-500/20' 
                : 'bg-dark-surface text-dark-muted border-dark-border hover:border-brand-500/50 hover:text-brand-500'}`}
        >
            {summarizeMode ? <Sparkles className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            <span className="hidden sm:inline">{summarizeMode ? "Compact" : "Full View"}</span>
        </button>
      </div>

      {isEvaluated && evaluation && selectedPipeline && (
         <div className="bg-brand-900/10 dark:bg-brand-950/40 border border-brand-500/30 p-5 rounded-2xl mb-6 animate-slide-up shadow-inner">
            <div className="flex items-start gap-4">
                <div className="bg-brand-500 p-2.5 rounded-xl shrink-0 shadow-lg shadow-brand-500/20">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1.5 flex items-center gap-2">
                        Why <span className="underline decoration-brand-500/50 underline-offset-4">{selectedPipeline.name}</span> wins:
                    </h3>
                    <p className="text-dark-text text-sm leading-relaxed font-medium">
                        {summarizeMode ? evaluation.reasoningSummary : evaluation.reasoning}
                    </p>
                </div>
            </div>
         </div>
      )}

      {/* Grid of Pipelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pipelines.map((pipeline, index) => (
            <PipelineCard 
                key={pipeline.id}
                pipeline={pipeline}
                isSelected={evaluation?.selectedPipelineId === pipeline.id}
                isRejected={evaluation ? evaluation.selectedPipelineId !== pipeline.id : null}
                scores={evaluation?.scores?.[pipeline.id]}
                summarizeMode={summarizeMode}
                index={index}
            />
        ))}
      </div>

      <div className="flex justify-center pt-8">
        {!isEvaluated ? (
          <button
            onClick={onEvaluate}
            className="group relative px-10 py-4 bg-dark-text text-dark-bg font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Brain className="w-5 h-5 relative z-10" />
            <span className="relative z-10 uppercase tracking-widest text-xs">Run Tradeoff Evaluation</span>
          </button>
        ) : (
          <button
            onClick={onProceed}
            className="px-10 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-brand-500/40 hover:scale-105 active:scale-95 group"
          >
            <Server className="w-5 h-5 group-hover:animate-pulse" />
            <span className="uppercase tracking-widest text-xs">Architect Final Blueprint</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PipelineList;