/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  ShieldCheck,
  Moon,
  Sun,
  LayoutDashboard,
  Cpu,
  Database,
  FileCode,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Layers,
  HeartPulse
} from 'lucide-react';
import {
  PatientRecord,
  CalculatedKPIs,
  AgentStatus,
  Agent4PlanOutput,
  Agent1FeedbackOutput,
  Agent2MonitoringOutput,
  Agent3TriageOutput,
  Agent6CommunicationOutput,
  Agent5AnalyticsOutput,
  Agent4FinalDecisionOutput
} from './types/agent';
import { INITIAL_PATIENT_RECORDS, calculateKPIs } from './data/sampleDataset';
import { AGENT_REGISTRY, AGENT_PROMPTS } from './data/prompts';
import { AgentService } from './services/agentService';
import { AgentDiagram } from './components/AgentDiagram';
import { AgentDetailModal } from './components/AgentDetailModal';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DatasetViewer } from './components/DatasetViewer';
import { WorkflowControls } from './components/WorkflowControls';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hospital_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hospital_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hospital_theme', 'light');
    }
  }, [isDark]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'diagram' | 'data' | 'prompts'>('dashboard');

  // Dataset & Selection state
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_PATIENT_RECORDS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    return new Set(INITIAL_PATIENT_RECORDS.map(r => r.Record_ID));
  });

  // Manager's question
  const defaultQuestion = 'What should management fix first to improve patient experience, and which cases need human review?';
  const [managerQuestion, setManagerQuestion] = useState<string>(defaultQuestion);

  // Run mode: Auto Run vs Step-by-Step Review
  const [runMode, setRunMode] = useState<'auto' | 'step'>('auto');

  // Workflow execution state
  // currentStep: 0: idle, 1: Step 1 (Planning), 2: Step 2 (Specialists), 3: Step 3 (Analytics), 4: Step 4 (Final Decision), 5: All Done
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWaitingReview, setIsWaitingReview] = useState<boolean>(false);
  const [activeAgentKey, setActiveAgentKey] = useState<string | null>(null);
  const [inspectedAgentId, setInspectedAgentId] = useState<string | null>(null);

  // Per-agent execution tracking
  const [agentStates, setAgentStates] = useState<Record<string, {
    status: AgentStatus;
    task: string;
    inputData: any;
    outputData: any;
    error?: string;
    durationMs?: number;
    enabled: boolean;
  }>>(() => {
    const initial: Record<string, any> = {};
    AGENT_REGISTRY.forEach(ag => {
      initial[ag.id] = {
        status: 'pending',
        task: ag.shortDesc,
        inputData: null,
        outputData: null,
        enabled: true
      };
    });
    return initial;
  });

  // Calculate KPIs purely in JavaScript
  const selectedRecords = useMemo(() => {
    return records.filter(r => selectedIds.has(r.Record_ID));
  }, [records, selectedIds]);

  const kpis: CalculatedKPIs = useMemo(() => {
    return calculateKPIs(selectedRecords);
  }, [selectedRecords]);

  // Available column names for Agent 4 planning
  const availableColumns = useMemo(() => {
    if (records.length === 0) return [];
    return Object.keys(records[0]);
  }, [records]);

  // Selection handlers
  const handleToggleRecord = useCallback((recordId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(records.map(r => r.Record_ID)));
  }, [records]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleUploadRecords = useCallback((newRecords: PatientRecord[]) => {
    setRecords(newRecords);
    setSelectedIds(new Set(newRecords.map(r => r.Record_ID)));
    // Reset workflow upon data change
    handleResetWorkflow();
  }, []);

  const handleResetToDefault = useCallback(() => {
    setRecords(INITIAL_PATIENT_RECORDS);
    setSelectedIds(new Set(INITIAL_PATIENT_RECORDS.map(r => r.Record_ID)));
    handleResetWorkflow();
  }, []);

  // Workflow reset
  const handleResetWorkflow = useCallback(() => {
    setCurrentStep(0);
    setIsRunning(false);
    setIsWaitingReview(false);
    setActiveAgentKey(null);
    setAgentStates(() => {
      const reset: Record<string, any> = {};
      AGENT_REGISTRY.forEach(ag => {
        reset[ag.id] = {
          status: 'pending',
          task: ag.shortDesc,
          inputData: null,
          outputData: null,
          enabled: true
        };
      });
      return reset;
    });
  }, []);

  // Toggle specialist enablement in review
  const handleToggleSpecialist = useCallback((agentId: string) => {
    setAgentStates(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        enabled: !prev[agentId].enabled,
        status: !prev[agentId].enabled ? 'pending' : 'skipped'
      }
    }));
  }, []);

  // Update task assigned to an agent
  const handleUpdateTask = useCallback((agentId: string, newTask: string) => {
    setAgentStates(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        task: newTask
      }
    }));
  }, []);

  // STEP 1: Run Agent 4 Planning
  const executeStep1 = async (): Promise<boolean> => {
    setCurrentStep(1);
    setIsRunning(true);
    setIsWaitingReview(false);
    setActiveAgentKey('agent_4_orchestrator');

    setAgentStates(prev => ({
      ...prev,
      agent_4_orchestrator: { ...prev.agent_4_orchestrator, status: 'running', error: undefined }
    }));

    const startTime = Date.now();
    try {
      const plan: Agent4PlanOutput = await AgentService.runAgent4Planning(
        managerQuestion,
        kpis,
        availableColumns
      );

      const durationMs = Date.now() - startTime;

      // Update state for Agent 4 and update tasks assigned to specialists
      setAgentStates(prev => {
        const next = { ...prev };
        next['agent_4_orchestrator'] = {
          ...next['agent_4_orchestrator'],
          status: 'completed',
          outputData: plan,
          durationMs
        };

        // If plan specified agent tasks, assign them
        if (plan.agents && Array.isArray(plan.agents)) {
          plan.agents.forEach(assigned => {
            const agName = assigned.agent.toLowerCase();
            let targetId = '';
            if (agName.includes('1') || agName.includes('feedback')) targetId = 'agent_1_feedback';
            else if (agName.includes('2') || agName.includes('monitoring')) targetId = 'agent_2_monitoring';
            else if (agName.includes('3') || agName.includes('triage')) targetId = 'agent_3_triage';
            else if (agName.includes('6') || agName.includes('communication')) targetId = 'agent_6_communication';

            if (targetId && next[targetId]) {
              next[targetId] = {
                ...next[targetId],
                task: assigned.task || next[targetId].task,
                enabled: assigned.run !== false,
                status: assigned.run === false ? 'skipped' : next[targetId].status
              };
            }
          });
        }
        return next;
      });

      setActiveAgentKey(null);
      setIsRunning(false);

      if (runMode === 'step') {
        setIsWaitingReview(true);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Step 1 execution failed:', err);
      setAgentStates(prev => ({
        ...prev,
        agent_4_orchestrator: {
          ...prev.agent_4_orchestrator,
          status: 'failed',
          error: err.message || 'Planning call failed'
        }
      }));
      setIsRunning(false);
      return false;
    }
  };

  // STEP 2: Run Specialists (Agents 1, 2, 3, 6) in parallel
  const executeStep2 = async (): Promise<boolean> => {
    setCurrentStep(2);
    setIsRunning(true);
    setIsWaitingReview(false);

    const specialistsToRun = [
      { id: 'agent_1_feedback', runFn: () => AgentService.runAgent1Feedback(kpis) },
      { id: 'agent_2_monitoring', runFn: () => AgentService.runAgent2Monitoring(kpis) },
      { id: 'agent_3_triage', runFn: () => AgentService.runAgent3Triage(kpis) },
      { id: 'agent_6_communication', runFn: () => AgentService.runAgent6Communication(kpis) }
    ].filter(item => agentStates[item.id]?.enabled !== false && agentStates[item.id]?.status !== 'completed');

    // Mark running agents
    setAgentStates(prev => {
      const next = { ...prev };
      specialistsToRun.forEach(sp => {
        next[sp.id] = { ...next[sp.id], status: 'running', error: undefined };
      });
      return next;
    });

    const promises = specialistsToRun.map(async (sp) => {
      const t0 = Date.now();
      try {
        const result = await sp.runFn();
        const durationMs = Date.now() - t0;
        setAgentStates(prev => ({
          ...prev,
          [sp.id]: {
            ...prev[sp.id],
            status: 'completed',
            outputData: result,
            durationMs
          }
        }));
        return { id: sp.id, success: true };
      } catch (err: any) {
        console.error(`Specialist ${sp.id} failed:`, err);
        setAgentStates(prev => ({
          ...prev,
          [sp.id]: {
            ...prev[sp.id],
            status: 'failed',
            error: err.message || 'Specialist call failed'
          }
        }));
        return { id: sp.id, success: false };
      }
    });

    await Promise.all(promises);

    setIsRunning(false);
    setActiveAgentKey(null);

    if (runMode === 'step') {
      setIsWaitingReview(true);
      return false;
    }
    return true;
  };

  // STEP 3: Run Agent 5 Analytics Synthesis
  const executeStep3 = async (): Promise<boolean> => {
    setCurrentStep(3);
    setIsRunning(true);
    setIsWaitingReview(false);
    setActiveAgentKey('agent_5_analytics');

    setAgentStates(prev => ({
      ...prev,
      agent_5_analytics: { ...prev.agent_5_analytics, status: 'running', error: undefined }
    }));

    const startTime = Date.now();
    try {
      const specialistResults = {
        agent1: agentStates['agent_1_feedback']?.outputData as Agent1FeedbackOutput || null,
        agent2: agentStates['agent_2_monitoring']?.outputData as Agent2MonitoringOutput || null,
        agent3: agentStates['agent_3_triage']?.outputData as Agent3TriageOutput || null,
        agent6: agentStates['agent_6_communication']?.outputData as Agent6CommunicationOutput || null
      };

      const analyticsOutput: Agent5AnalyticsOutput = await AgentService.runAgent5Analytics(
        kpis,
        specialistResults
      );

      const durationMs = Date.now() - startTime;
      setAgentStates(prev => ({
        ...prev,
        agent_5_analytics: {
          ...prev.agent_5_analytics,
          status: 'completed',
          outputData: analyticsOutput,
          durationMs
        }
      }));

      setIsRunning(false);
      setActiveAgentKey(null);

      if (runMode === 'step') {
        setIsWaitingReview(true);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Step 3 execution failed:', err);
      setAgentStates(prev => ({
        ...prev,
        agent_5_analytics: {
          ...prev.agent_5_analytics,
          status: 'failed',
          error: err.message || 'Analytics synthesis failed'
        }
      }));
      setIsRunning(false);
      return false;
    }
  };

  // STEP 4: Run Agent 4 Final Decision
  const executeStep4 = async (): Promise<boolean> => {
    setCurrentStep(4);
    setIsRunning(true);
    setIsWaitingReview(false);
    setActiveAgentKey('agent_4_orchestrator');

    setAgentStates(prev => ({
      ...prev,
      agent_4_orchestrator: { ...prev.agent_4_orchestrator, status: 'running', error: undefined }
    }));

    const startTime = Date.now();
    try {
      const plan = agentStates['agent_4_orchestrator']?.outputData as Agent4PlanOutput || { goal: managerQuestion, agents: [] };
      const analytics = agentStates['agent_5_analytics']?.outputData as Agent5AnalyticsOutput || { headline: '', satisfaction_insights: [], top_themes: [], hidden_problems: [], ai_risk_monitoring: { hallucination_trap: [], bias_related: [], human_review: [] }, top_priorities: [], quick_wins: [], long_term_ai_opportunities: [], additional_information_needed: '' };

      // Flagged human review cases from Agent 3
      const triage = agentStates['agent_3_triage']?.outputData as Agent3TriageOutput;
      const humanReviewCases = triage?.complaints?.filter(c => c.human_review_required || c.severity_level >= 3) || [];

      const finalDecision: Agent4FinalDecisionOutput = await AgentService.runAgent4FinalDecision(
        managerQuestion,
        plan,
        analytics,
        kpis,
        humanReviewCases
      );

      const durationMs = Date.now() - startTime;
      setAgentStates(prev => ({
        ...prev,
        agent_4_orchestrator: {
          ...prev.agent_4_orchestrator,
          status: 'completed',
          outputData: finalDecision,
          durationMs
        }
      }));

      setCurrentStep(5); // All complete
      setIsRunning(false);
      setActiveAgentKey(null);
      setIsWaitingReview(false);
      return true;
    } catch (err: any) {
      console.error('Step 4 execution failed:', err);
      setAgentStates(prev => ({
        ...prev,
        agent_4_orchestrator: {
          ...prev.agent_4_orchestrator,
          status: 'failed',
          error: err.message || 'Final decision call failed'
        }
      }));
      setIsRunning(false);
      return false;
    }
  };

  // Workflow starter
  const handleStartWorkflow = async () => {
    handleResetWorkflow();
    const s1Ok = await executeStep1();
    if (runMode === 'auto' && s1Ok) {
      const s2Ok = await executeStep2();
      if (s2Ok) {
        const s3Ok = await executeStep3();
        if (s3Ok) {
          await executeStep4();
        }
      }
    }
  };

  // Approve & Continue (Step-by-Step mode)
  const handleApproveAndContinue = async () => {
    if (currentStep === 1) {
      const s2Ok = await executeStep2();
      if (runMode === 'auto' && s2Ok) {
        const s3Ok = await executeStep3();
        if (s3Ok) await executeStep4();
      }
    } else if (currentStep === 2) {
      const s3Ok = await executeStep3();
      if (runMode === 'auto' && s3Ok) {
        await executeStep4();
      }
    } else if (currentStep === 3) {
      await executeStep4();
    }
  };

  // Re-run single agent
  const handleRerunSingleAgent = async (agentId: string) => {
    setActiveAgentKey(agentId);
    setAgentStates(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], status: 'running', error: undefined }
    }));

    const t0 = Date.now();
    try {
      let res: any;
      if (agentId === 'agent_4_orchestrator') {
        if (currentStep <= 1) {
          res = await AgentService.runAgent4Planning(managerQuestion, kpis, availableColumns);
        } else {
          const plan = agentStates['agent_4_orchestrator']?.outputData || { goal: managerQuestion, agents: [] };
          const analytics = agentStates['agent_5_analytics']?.outputData || { headline: '' };
          res = await AgentService.runAgent4FinalDecision(managerQuestion, plan, analytics, kpis, []);
        }
      } else if (agentId === 'agent_1_feedback') {
        res = await AgentService.runAgent1Feedback(kpis);
      } else if (agentId === 'agent_2_monitoring') {
        res = await AgentService.runAgent2Monitoring(kpis);
      } else if (agentId === 'agent_3_triage') {
        res = await AgentService.runAgent3Triage(kpis);
      } else if (agentId === 'agent_6_communication') {
        res = await AgentService.runAgent6Communication(kpis);
      } else if (agentId === 'agent_5_analytics') {
        const specialistResults = {
          agent1: agentStates['agent_1_feedback']?.outputData || null,
          agent2: agentStates['agent_2_monitoring']?.outputData || null,
          agent3: agentStates['agent_3_triage']?.outputData || null,
          agent6: agentStates['agent_6_communication']?.outputData || null
        };
        res = await AgentService.runAgent5Analytics(kpis, specialistResults);
      }

      const durationMs = Date.now() - t0;
      setAgentStates(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'completed',
          outputData: res,
          durationMs
        }
      }));
    } catch (err: any) {
      console.error(`Re-running agent ${agentId} failed:`, err);
      setAgentStates(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'failed',
          error: err.message || 'Agent re-run failed'
        }
      }));
    } finally {
      setActiveAgentKey(null);
    }
  };

  // Find inspected agent config
  const inspectedAgentConfig = useMemo(() => {
    if (!inspectedAgentId) return null;
    return AGENT_REGISTRY.find(a => a.id === inspectedAgentId) || null;
  }, [inspectedAgentId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Hospital Patient Experience Intelligence
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                  6-Agent System
                </span>
              </h1>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 hidden md:block">
                Coordinated AI Specialist Team for Clinical Quality & Operational Decisions
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3.8 Flash Ready
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Primary Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-4 py-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Executive Dashboard
            </button>

            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Interactive Agent Flow
              {currentStep > 0 && currentStep < 5 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'data'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Cohort Dataset ({selectedRecords.length})
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'prompts'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Agent Prompts & Architecture
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span>Stage:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {currentStep === 0
                ? 'Ready'
                : currentStep === 1
                ? 'Step 1: Planning'
                : currentStep === 2
                ? 'Step 2: Specialists'
                : currentStep === 3
                ? 'Step 3: Analytics'
                : currentStep === 4
                ? 'Step 4: Decision'
                : 'Complete'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Workflow Controls (Manager Question, Mode, Start / Continue) */}
        <WorkflowControls
          managerQuestion={managerQuestion}
          onChangeManagerQuestion={setManagerQuestion}
          onResetManagerQuestion={() => setManagerQuestion(defaultQuestion)}
          runMode={runMode}
          onChangeRunMode={setRunMode}
          currentStep={currentStep}
          isRunning={isRunning}
          isWaitingReview={isWaitingReview}
          onStartWorkflow={handleStartWorkflow}
          onApproveAndContinue={handleApproveAndContinue}
          onResetWorkflow={handleResetWorkflow}
          agentStates={agentStates}
          onToggleSpecialist={handleToggleSpecialist}
        />

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick mini-diagram preview if user is on dashboard */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Multi-Agent Neural Flow
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Agent 4 (Orchestrator) → Specialists (1, 2, 3, 6) → Agent 5 (Analytics) → Agent 4 (Decision)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('diagram')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors self-start sm:self-auto"
              >
                Open Full Interactive Flow Canvas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ExecutiveDashboard
              kpis={kpis}
              selectedRecords={selectedRecords}
              agent4Final={agentStates['agent_4_orchestrator']?.outputData as Agent4FinalDecisionOutput}
              agent1Feedback={agentStates['agent_1_feedback']?.outputData as Agent1FeedbackOutput}
              agent2Monitoring={agentStates['agent_2_monitoring']?.outputData as Agent2MonitoringOutput}
              agent3Triage={agentStates['agent_3_triage']?.outputData as Agent3TriageOutput}
              agent6Comm={agentStates['agent_6_communication']?.outputData as Agent6CommunicationOutput}
              agent5Analytics={agentStates['agent_5_analytics']?.outputData as Agent5AnalyticsOutput}
              onSelectAgentForInspection={(id) => setInspectedAgentId(id)}
            />
          </div>
        )}

        {/* Tab 2: Interactive Agent Flow Canvas */}
        {activeTab === 'diagram' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AgentDiagram
              currentStep={currentStep}
              activeAgentKey={activeAgentKey}
              agentStates={agentStates}
              onSelectAgent={(id) => setInspectedAgentId(id)}
              onRetryAgent={handleRerunSingleAgent}
              onToggleAgentEnabled={handleToggleSpecialist}
              isReviewStep={isWaitingReview}
            />

            {/* Quick summary below diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Parallel Execution Rule</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Agents 1, 2, 3, and 6 run simultaneously upon Step 2 dispatch, analyzing disjoint projections of the patient cohort.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Deduplication Economy</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Repeated comments are sent once with occurrence counts, dramatically reducing token usage and hallucination risks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Strict Safety Bounds</span>
                <p className="text-slate-500 dark:text-slate-400">
                  All mathematical metrics are computed in pure JavaScript; agents interpret trends without inventing clinical facts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dataset Viewer */}
        {activeTab === 'data' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DatasetViewer
              records={records}
              selectedIds={selectedIds}
              onToggleRecord={handleToggleRecord}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onUploadRecords={handleUploadRecords}
              onResetToDefault={handleResetToDefault}
              kpis={kpis}
            />
          </div>
        )}

        {/* Tab 4: Agent Prompts & Architecture Reference */}
        {activeTab === 'prompts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                System Prompt Specifications & Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Direct integration of the revised original agent prompts from class-exercise specifications.
              </p>

              <div className="space-y-6">
                {AGENT_REGISTRY.map(ag => {
                  let promptKey = 'AGENT_4_PLANNING';
                  if (ag.id === 'agent_1_feedback') promptKey = 'AGENT_1_FEEDBACK';
                  else if (ag.id === 'agent_2_monitoring') promptKey = 'AGENT_2_MONITORING';
                  else if (ag.id === 'agent_3_triage') promptKey = 'AGENT_3_TRIAGE';
                  else if (ag.id === 'agent_6_communication') promptKey = 'AGENT_6_COMMUNICATION';
                  else if (ag.id === 'agent_5_analytics') promptKey = 'AGENT_5_ANALYTICS';

                  const promptContent = AGENT_PROMPTS[promptKey as keyof typeof AGENT_PROMPTS];

                  return (
                    <div key={ag.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: ag.color.accent }}>
                            {ag.agentNumber}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{ag.name}</span>
                          <span className="text-xs text-slate-500 font-medium">({ag.roleTitle})</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          Order #{ag.order}
                        </span>
                      </div>
                      <pre className="text-xs font-mono p-3 rounded-lg bg-slate-900 text-slate-200 overflow-x-auto max-h-60 leading-relaxed">
                        {promptContent}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Hospital Patient Experience Intelligence System • Coordinated 6-Agent AI Architecture • Built for Healthcare Leadership Decision Support
      </footer>

      {/* Agent Detail / Inspection Modal */}
      {inspectedAgentConfig && (
        <AgentDetailModal
          agentConfig={inspectedAgentConfig}
          state={agentStates[inspectedAgentConfig.id]}
          onClose={() => setInspectedAgentId(null)}
          onUpdateTask={(newTask) => handleUpdateTask(inspectedAgentConfig.id, newTask)}
          onRerunAgent={() => handleRerunSingleAgent(inspectedAgentConfig.id)}
          canEditTask={isWaitingReview && currentStep === 1}
          canRerun={Boolean(agentStates[inspectedAgentConfig.id]?.outputData || agentStates[inspectedAgentConfig.id]?.status === 'failed')}
        />
      )}
    </div>
  );
}
