import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
        // Reset
        setError(null);
        containerRef.current.innerHTML = '';

        mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
        
        const renderChart = async () => {
            try {
                // Generate unique ID for this render to avoid conflicts
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (err) {
                console.error("Mermaid failed to render", err);
                setError("Unable to render visual workflow due to syntax error.");
            }
        };
        
        renderChart();
    }
  }, [chart]);

  if (error) {
      return (
          <div className="w-full p-4 border border-red-900/50 bg-red-900/10 rounded-xl text-center">
              <p className="text-red-400 text-sm">Visual workflow could not be generated.</p>
          </div>
      );
  }

  return (
    <div className="w-full overflow-hidden flex flex-col items-center">
        <div 
            ref={containerRef} 
            className="w-full flex justify-center p-6 bg-dark-bg/50 rounded-xl border border-dark-border overflow-x-auto min-h-[150px]" 
        />
        <p className="text-xs text-dark-muted mt-2">Visual Execution Flow</p>
    </div>
  );
};

export default MermaidDiagram;