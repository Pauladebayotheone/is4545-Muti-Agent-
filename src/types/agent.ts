export interface PatientRecord {
  Record_ID: string;
  Patient_Persona: string;
  Age_Group: string;
  Visit_Type: string;
  Service_Line: string;
  Year: number | string;
  Patient_Satisfaction: number;
  Communication_Rating: number;
  Followup_Compliance: number;
  Portal_Usage: number;
  Readmission_Risk: 'Low' | 'Moderate' | 'High' | string;
  AI_Risk_Flag: string;
  Comment: string;
  [key: string]: any;
}

export interface DistinctCommentInfo {
  id: string;
  comment: string;
  count: number;
  avgCommunication: number;
  aiRiskFlagCounts: Record<string, number>;
  recordIds: string[];
}

export interface CalculatedKPIs {
  totalRecords: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followupRate: number; // 0 - 100
  portalUseRate: number; // 0 - 100
  satisfactionByServiceLine: Record<string, { avg: number; count: number }>;
  satisfactionByYear: Record<string, { avg: number; count: number }>;
  countsByReadmissionRisk: Record<string, number>;
  countsByAiRiskFlag: Record<string, number>;
  distinctComments: DistinctCommentInfo[];
  groupedStats: {
    byPersona: Record<string, { count: number; avgSatisfaction: number; avgCommunication: number; followupRate: number; portalRate: number }>;
    byAgeGroup: Record<string, { count: number; avgSatisfaction: number; avgCommunication: number }>;
    byVisitType: Record<string, { count: number; avgSatisfaction: number; avgCommunication: number }>;
  };
}

export type AgentStatus = 'pending' | 'running' | 'review' | 'completed' | 'skipped' | 'failed';

export interface Agent4PlanOutput {
  goal: string;
  agents: Array<{
    agent: string;
    run: boolean;
    task: string;
    reason?: string;
  }>;
}

export interface Agent1FeedbackOutput {
  comments: Array<{
    id: string;
    theme: string;
    sentiment: string;
    reasoning: string;
    operational_issue: string;
    risk_or_bias_concern: string;
    recommended_action: string;
  }>;
  summary: string;
}

export interface Agent2MonitoringOutput {
  patterns: Array<{
    pattern: string;
    evidence: string;
  }>;
  operational_issues: string[];
  equity_concerns: Array<{
    group: string;
    concern: string;
    evidence: string;
  }>;
  risk: {
    patient_safety: string;
    reputational: string;
    compliance: string;
    equity: string;
  };
  recommendation: string;
  additional_information_needed: string;
}

export interface Agent3TriageOutput {
  complaints: Array<{
    id: string;
    primary_category: string;
    secondary_categories: string[];
    severity_level: number;
    severity_reasoning: string;
    risks: Array<{
      risk: string;
      why: string;
    }>;
    route_to: string;
    human_review_required: boolean;
    human_review_reason: string;
  }>;
  summary: string;
}

export interface Agent6CommunicationOutput {
  evaluations: Array<{
    id: string;
    purpose: string;
    purpose_rationale: string;
    scores: {
      clarity: string | number;
      completeness: string | number;
      empathy: string | number;
      patient_centeredness: string | number;
      actionability: string | number;
    };
    health_literacy_concern: string;
    risk: string;
    risk_reason: string;
    improvements: string[];
  }>;
  improved_patient_message: string;
  executive_summary: {
    overall_quality: string;
    major_strengths: string;
    major_weaknesses: string;
    highest_risk: string;
    most_important_improvement: string;
  };
}

export interface Agent5AnalyticsOutput {
  headline: string;
  satisfaction_insights: string[];
  top_themes: string[];
  hidden_problems: Array<{
    problem: string;
    evidence: string;
  }>;
  ai_risk_monitoring: {
    hallucination_trap: string[];
    bias_related: string[];
    human_review: string[];
  };
  top_priorities: string[];
  quick_wins: string[];
  long_term_ai_opportunities: string[];
  additional_information_needed: string;
}

export interface Agent4FinalDecisionOutput {
  top_alert: string;
  answer: string;
  priority: 'Low' | 'Medium' | 'High' | string;
  priority_reason: string;
  recommended_actions: Array<{
    action: string;
    owner: string;
    timeframe: string;
  }>;
  human_review: Array<{
    item: string;
    reason: string;
  }>;
}

export interface AgentConfig {
  id: string;
  agentNumber: number;
  order: number;
  name: string;
  roleTitle: string;
  shortDesc: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    glow: string;
    accent: string;
  };
  icon: string;
  executionStep: number;
  inputDescription: string;
}

export interface AgentExecutionState {
  status: AgentStatus;
  task: string;
  inputData: any;
  outputData: any;
  error?: string;
  durationMs?: number;
  enabled: boolean;
}
