export enum WorkflowStep {
  INTAKE = 'INTAKE',
  ENUMERATION = 'ENUMERATION',
  EVALUATION = 'EVALUATION',
  BLUEPRINT = 'BLUEPRINT',
  IMPLEMENTATION = 'IMPLEMENTATION',
}

export interface ProjectIntake {
  problem: string;
  user: string;
  output: string;
  constraints: string;
}

export interface Pipeline {
  id: string;
  name: string;
  architecture: string;
  summary: string;
  tools: string[];
  complexity: 'Low' | 'Medium' | 'High';
  risks: string[];
  scalability: string;
  pros: string[];
  cons: string[];
}

export interface EvaluationResult {
  selectedPipelineId: string;
  reasoning: string;
  reasoningSummary: string;
  scores: Record<string, { speed: number; reliability: number; cognitiveLoad: number; extensibility: number }>;
}

export interface Blueprint {
  markdown: string;
  summary: string;
  flowchart: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AppState {
  step: WorkflowStep;
  intake: ProjectIntake;
  pipelines: Pipeline[];
  evaluation: EvaluationResult | null;
  blueprint: Blueprint | null;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}