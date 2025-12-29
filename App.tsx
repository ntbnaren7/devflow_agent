import React, { useState } from 'react';
import Layout from './components/Layout';
import IntakeForm from './components/IntakeForm';
import PipelineList from './components/PipelineList';
import BlueprintView from './components/BlueprintView';
import ChatInterface from './components/ChatInterface';
import LoadingOverlay from './components/LoadingOverlay';
import { AppState, WorkflowStep, ProjectIntake, Pipeline, ChatMessage } from './types';
import * as GeminiService from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: WorkflowStep.INTAKE,
    intake: { problem: '', user: '', output: '', constraints: '' },
    pipelines: [],
    evaluation: null,
    blueprint: null,
    chatHistory: [],
    isLoading: false,
    error: null,
  });

  const [loadingMessage, setLoadingMessage] = useState('');

  const handleIntakeSubmit = async (intake: ProjectIntake) => {
    // Reset pipelines, evaluation, and blueprint when starting fresh
    setState(prev => ({ 
        ...prev, 
        intake, 
        isLoading: true,
        pipelines: [],
        evaluation: null,
        blueprint: null
    }));
    setLoadingMessage('Analyzing problem space & generating viable architectures...');
    
    try {
      const pipelines = await GeminiService.generatePipelines(intake);
      setState(prev => ({
        ...prev,
        pipelines,
        step: WorkflowStep.ENUMERATION,
        isLoading: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to generate pipelines.' }));
    }
  };

  const handleRunEvaluation = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    setLoadingMessage('Simulating architectures. Comparing tradeoffs. Selecting optimal path...');

    try {
      const evaluation = await GeminiService.evaluatePipelines(state.pipelines, state.intake);
      setState(prev => ({
        ...prev,
        evaluation,
        isLoading: false,
      }));
    } catch (error) {
       console.error(error);
       setState(prev => ({ ...prev, isLoading: false, error: 'Failed to evaluate pipelines.' }));
    }
  };

  const handleGenerateBlueprint = async () => {
    const selectedPipeline = state.pipelines.find(p => p.id === state.evaluation?.selectedPipelineId);
    if (!selectedPipeline) return;

    setState(prev => ({ ...prev, isLoading: true, step: WorkflowStep.BLUEPRINT })); 
    setLoadingMessage('Architecting system components. Defining API spec. Writing execution plan...');

    try {
      const blueprintData = await GeminiService.generateBlueprint(selectedPipeline, state.intake);
      setState(prev => ({
        ...prev,
        blueprint: blueprintData,
        step: WorkflowStep.BLUEPRINT,
        isLoading: false
      }));
    } catch (error) {
       console.error(error);
       setState(prev => ({ ...prev, isLoading: false, error: 'Failed to generate blueprint.' }));
    }
  };

  const handleContinueToImplementation = () => {
    setState(prev => ({ ...prev, step: WorkflowStep.IMPLEMENTATION }));
  };

  const handleSendMessage = async (history: ChatMessage[], message: string, context: string) => {
      return await GeminiService.sendChatMessage(history, message, context);
  };

  const handleBack = () => {
    setState(prev => {
        let prevStep = prev.step;
        if (prev.step === WorkflowStep.ENUMERATION || prev.step === WorkflowStep.EVALUATION) {
            prevStep = WorkflowStep.INTAKE;
        } else if (prev.step === WorkflowStep.BLUEPRINT) {
            // Go back to pipeline list with evaluation state preserved
            prevStep = WorkflowStep.EVALUATION;
        } else if (prev.step === WorkflowStep.IMPLEMENTATION) {
            prevStep = WorkflowStep.BLUEPRINT;
        }
        return { ...prev, step: prevStep };
    });
  };

  const handleHome = () => {
      // Return to intake, preserving intake form data if they want to edit, 
      // but clearing downstream progress to avoid inconsistencies if they change the intake.
      setState(prev => ({
          ...prev,
          step: WorkflowStep.INTAKE
      }));
  };

  return (
    <Layout currentStep={state.step} onHome={handleHome}>
      {state.isLoading && <LoadingOverlay message={loadingMessage} />}
      
      {state.step === WorkflowStep.INTAKE && (
        <IntakeForm onSubmit={handleIntakeSubmit} />
      )}

      {(state.step === WorkflowStep.ENUMERATION || state.step === WorkflowStep.EVALUATION) && (
        <PipelineList 
          pipelines={state.pipelines} 
          onEvaluate={handleRunEvaluation}
          evaluation={state.evaluation}
          onProceed={handleGenerateBlueprint}
          onBack={handleBack}
        />
      )}

      {state.step === WorkflowStep.BLUEPRINT && state.blueprint && (
        <BlueprintView 
            blueprint={state.blueprint} 
            onContinue={handleContinueToImplementation}
            onBack={handleBack}
        />
      )}

      {state.step === WorkflowStep.IMPLEMENTATION && state.evaluation && state.blueprint && (
        <ChatInterface 
            initialContext={{
                intake: state.intake,
                pipeline: state.pipelines.find(p => p.id === state.evaluation!.selectedPipelineId)!,
                blueprint: state.blueprint
            }}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
        />
      )}

      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 text-white px-6 py-4 rounded-xl border border-red-500 shadow-2xl flex items-center gap-3 animate-slide-up z-50">
            <span>⚠️ {state.error}</span>
            <button onClick={() => setState(s => ({...s, error: null}))} className="text-sm underline opacity-80 hover:opacity-100">Dismiss</button>
        </div>
      )}
    </Layout>
  );
};

export default App;