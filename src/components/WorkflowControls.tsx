import React from 'react';
import {
  Play,
  FastForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ShieldCheck,
  BrainCircuit,
  MessagesSquare,
  ArrowRight,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AgentStatus } from '../types/agent';
import { AGENT_REGISTRY } from '../data/prompts';

interface WorkflowControlsProps {
  managerQuestion: string;
  onChangeManagerQuestion: (q: string) => void;
  onResetManagerQuestion: () => void;
  runMode: 'auto' | 'step';
  onChangeRunMode: (mode: 'auto' | 'step') => void;
  currentStep: number; // 0: not started, 1: planning, 2: specialists, 3: analytics, 4: final decision, 5: completed
  isRunning: boolean;
  isWaitingReview: boolean;
  onStartWorkflow: () => void;
  onApproveAndContinue: () => void;
  onResetWorkflow: () => void;
  agentStates: Record<string, {
    status: AgentStatus;
    task: string;
    inputData: any;
    outputData: any;
    error?: string;
    durationMs?: number;
    enabled: boolean;
  }>;
  onToggleSpecialist: (agentId: string) => void;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  managerQuestion,
  onChangeManagerQuestion,
  onResetManagerQuestion,
  runMode,
  onChangeRunMode,
  currentStep,
  isRunning,
  isWaitingReview,
  onStartWorkflow,
  onApproveAndContinue,
  onResetWorkflow,
  agentStates,
  onToggleSpecialist
}) => {
  const stepTitles = [
    'Ready to Start',
    'Step 1: Orchestrator Workload Planning',
    'Step 2: Specialists Parallel Execution',
    'Step 3: Healthcare Analytics Synthesis',
    'Step 4: Orchestrator Final Management Decision',
    'Analysis Complete'
  ];

  const specialists = AGENT_REGISTRY.filter(a => [1, 2, 3, 6].includes(a.agentNumber));

  return (
    <div className="space-y-4">
      {/* Manager Question Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-500" />
            Hospital Manager's Guiding Question:
          </label>
          <button
            type="button"
            onClick={onResetManagerQuestion}
            className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline self-start sm:self-auto"
          >
            Reset to default question
          </button>
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            value={managerQuestion}
            onChange={(e) => onChangeManagerQuestion(e.target.value)}
            disabled={isRunning}
            placeholder="What should management fix first to improve patient experience, and which cases need human review?"
            className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-60 transition-all resize-none"
          />
        </div>
      </div>

      {/* Control Bar: Mode Toggle + Action Buttons */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Run Mode Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Run Mode:</span>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeRunMode('auto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                runMode === 'auto'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              Auto Run
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeRunMode('step')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                runMode === 'step'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Step-by-Step Review
            </button>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-600 dark:text-slate-300">
            {runMode === 'auto'
              ? 'Executes all 4 stages continuously without pausing'
              : 'Pauses after each step for human review & workload customization'}
          </span>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={onResetWorkflow}
              disabled={isRunning}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Workflow
            </button>
          )}

          {currentStep === 0 || currentStep === 5 ? (
            <button
              type="button"
              onClick={onStartWorkflow}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              {currentStep === 5 ? 'Re-Run Multi-Agent Analysis' : 'Start Multi-Agent Analysis'}
            </button>
          ) : isWaitingReview ? (
            <button
              type="button"
              onClick={onApproveAndContinue}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve & Continue to Step {currentStep + 1}
            </button>
          ) : isRunning ? (
            <div className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Executing Step {currentStep}...
            </div>
          ) : null}
        </div>
      </div>

      {/* Step Review Bar with Specialist On/Off Toggles (after Step 1) */}
      {isWaitingReview && currentStep === 1 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              Step 1 Review Checkpoint: Orchestration Plan Ready
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Agent 4 has assigned tasks. You can toggle specialists on/off or click an agent box to inspect/edit its task before proceeding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {specialists.map(sp => {
              const enabled = agentStates[sp.id]?.enabled !== false;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onToggleSpecialist(sp.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    enabled
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.color.accent }} />
                  Agent {sp.agentNumber}: {enabled ? 'ON' : 'OFF'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Review Bar (after Step 2 or Step 3) */}
      {isWaitingReview && (currentStep === 2 || currentStep === 3) && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <Clock className="w-3.5 h-3.5" />
              Step {currentStep} Review Checkpoint
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Results generated. Click any agent to inspect its finding. If any result looks wrong, click its "Re-run Agent" button before continuing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
