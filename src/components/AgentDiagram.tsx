import React from 'react';
import {
  ShieldCheck,
  MessageSquareHeart,
  Activity,
  AlertTriangle,
  MessagesSquare,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { AgentStatus, AgentConfig } from '../types/agent';
import { AGENT_REGISTRY } from '../data/prompts';

interface AgentDiagramProps {
  currentStep: number; // 0: not started, 1: planning, 2: specialists, 3: analytics, 4: final decision, 5: all done
  activeAgentKey: string | null;
  agentStates: Record<string, {
    status: AgentStatus;
    task: string;
    inputData: any;
    outputData: any;
    error?: string;
    durationMs?: number;
    enabled: boolean;
  }>;
  onSelectAgent: (agentId: string) => void;
  onRetryAgent?: (agentId: string) => void;
  onToggleAgentEnabled?: (agentId: string) => void;
  isReviewStep?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  MessageSquareHeart,
  Activity,
  AlertTriangle,
  MessagesSquare,
  BrainCircuit
};

export const AgentDiagram: React.FC<AgentDiagramProps> = ({
  currentStep,
  activeAgentKey,
  agentStates,
  onSelectAgent,
  onRetryAgent,
  onToggleAgentEnabled,
  isReviewStep
}) => {
  const agent4 = AGENT_REGISTRY.find(a => a.id === 'agent_4_orchestrator')!;
  const agent1 = AGENT_REGISTRY.find(a => a.id === 'agent_1_feedback')!;
  const agent2 = AGENT_REGISTRY.find(a => a.id === 'agent_2_monitoring')!;
  const agent3 = AGENT_REGISTRY.find(a => a.id === 'agent_3_triage')!;
  const agent6 = AGENT_REGISTRY.find(a => a.id === 'agent_6_communication')!;
  const agent5 = AGENT_REGISTRY.find(a => a.id === 'agent_5_analytics')!;

  const specialists = [agent1, agent2, agent3, agent6];

  // Helper to get status pill styling
  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Running
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Review Needed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/20">
            Skipped
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Pending
          </span>
        );
    }
  };

  const isStep1Active = currentStep === 1;
  const isStep2Active = currentStep === 2;
  const isStep3Active = currentStep === 3;
  const isStep4Active = currentStep === 4;

  // Arrow animation state
  const isDownArrowsActive = isStep2Active || (currentStep === 1 && agentStates['agent_4_orchestrator']?.status === 'completed');
  const isConvergingArrowsActive = isStep3Active || (currentStep === 2 && specialists.some(s => agentStates[s.id]?.status === 'completed'));
  const isReturnArrowActive = isStep4Active || (currentStep === 3 && agentStates['agent_5_analytics']?.status === 'completed');

  return (
    <div className="relative w-full bg-slate-900/40 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of diagram */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Hospital Multi-Agent Neural Workflow
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive real-time execution map showing live agent state, data packet movement, and human review gates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Step 1: Orchestration Plan
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Step 2: Specialists Parallel
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Step 3: Synthesis
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Step 4: Executive Decision
          </span>
        </div>
      </div>

      {/* SVG Canvas for Dynamic Animated Arrows (Desktop/Tablet) */}
      <div className="hidden lg:block relative w-full h-[540px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="glowGradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="glowGradTealPurple" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="glowGradReturn" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Top to Specialists Arrows (Agent 4 at center-top -> 4 columns) */}
          {/* Top center is approx x: 50% (500), y: 110 */}
          {/* Target 1: x: 13%, y: 240 */}
          {/* Target 2: x: 38%, y: 240 */}
          {/* Target 3: x: 63%, y: 240 */}
          {/* Target 4: x: 87%, y: 240 */}

          {/* Path 1: Agent 4 -> Agent 1 */}
          <path
            d="M 480 110 C 450 160, 180 160, 150 215"
            fill="none"
            stroke={isDownArrowsActive ? 'url(#glowGradIndigo)' : '#475569'}
            strokeWidth={isDownArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isDownArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isDownArrowsActive ? 1 : 0.35}
            filter={isDownArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isDownArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Path 2: Agent 4 -> Agent 2 */}
          <path
            d="M 490 110 C 470 160, 390 165, 380 215"
            fill="none"
            stroke={isDownArrowsActive ? 'url(#glowGradIndigo)' : '#475569'}
            strokeWidth={isDownArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isDownArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isDownArrowsActive ? 1 : 0.35}
            filter={isDownArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isDownArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Path 3: Agent 4 -> Agent 3 */}
          <path
            d="M 510 110 C 530 160, 610 165, 620 215"
            fill="none"
            stroke={isDownArrowsActive ? 'url(#glowGradIndigo)' : '#475569'}
            strokeWidth={isDownArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isDownArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isDownArrowsActive ? 1 : 0.35}
            filter={isDownArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isDownArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Path 4: Agent 4 -> Agent 6 */}
          <path
            d="M 520 110 C 550 160, 820 160, 850 215"
            fill="none"
            stroke={isDownArrowsActive ? 'url(#glowGradIndigo)' : '#475569'}
            strokeWidth={isDownArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isDownArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isDownArrowsActive ? 1 : 0.35}
            filter={isDownArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isDownArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Specialists to Agent 5 Converging Arrows */}
          {/* Agent 1 -> Agent 5 */}
          <path
            d="M 150 335 C 180 390, 440 395, 480 435"
            fill="none"
            stroke={isConvergingArrowsActive ? 'url(#glowGradTealPurple)' : '#475569'}
            strokeWidth={isConvergingArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isConvergingArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isConvergingArrowsActive ? 1 : 0.35}
            filter={isConvergingArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isConvergingArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Agent 2 -> Agent 5 */}
          <path
            d="M 380 335 C 390 385, 470 390, 490 435"
            fill="none"
            stroke={isConvergingArrowsActive ? 'url(#glowGradTealPurple)' : '#475569'}
            strokeWidth={isConvergingArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isConvergingArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isConvergingArrowsActive ? 1 : 0.35}
            filter={isConvergingArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isConvergingArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Agent 3 -> Agent 5 */}
          <path
            d="M 620 335 C 610 385, 530 390, 510 435"
            fill="none"
            stroke={isConvergingArrowsActive ? 'url(#glowGradTealPurple)' : '#475569'}
            strokeWidth={isConvergingArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isConvergingArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isConvergingArrowsActive ? 1 : 0.35}
            filter={isConvergingArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isConvergingArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Agent 6 -> Agent 5 */}
          <path
            d="M 850 335 C 820 390, 560 395, 520 435"
            fill="none"
            stroke={isConvergingArrowsActive ? 'url(#glowGradTealPurple)' : '#475569'}
            strokeWidth={isConvergingArrowsActive ? '3.5' : '1.5'}
            strokeDasharray={isConvergingArrowsActive ? '8 6' : '4 4'}
            strokeOpacity={isConvergingArrowsActive ? 1 : 0.35}
            filter={isConvergingArrowsActive ? 'url(#glowFilter)' : undefined}
            className={isConvergingArrowsActive ? 'animate-flow-dash' : ''}
          />

          {/* Agent 5 looping back to Agent 4 (Final Decision) */}
          <path
            d="M 680 475 C 970 475, 980 70, 680 70"
            fill="none"
            stroke={isReturnArrowActive ? 'url(#glowGradReturn)' : '#475569'}
            strokeWidth={isReturnArrowActive ? '3.5' : '1.5'}
            strokeDasharray={isReturnArrowActive ? '8 6' : '4 4'}
            strokeOpacity={isReturnArrowActive ? 1 : 0.35}
            filter={isReturnArrowActive ? 'url(#glowFilter)' : undefined}
            className={isReturnArrowActive ? 'animate-flow-dash' : ''}
          />
        </svg>

        {/* TOP: Agent 4 (Job 1 Planning & Job 2 Final Decision) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[380px] z-10">
          <AgentNodeCard
            config={agent4}
            state={agentStates[agent4.id]}
            isActive={activeAgentKey === agent4.id || isStep1Active || isStep4Active}
            onSelect={() => onSelectAgent(agent4.id)}
            onRetry={() => onRetryAgent?.(agent4.id)}
            orderLabel="1 & 4"
            stepContext={currentStep >= 4 ? 'Final Decision' : 'Workload Planning'}
          />
        </div>

        {/* MIDDLE: Specialists row (Agents 1, 2, 3, 6) */}
        <div className="absolute top-[205px] inset-x-0 grid grid-cols-4 gap-3 sm:gap-4 px-2 z-10">
          {specialists.map(specialist => (
            <div key={specialist.id} className="w-full">
              <AgentNodeCard
                config={specialist}
                state={agentStates[specialist.id]}
                isActive={activeAgentKey === specialist.id}
                onSelect={() => onSelectAgent(specialist.id)}
                onRetry={() => onRetryAgent?.(specialist.id)}
                onToggleEnabled={() => onToggleAgentEnabled?.(specialist.id)}
                canToggle={isReviewStep && currentStep === 1}
                orderLabel="2"
                stepContext="Specialist"
              />
            </div>
          ))}
        </div>

        {/* BOTTOM: Agent 5 (Healthcare Analytics Agent) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[380px] z-10">
          <AgentNodeCard
            config={agent5}
            state={agentStates[agent5.id]}
            isActive={activeAgentKey === agent5.id || isStep3Active}
            onSelect={() => onSelectAgent(agent5.id)}
            onRetry={() => onRetryAgent?.(agent5.id)}
            orderLabel="3"
            stepContext="Cross-Specialist Synthesis"
          />
        </div>
      </div>

      {/* MOBILE / TABLET Responsive Flow View */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Step 1 & 4: Agent 4 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1 text-xs font-semibold text-indigo-500 uppercase tracking-wider">
            <span>Stage 1 & 4: Orchestrator</span>
            <span>Runs First & Last</span>
          </div>
          <AgentNodeCard
            config={agent4}
            state={agentStates[agent4.id]}
            isActive={activeAgentKey === agent4.id}
            onSelect={() => onSelectAgent(agent4.id)}
            onRetry={() => onRetryAgent?.(agent4.id)}
            orderLabel="1 & 4"
            stepContext={currentStep >= 4 ? 'Final Decision' : 'Planning'}
          />
        </div>

        {/* Down indicator */}
        <div className="flex items-center justify-center my-1">
          <div className={`p-1.5 rounded-full ${isDownArrowsActive ? 'bg-indigo-500 text-white animate-bounce' : 'bg-slate-800 text-slate-500'}`}>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Step 2: Specialists */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-500 uppercase tracking-wider">
            <span>Stage 2: Specialist Agents (Parallel)</span>
            <span>Independent Analyses</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialists.map(specialist => (
              <AgentNodeCard
                key={specialist.id}
                config={specialist}
                state={agentStates[specialist.id]}
                isActive={activeAgentKey === specialist.id}
                onSelect={() => onSelectAgent(specialist.id)}
                onRetry={() => onRetryAgent?.(specialist.id)}
                onToggleEnabled={() => onToggleAgentEnabled?.(specialist.id)}
                canToggle={isReviewStep && currentStep === 1}
                orderLabel="2"
                stepContext="Specialist"
              />
            ))}
          </div>
        </div>

        {/* Down indicator */}
        <div className="flex items-center justify-center my-1">
          <div className={`p-1.5 rounded-full ${isConvergingArrowsActive ? 'bg-purple-500 text-white animate-bounce' : 'bg-slate-800 text-slate-500'}`}>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Step 3: Agent 5 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1 text-xs font-semibold text-purple-500 uppercase tracking-wider">
            <span>Stage 3: Executive Analytics Synthesis</span>
            <span>Synthesizes all findings</span>
          </div>
          <AgentNodeCard
            config={agent5}
            state={agentStates[agent5.id]}
            isActive={activeAgentKey === agent5.id}
            onSelect={() => onSelectAgent(agent5.id)}
            onRetry={() => onRetryAgent?.(agent5.id)}
            orderLabel="3"
            stepContext="Cross-Specialist Synthesis"
          />
        </div>
      </div>
    </div>
  );
};

interface AgentNodeCardProps {
  config: AgentConfig;
  state?: {
    status: AgentStatus;
    task: string;
    inputData: any;
    outputData: any;
    error?: string;
    durationMs?: number;
    enabled: boolean;
  };
  isActive: boolean;
  onSelect: () => void;
  onRetry?: () => void;
  onToggleEnabled?: () => void;
  canToggle?: boolean;
  orderLabel: string;
  stepContext: string;
}

const AgentNodeCard: React.FC<AgentNodeCardProps> = ({
  config,
  state,
  isActive,
  onSelect,
  onRetry,
  onToggleEnabled,
  canToggle,
  orderLabel,
  stepContext
}) => {
  const IconComponent = ICON_MAP[config.icon] || ShieldCheck;
  const status = state?.status || 'pending';
  const isRunning = status === 'running';
  const isFailed = status === 'failed';
  const isCompleted = status === 'completed';
  const isSkipped = status === 'skipped' || state?.enabled === false;

  // Vivid custom border and glow
  const borderClass = isRunning
    ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/25 animate-pulse'
    : isFailed
    ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20'
    : isCompleted
    ? 'border-emerald-500/80 shadow-md shadow-emerald-500/10'
    : isSkipped
    ? 'border-slate-300 dark:border-slate-800 opacity-60'
    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 border ${borderClass} transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 select-none backdrop-blur-sm`}
    >
      {/* Top Header: Order badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold text-white shadow-sm"
            style={{ backgroundColor: config.color.accent }}
            title={`Execution Order: ${orderLabel}`}
          >
            {orderLabel}
          </span>
          <span className="text-[11px] font-medium tracking-wide uppercase text-slate-600 dark:text-slate-300">
            Agent {config.agentNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {canToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnabled?.();
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                state?.enabled !== false
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
              }`}
              title="Click to toggle specialist inclusion in this run"
            >
              {state?.enabled !== false ? 'ENABLED' : 'SKIPPED'}
            </button>
          )}

          {/* Status badge */}
          {status === 'running' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Running
            </span>
          ) : status === 'review' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Clock className="w-2.5 h-2.5" />
              Review
            </span>
          ) : status === 'completed' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Done
            </span>
          ) : status === 'failed' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-2.5 h-2.5" />
              Failed
            </span>
          ) : status === 'skipped' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-500">
              Skipped
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-2.5">
        <div
          className="p-2 rounded-lg shrink-0 mt-0.5 transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${config.color.accent}20`, color: config.color.accent }}
        >
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {config.name}
          </h4>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
            {config.roleTitle}
          </p>
        </div>
      </div>

      {/* Task preview snippet */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
        <span className="truncate max-w-[190px]">
          {state?.task ? state.task : config.shortDesc}
        </span>
        <span className="shrink-0 flex items-center gap-1 text-slate-500 group-hover:text-teal-500 transition-colors">
          <Eye className="w-3 h-3" />
          <span className="text-[10px]">Inspect</span>
        </span>
      </div>

      {/* Quick Retry button on failure */}
      {isFailed && onRetry && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="mt-2 w-full py-1 px-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow"
        >
          <RotateCcw className="w-3 h-3" />
          Retry Agent {config.agentNumber}
        </button>
      )}
    </div>
  );
};
