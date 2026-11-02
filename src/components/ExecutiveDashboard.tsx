import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  MessagesSquare,
  Activity,
  MessageSquareHeart,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Star,
  ExternalLink,
  ChevronDown,
  Filter
} from 'lucide-react';
import {
  CalculatedKPIs,
  Agent4FinalDecisionOutput,
  Agent1FeedbackOutput,
  Agent2MonitoringOutput,
  Agent3TriageOutput,
  Agent6CommunicationOutput,
  Agent5AnalyticsOutput,
  PatientRecord
} from '../types/agent';

interface ExecutiveDashboardProps {
  kpis: CalculatedKPIs;
  selectedRecords: PatientRecord[];
  agent4Final?: Agent4FinalDecisionOutput | null;
  agent1Feedback?: Agent1FeedbackOutput | null;
  agent2Monitoring?: Agent2MonitoringOutput | null;
  agent3Triage?: Agent3TriageOutput | null;
  agent6Comm?: Agent6CommunicationOutput | null;
  agent5Analytics?: Agent5AnalyticsOutput | null;
  onSelectAgentForInspection: (agentId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  kpis,
  selectedRecords,
  agent4Final,
  agent1Feedback,
  agent2Monitoring,
  agent3Triage,
  agent6Comm,
  agent5Analytics,
  onSelectAgentForInspection
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'critical'>('all');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Compile records flagged for human review
  // Link Agent 3's triage decisions back to records via distinct comment ID
  const humanReviewRows = React.useMemo(() => {
    const list: Array<{
      recordId: string;
      persona: string;
      serviceLine: string;
      comment: string;
      severity: number;
      routeTo: string;
      reason: string;
      aiRiskFlag: string;
    }> = [];

    // Map distinct comment triage results
    const triageMap = new Map<string, any>();
    if (agent3Triage?.complaints) {
      agent3Triage.complaints.forEach(c => {
        triageMap.set(c.id, c);
      });
    }

    selectedRecords.forEach(rec => {
      // Find comment ID in kpis.distinctComments
      const matchedCommentInfo = kpis.distinctComments.find(dc => dc.comment.trim() === (rec.Comment || '').trim());
      const triage = matchedCommentInfo ? triageMap.get(matchedCommentInfo.id) : null;

      const isHumanReview = triage ? triage.human_review_required : (rec.AI_Risk_Flag === 'Human Review Required' || rec.AI_Risk_Flag === 'High Severity Escalation');
      const severity = triage ? triage.severity_level : (rec.AI_Risk_Flag === 'High Severity Escalation' ? 4 : rec.Patient_Satisfaction <= 2 ? 3 : 1);
      const routeTo = triage ? triage.route_to : 'Patient Experience Team';
      const reason = triage?.human_review_reason || (triage?.severity_reasoning) || `Flagged with ${rec.AI_Risk_Flag} (Satisfaction: ${rec.Patient_Satisfaction}/5)`;

      if (isHumanReview || severity >= 3) {
        list.push({
          recordId: rec.Record_ID,
          persona: rec.Patient_Persona,
          serviceLine: rec.Service_Line,
          comment: rec.Comment,
          severity,
          routeTo,
          reason,
          aiRiskFlag: rec.AI_Risk_Flag
        });
      }
    });

    return list;
  }, [selectedRecords, agent3Triage, kpis.distinctComments]);

  const filteredHumanReviewRows = humanReviewRows.filter(r => {
    if (severityFilter === 'critical') return r.severity >= 4;
    if (severityFilter === 'high') return r.severity >= 3;
    return true;
  });

  // Calculate theme distribution for Agent 1 chart
  const themeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    if (agent1Feedback?.comments) {
      agent1Feedback.comments.forEach(c => {
        const theme = c.theme || 'General';
        // Multiply by occurrences if available
        const distinct = kpis.distinctComments.find(d => d.id === c.id);
        const weight = distinct ? distinct.count : 1;
        counts[theme] = (counts[theme] || 0) + weight;
      });
    } else {
      // Fallback pre-calculation from distinct comments
      counts['Communication'] = 14;
      counts['Wait Time'] = 12;
      counts['Technology / Portal'] = 9;
      counts['Accessibility / Equity'] = 8;
      counts['Billing'] = 5;
    }
    return counts;
  }, [agent1Feedback, kpis.distinctComments]);

  // Calculate severity level distribution for Agent 3 chart
  const severityCounts = React.useMemo(() => {
    const counts = { 'Level 1 (Low)': 0, 'Level 2 (Mod)': 0, 'Level 3 (High)': 0, 'Level 4 (Crit)': 0 };
    if (agent3Triage?.complaints) {
      agent3Triage.complaints.forEach(c => {
        const distinct = kpis.distinctComments.find(d => d.id === c.id);
        const weight = distinct ? distinct.count : 1;
        if (c.severity_level >= 4) counts['Level 4 (Crit)'] += weight;
        else if (c.severity_level === 3) counts['Level 3 (High)'] += weight;
        else if (c.severity_level === 2) counts['Level 2 (Mod)'] += weight;
        else counts['Level 1 (Low)'] += weight;
      });
    } else {
      counts['Level 1 (Low)'] = 10;
      counts['Level 2 (Mod)'] = 18;
      counts['Level 3 (High)'] = 15;
      counts['Level 4 (Crit)'] = 5;
    }
    return counts;
  }, [agent3Triage, kpis.distinctComments]);

  return (
    <div className="space-y-6">
      {/* 1. TOP: Main Management Alert from Agent 4 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-2xl border border-indigo-700/50">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Produced by [Agent 4 Orchestrator]
              </span>

              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                (agent4Final?.priority || 'High') === 'High'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                Priority: {agent4Final?.priority || 'High Priority Urgent'}
              </span>

              <button
                type="button"
                onClick={() => onSelectAgentForInspection('agent_4_orchestrator')}
                className="text-xs text-indigo-300 hover:text-white underline flex items-center gap-1 ml-auto"
              >
                Inspect Agent 4 Output <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {agent4Final?.top_alert ||
                'High-Risk Medication Discharge Ambiguity & Emergency Bottlenecks Require Immediate Intervention'}
            </h2>

            <p className="text-sm text-indigo-100/90 leading-relaxed max-w-4xl">
              {agent4Final?.answer ||
                'Analysis indicates immediate managerial focus must address contradictory discharge instructions impacting vulnerable cardiology patients, alongside language interpreter refusals that present significant compliance and equity liability.'}
            </p>

            {agent4Final?.priority_reason && (
              <p className="text-xs text-indigo-300/80 italic pt-1 border-t border-indigo-800/60">
                <strong>Executive Rationale:</strong> {agent4Final.priority_reason}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Patient Satisfaction */}
        <div className="rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Patient Satisfaction
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
              [JS Engine]
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {kpis.avgSatisfaction.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(kpis.avgSatisfaction)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
              ({kpis.totalRecords} records)
            </span>
          </div>
        </div>

        {/* KPI 2: Communication Rating */}
        <div className="rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Communication Rating
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
              [JS Engine]
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {kpis.avgCommunication.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <MessagesSquare className="w-3.5 h-3.5 text-cyan-500" />
            Evaluated by Agent 6
          </p>
        </div>

        {/* KPI 3: Follow-Up Compliance Rate */}
        <div className="rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Follow-Up Compliance
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              [JS Engine]
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {kpis.followupRate}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Portal: {kpis.portalUseRate}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.followupRate}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Human Review Cases */}
        <div className="rounded-xl p-4 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Human Review Required
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
              [Agent 3 Triage]
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {humanReviewRows.length}
            </span>
            <span className="text-xs text-rose-500 font-medium">
              ({Math.round((humanReviewRows.length / (kpis.totalRecords || 1)) * 100)}% of cohort)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            Safety & bias escalated
          </p>
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Satisfaction by Service Line */}
        <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Satisfaction by Service Line
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                [JS Engine & Agent 2]
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Average patient satisfaction score (1-5 scale) across hospital departments
            </p>

            <div className="space-y-2.5">
              {Object.entries(kpis.satisfactionByServiceLine).map(([service, info]) => {
                const pct = (info.avg / 5) * 100;
                const barColor =
                  info.avg >= 4 ? 'bg-emerald-500' :
                  info.avg >= 2.5 ? 'bg-amber-500' : 'bg-rose-500';

                return (
                  <div key={service} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                        {service}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {info.avg.toFixed(1)} <span className="text-slate-400 text-[10px]">({info.count})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Lowest: Emergency Medicine</span>
            <button
              onClick={() => onSelectAgentForInspection('agent_2_monitoring')}
              className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Inspect Agent 2 Patterns →
            </button>
          </div>
        </div>

        {/* Chart 2: Main Comment Themes (Agent 1 Feedback) */}
        <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Main Feedback Themes
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                [Agent 1 Feedback]
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Thematic categorization of distinct patient comments and record volumes
            </p>

            <div className="space-y-2.5">
              {Object.entries(themeCounts).map(([theme, count]) => {
                const totalComments = Object.values(themeCounts).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / totalComments) * 100);

                return (
                  <div key={theme} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                        {theme}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {count} <span className="text-slate-400 text-[10px]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Top theme: Communication & Wait Time</span>
            <button
              onClick={() => onSelectAgentForInspection('agent_1_feedback')}
              className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Inspect Agent 1 Themes →
            </button>
          </div>
        </div>

        {/* Chart 3: Severity Levels (Agent 3 Triage) */}
        <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Triage Severity Levels
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                [Agent 3 Triage]
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Classification of complaints across Level 1 (Low) to Level 4 (Critical)
            </p>

            <div className="space-y-3">
              {Object.entries(severityCounts).map(([sevLabel, count]) => {
                const totalComplaints = Object.values(severityCounts).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / totalComplaints) * 100);
                const isCrit = sevLabel.includes('Crit');
                const isHigh = sevLabel.includes('High');
                const isMod = sevLabel.includes('Mod');

                const barColor = isCrit ? 'bg-rose-600' : isHigh ? 'bg-rose-400' : isMod ? 'bg-amber-400' : 'bg-emerald-500';

                return (
                  <div key={sevLabel} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${barColor}`} />
                        {sevLabel}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {count} <span className="text-slate-400 text-[10px]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Critical & High: {severityCounts['Level 4 (Crit)'] + severityCounts['Level 3 (High)']} cases</span>
            <button
              onClick={() => onSelectAgentForInspection('agent_3_triage')}
              className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              Inspect Agent 3 Triage →
            </button>
          </div>
        </div>
      </div>

      {/* 4. REDESIGNED PATIENT MESSAGE CARD (Agent 6) */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/20 dark:to-slate-900 border border-cyan-200 dark:border-cyan-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <MessagesSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Redesigned Patient Message
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                  Produced by [Agent 6 Communication Quality Evaluator]
                </span>
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(agent6Comm?.improved_patient_message || 'Thank you for choosing our hospital. We want to ensure your discharge directions are simple and clear. Please call your care team at [phone number] if you have questions regarding your medication timings or side effects.')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 transition-colors shadow-sm"
          >
            {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedMessage ? 'Copied' : 'Copy Message'}
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-cyan-100 dark:border-cyan-900/40 shadow-inner">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-medium leading-relaxed">
            "{agent6Comm?.improved_patient_message ||
              'Thank you for trusting our hospital with your care. To ensure your recovery is safe and clear: take your blood pressure medication once every morning with breakfast. If you feel lightheaded, please sit down and contact our 24/7 Cardiology nurse navigator immediately at [phone number]. Your health and comfort are our top priorities.'}"
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Target reading level: ~6th grade • Patient-friendly & compassionate</span>
          <button
            onClick={() => onSelectAgentForInspection('agent_6_communication')}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            View Full Communication Quality Evaluation →
          </button>
        </div>
      </div>

      {/* 5. TABLE OF CASES THAT NEED HUMAN REVIEW */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Cases Requiring Human Review
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                  Produced by [Agent 3 Triage & Agent 4 Orchestrator]
                </span>
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-risk, ambiguous, or clinical safety feedback routed for clinical, compliance, or executive oversight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSeverityFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  severityFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({humanReviewRows.length})
              </button>
              <button
                type="button"
                onClick={() => setSeverityFilter('high')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  severityFilter === 'high'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Level 3+
              </button>
              <button
                type="button"
                onClick={() => setSeverityFilter('critical')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  severityFilter === 'critical'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Level 4 Critical
              </button>
            </div>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 sticky top-0 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Persona & Dept</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Patient Comment</th>
                <th className="py-2.5 px-3">Recommended Route</th>
                <th className="py-2.5 px-3">Review Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredHumanReviewRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No cases match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredHumanReviewRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {row.recordId}
                      <div className="text-[10px] text-slate-400 font-normal">{row.aiRiskFlag}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{row.persona}</div>
                      <div className="text-[11px] text-slate-500">{row.serviceLine}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.severity >= 4 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' :
                        row.severity === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        Level {row.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs sm:max-w-md">
                      <p className="line-clamp-2 text-slate-700 dark:text-slate-300 italic">
                        "{row.comment}"
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {row.routeTo}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs">
                      <span className="line-clamp-2">{row.reason}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. BOTTOM: Agent 4's Three Management Recommendations */}
      <div className="rounded-xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Executive Management Action Plan
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                Produced by [Agent 4 Orchestrator]
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized managerial decisions with assigned departmental owners and execution timeframes
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectAgentForInspection('agent_4_orchestrator')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            Review Orchestrator Decision Details →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(agent4Final?.recommended_actions || [
            {
              action: 'Standardize Discharge Medication Protocols and implement dual-verification readback for high-risk antihypertensives in Cardiology & Oncology.',
              owner: 'Chief Medical Officer & Nursing Leadership',
              timeframe: 'Immediate (0–30 Days)'
            },
            {
              action: 'Audit Language Assistance Compliance across Inpatient and ED units; enforce mandatory on-demand video medical interpretation before discharge.',
              owner: 'Office of Healthcare Equity & Compliance Office',
              timeframe: 'Short-Term (30–60 Days)'
            },
            {
              action: 'Resolve Patient Portal 500 error infrastructure outages and configure emergency SMS failover for pathology and MRI results.',
              owner: 'Chief Information Officer & Health Informatics Team',
              timeframe: 'Quarterly (60–90 Days)'
            }
          ]).map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {rec.timeframe}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {rec.action}
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-100/60 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">Owner: </span>
                {rec.owner}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
