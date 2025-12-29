import React, { useState } from 'react';
import { ProjectIntake } from '../types';
import { ArrowRight } from 'lucide-react';

interface IntakeFormProps {
  onSubmit: (intake: ProjectIntake) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ProjectIntake>({
    problem: '',
    user: '',
    output: '',
    constraints: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.problem.length > 5 && formData.user.length > 2;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">What are we building?</h1>
        <p className="text-dark-muted">Define your project clearly to avoid rework later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-300 uppercase tracking-wider">The Problem</label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            placeholder="e.g. Students struggle to find study groups on campus based on their specific courses."
            className="w-full h-32 bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-dark-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-300 uppercase tracking-wider">Target User</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="e.g. Undergrad CS students"
              className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-dark-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-300 uppercase tracking-wider">Output Format</label>
            <input
              type="text"
              name="output"
              value={formData.output}
              onChange={handleChange}
              placeholder="e.g. Mobile-first Web App"
              className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-dark-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-300 uppercase tracking-wider">Constraints</label>
          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            placeholder="e.g. Must use free tier services, 48 hour deadline, I know React but not Python."
            className="w-full h-24 bg-dark-surface border border-dark-border rounded-xl p-4 text-white placeholder-dark-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all transform
            ${isValid 
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-900/50 hover:scale-[1.02]' 
              : 'bg-dark-surface border border-dark-border text-dark-muted cursor-not-allowed opacity-50'
            }`}
        >
          <span>Analyze & Generate Pipelines</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default IntakeForm;
