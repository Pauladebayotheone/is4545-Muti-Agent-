import React, { useState } from 'react';
import {
  X,
  Code2,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Copy,
  Check,
  Edit3,
  ShieldAlert,
  Send,
  Zap,
  Tag,
  Sliders
} from 'lucide-react';
import { AgentConfig, AgentStatus } from '../types/agent';

interface AgentDetailModalProps {
  agentConfig: AgentConfig | null;
  state?: {
    status: AgentStatus;
    task: string;
    inputData: any;
    outputData: any;
    error?: string;
    durationMs?: number;
    enabled: boolean;
  };
  onClose: () => void;
  onUpdateTask?: (newTask: string) => void;
  onRerunAgent?: () => void;
  canEditTask?: boolean;
  canRerun?: boolean;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agentConfig,
  state,
  onClose,
  onUpdateTask,
  onRerunAgent,
  canEditTask,
  canRerun
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'json' | 'input'>('formatted');
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState(state?.task || '');
  const [copied, setCopied] = useState(false);

  if (!agentConfig) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTask = () => {
    onUpdateTask?.(taskDraft);
    setIsEditingTask(false);
  };

  const hasOutput = Boolean(state?.outputData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl text-sm font-black text-white shadow-md"
              style={{ backgroundColor: agentConfig.color.accent }}
            >
              {agentConfig.agentNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {agentConfig.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${agentConfig.color.accent}20`, color: agentConfig.color.accent }}>
                  {agentConfig.roleTitle}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Order #{agentConfig.order} • {agentConfig.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canRerun && (
              <button
                type="button"
                onClick={onRerunAgent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-sm transition-all"
                title="Re-run this specific agent call"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-run Agent
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Bar */}
        <div className="p-3 sm:px-5 bg-teal-50/50 dark:bg-teal-950/20 border-b border-teal-100 dark:border-teal-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Assigned Task
              </span>
              {canEditTask && !isEditingTask && (
                <button
                  type="button"
                  onClick={() => setIsEditingTask(true)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Task
                </button>
              )}
            </div>

            {isEditingTask ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskDraft}
                  onChange={(e) => setTaskDraft(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleSaveTask}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-teal-600 text-white hover:bg-teal-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTask(false)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic">
                "{state?.task || agentConfig.shortDesc}"
              </p>
            )}
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('formatted')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'formatted'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Easy-to-Read Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'json'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw JSON Result
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'input'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Data Received
            </button>
          </div>

          {hasOutput && (
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(state?.outputData, null, 2))}
              className="mb-2 text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied JSON' : 'Copy JSON'}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-[300px] max-h-[60vh]">
          {state?.status === 'running' && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Agent is running analysis with Gemini...
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Analyzing healthcare experience data and generating structured JSON response.
              </p>
            </div>
          )}

          {state?.status === 'failed' && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                Execution Encountered An Issue
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-300 font-mono mb-3">
                {state.error || 'Unknown error occurred while calling the agent model.'}
              </p>
              {canRerun && (
                <button
                  type="button"
                  onClick={onRerunAgent}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry This Agent
                </button>
              )}
            </div>
          )}

          {state?.status === 'skipped' && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
              <span className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-2">
                <Clock className="w-6 h-6" />
              </span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Agent was skipped in current orchestration plan
              </p>
              <p className="text-xs max-w-md mt-1 text-slate-600 dark:text-slate-300">
                The Orchestrator or user configuration determined this specialist agent was not required for the current manager question.
              </p>
            </div>
          )}

          {/* Tab 1: Formatted View */}
          {activeTab === 'formatted' && hasOutput && (
            <FormattedAgentOutput agentId={agentConfig.id} data={state?.outputData} />
          )}

          {/* Tab 2: Raw JSON View */}
          {activeTab === 'json' && hasOutput && (
            <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              {JSON.stringify(state?.outputData, null, 2)}
            </pre>
          )}

          {/* Tab 3: Data Received View */}
          {activeTab === 'input' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Specification: </span>
                {agentConfig.inputDescription}
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(state?.inputData || { notice: 'Input data packet will be loaded upon execution step.' }, null, 2)}
              </pre>
            </div>
          )}

          {!hasOutput && state?.status !== 'running' && state?.status !== 'failed' && state?.status !== 'skipped' && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
              <Clock className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Awaiting Execution
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                This agent will run according to its workflow sequence when triggered.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component to format each agent's structured JSON output into clean, beautiful cards
function FormattedAgentOutput({ agentId, data }: { agentId: string; data: any }) {
  if (!data) return null;

  // Agent 4 Plan
  if (data.agents && data.goal) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1">
            Orchestration Goal Restatement
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{data.goal}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Assigned Specialist Workloads
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.agents.map((ag: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{ag.agent}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ag.run ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {ag.run ? 'ACTIVE' : 'SKIPPED'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{ag.task || ag.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Agent 1: Feedback Insights
  if (data.comments && Array.isArray(data.comments)) {
    return (
      <div className="space-y-4">
        {data.summary && (
          <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-xs text-slate-800 dark:text-slate-200">
            <span className="font-bold text-teal-700 dark:text-teal-300">Thematic Summary: </span>
            {data.summary}
          </div>
        )}

        <div className="space-y-3">
          {data.comments.map((c: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-sm space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">{c.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Theme: {c.theme}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    c.sentiment === 'Negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {c.sentiment}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong className="text-slate-800 dark:text-slate-200">Reasoning:</strong> {c.reasoning}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Operational Issue:</strong> {c.operational_issue}</p>
                {c.risk_or_bias_concern && (
                  <p className="text-amber-600 dark:text-amber-400">
                    <strong>Risk / Bias Concern:</strong> {c.risk_or_bias_concern}
                  </p>
                )}
                <p className="text-teal-700 dark:text-teal-300">
                  <strong>Recommended Action:</strong> {c.recommended_action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Agent 2: Monitoring Patterns & Equity
  if (data.patterns || data.equity_concerns) {
    return (
      <div className="space-y-4">
        {data.recommendation && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300">Monitoring Recommendation: </span>
            <span className="text-slate-700 dark:text-slate-200">{data.recommendation}</span>
          </div>
        )}

        {/* Risk Grid */}
        {data.risk && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(data.risk).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">{key.replace('_', ' ')}</div>
                <div className={`font-bold mt-0.5 ${val === 'High' ? 'text-rose-500' : val === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {String(val)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patterns */}
        {data.patterns && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Identified Statistical Patterns</h4>
            <div className="space-y-2">
              {data.patterns.map((p: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{p.pattern}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{p.evidence}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equity Concerns */}
        {data.equity_concerns && data.equity_concerns.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">Healthcare Equity Concerns</h4>
            <div className="space-y-2">
              {data.equity_concerns.map((eq: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 text-xs">
                  <span className="font-bold text-rose-700 dark:text-rose-300">Group: {eq.group} — </span>
                  <span className="text-slate-700 dark:text-slate-300">{eq.concern}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">{eq.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Agent 3: Triage Complaints
  if (data.complaints && Array.isArray(data.complaints)) {
    return (
      <div className="space-y-3">
        {data.summary && (
          <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-slate-800 dark:text-slate-200">
            <span className="font-bold text-rose-700 dark:text-rose-300">Triage Summary: </span>
            {data.summary}
          </div>
        )}

        {data.complaints.map((c: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{c.id}</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.severity_level >= 3 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' :
                  c.severity_level === 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                }`}>
                  Severity Level {c.severity_level}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  Route: {c.route_to}
                </span>
                {c.human_review_required && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                    Human Review Required
                  </span>
                )}
              </div>
            </div>

            <p><strong className="text-slate-800 dark:text-slate-200">Category:</strong> {c.primary_category}</p>
            <p><strong className="text-slate-800 dark:text-slate-200">Reasoning:</strong> {c.severity_reasoning}</p>
            {c.human_review_required && (
              <p className="text-rose-600 dark:text-rose-400">
                <strong>Review Rationale:</strong> {c.human_review_reason}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Agent 6: Communication Evaluator
  if (data.evaluations || data.improved_patient_message) {
    return (
      <div className="space-y-4">
        {data.improved_patient_message && (
          <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50 space-y-1">
            <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Agent 6's Redesigned Patient Message (≤80 words, 6th-grade level)
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 italic font-medium p-2.5 rounded bg-white/70 dark:bg-slate-900/70 border border-cyan-200/50">
              "{data.improved_patient_message}"
            </p>
          </div>
        )}

        {data.executive_summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <span className="font-bold text-slate-700 dark:text-slate-300">Overall Quality: </span>
              <span className="text-slate-600 dark:text-slate-400">{data.executive_summary.overall_quality}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <span className="font-bold text-rose-600 dark:text-rose-400">Highest Risk: </span>
              <span className="text-slate-600 dark:text-slate-400">{data.executive_summary.highest_risk}</span>
            </div>
          </div>
        )}

        {data.evaluations && (
          <div className="space-y-3">
            {data.evaluations.map((ev: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{ev.id}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Purpose: {ev.purpose}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">Risk: {ev.risk}</span>
                </div>
                {ev.scores && (
                  <div className="grid grid-cols-5 gap-1 text-[11px] text-center bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded">
                    <div>Clarity: <strong>{ev.scores.clarity}</strong></div>
                    <div>Complete: <strong>{ev.scores.completeness}</strong></div>
                    <div>Empathy: <strong>{ev.scores.empathy}</strong></div>
                    <div>Centered: <strong>{ev.scores.patient_centeredness}</strong></div>
                    <div>Actionable: <strong>{ev.scores.actionability}</strong></div>
                  </div>
                )}
                <p><strong className="text-slate-800 dark:text-slate-200">Risk Reason:</strong> {ev.risk_reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Agent 5: Analytics
  if (data.headline && data.top_priorities) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
          <div className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1">
            Executive Synthesis Headline
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{data.headline}</p>
        </div>

        {data.top_priorities && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">Top 5 Priorities</h4>
            <ul className="space-y-1 text-xs list-disc list-inside text-slate-700 dark:text-slate-300">
              {data.top_priorities.map((tp: string, idx: number) => (
                <li key={idx}>{tp}</li>
              ))}
            </ul>
          </div>
        )}

        {data.quick_wins && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Quick Wins (Within 3 Months)</h4>
            <ul className="space-y-1 text-xs list-disc list-inside text-slate-700 dark:text-slate-300">
              {data.quick_wins.map((qw: string, idx: number) => (
                <li key={idx}>{qw}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Agent 4: Final Decision
  if (data.top_alert || data.recommended_actions) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Final Decision Alert
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              data.priority === 'High' ? 'bg-rose-500 text-white' :
              data.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {data.priority} Priority
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{data.top_alert}</p>
          <p className="text-xs text-slate-700 dark:text-slate-300">{data.answer}</p>
        </div>

        {data.recommended_actions && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Recommended Managerial Actions</h4>
            <div className="space-y-2">
              {data.recommended_actions.map((act: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 dark:text-slate-100">{act.action}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Owner: {act.owner}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {act.timeframe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
