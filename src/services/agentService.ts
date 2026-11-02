import { AGENT_PROMPTS } from '../data/prompts';
import {
  CalculatedKPIs,
  Agent4PlanOutput,
  Agent1FeedbackOutput,
  Agent2MonitoringOutput,
  Agent3TriageOutput,
  Agent6CommunicationOutput,
  Agent5AnalyticsOutput,
  Agent4FinalDecisionOutput
} from '../types/agent';

async function postAgentCall(agentId: string, systemPrompt: string, inputData: any) {
  const resp = await fetch('/api/agent-call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, systemPrompt, inputData }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error || `Agent execution error (${resp.status})`);
  }
  return data.result;
}

export const AgentService = {
  // Step 1: Agent 4 Planning
  async runAgent4Planning(
    managerQuestion: string,
    kpis: CalculatedKPIs,
    availableColumns: string[]
  ): Promise<Agent4PlanOutput> {
    const inputPayload = {
      manager_question: managerQuestion,
      available_columns: availableColumns,
      kpis: {
        total_records: kpis.totalRecords,
        average_patient_satisfaction: kpis.avgSatisfaction,
        average_communication_rating: kpis.avgCommunication,
        followup_compliance_rate_percent: kpis.followupRate,
        portal_usage_rate_percent: kpis.portalUseRate,
        satisfaction_by_service_line: kpis.satisfactionByServiceLine,
        counts_by_readmission_risk: kpis.countsByReadmissionRisk,
        counts_by_ai_risk_flag: kpis.countsByAiRiskFlag
      }
    };

    return postAgentCall('agent_4_planning', AGENT_PROMPTS.AGENT_4_PLANNING, inputPayload);
  },

  // Step 2a: Agent 1 Feedback
  async runAgent1Feedback(kpis: CalculatedKPIs): Promise<Agent1FeedbackOutput> {
    const inputPayload = {
      distinct_comments: kpis.distinctComments.map(c => ({
        id: c.id,
        comment: c.comment,
        occurrence_count: c.count
      }))
    };

    return postAgentCall('agent_1_feedback', AGENT_PROMPTS.AGENT_1_FEEDBACK, inputPayload);
  },

  // Step 2b: Agent 2 Monitoring
  async runAgent2Monitoring(kpis: CalculatedKPIs): Promise<Agent2MonitoringOutput> {
    const inputPayload = {
      kpi_summary: {
        total_records: kpis.totalRecords,
        average_patient_satisfaction: kpis.avgSatisfaction,
        average_communication_rating: kpis.avgCommunication,
        followup_compliance_rate_percent: kpis.followupRate,
        portal_usage_rate_percent: kpis.portalUseRate,
      },
      grouped_by_persona: kpis.groupedStats.byPersona,
      grouped_by_age_group: kpis.groupedStats.byAgeGroup,
      grouped_by_visit_type: kpis.groupedStats.byVisitType,
      satisfaction_by_service_line: kpis.satisfactionByServiceLine,
      satisfaction_by_year: kpis.satisfactionByYear,
      readmission_risk_counts: kpis.countsByReadmissionRisk
    };

    return postAgentCall('agent_2_monitoring', AGENT_PROMPTS.AGENT_2_MONITORING, inputPayload);
  },

  // Step 2c: Agent 3 Complaint Triage
  async runAgent3Triage(kpis: CalculatedKPIs): Promise<Agent3TriageOutput> {
    const inputPayload = {
      complaints_to_triage: kpis.distinctComments.map(c => ({
        id: c.id,
        comment: c.comment,
        occurrence_count: c.count,
        ai_risk_flag_counts: c.aiRiskFlagCounts
      }))
    };

    return postAgentCall('agent_3_triage', AGENT_PROMPTS.AGENT_3_TRIAGE, inputPayload);
  },

  // Step 2d: Agent 6 Communication Evaluator
  async runAgent6Communication(kpis: CalculatedKPIs): Promise<Agent6CommunicationOutput> {
    const inputPayload = {
      comments_for_communication_evaluation: kpis.distinctComments.map(c => ({
        id: c.id,
        comment: c.comment,
        occurrence_count: c.count,
        average_communication_rating: c.avgCommunication
      }))
    };

    return postAgentCall('agent_6_communication', AGENT_PROMPTS.AGENT_6_COMMUNICATION, inputPayload);
  },

  // Step 3: Agent 5 Analytics
  async runAgent5Analytics(
    kpis: CalculatedKPIs,
    specialistResults: {
      agent1?: Agent1FeedbackOutput | null;
      agent2?: Agent2MonitoringOutput | null;
      agent3?: Agent3TriageOutput | null;
      agent6?: Agent6CommunicationOutput | null;
    }
  ): Promise<Agent5AnalyticsOutput> {
    const inputPayload = {
      kpis: {
        total_records: kpis.totalRecords,
        average_patient_satisfaction: kpis.avgSatisfaction,
        average_communication_rating: kpis.avgCommunication,
        followup_compliance_rate_percent: kpis.followupRate,
        portal_usage_rate_percent: kpis.portalUseRate,
        service_line_satisfaction: kpis.satisfactionByServiceLine,
        year_satisfaction: kpis.satisfactionByYear,
        persona_breakdown: kpis.groupedStats.byPersona
      },
      specialist_agent_findings: {
        agent_1_feedback_insights: specialistResults.agent1 || 'SKIPPED_OR_UNAVAILABLE',
        agent_2_experience_monitoring: specialistResults.agent2 || 'SKIPPED_OR_UNAVAILABLE',
        agent_3_complaint_triage: specialistResults.agent3 || 'SKIPPED_OR_UNAVAILABLE',
        agent_6_communication_evaluation: specialistResults.agent6 || 'SKIPPED_OR_UNAVAILABLE'
      }
    };

    return postAgentCall('agent_5_analytics', AGENT_PROMPTS.AGENT_5_ANALYTICS, inputPayload);
  },

  // Step 4: Agent 4 Final Decision
  async runAgent4FinalDecision(
    managerQuestion: string,
    plan: Agent4PlanOutput,
    analyticsResult: Agent5AnalyticsOutput,
    kpis: CalculatedKPIs,
    humanReviewCases: any[]
  ): Promise<Agent4FinalDecisionOutput> {
    const inputPayload = {
      manager_question: managerQuestion,
      initial_plan: plan,
      analytics_insights: analyticsResult,
      hospital_kpis: {
        total_records: kpis.totalRecords,
        satisfaction: kpis.avgSatisfaction,
        communication: kpis.avgCommunication,
        followup_rate: kpis.followupRate
      },
      flagged_cases_needing_human_review: humanReviewCases
    };

    return postAgentCall('agent_4_final_decision', AGENT_PROMPTS.AGENT_4_FINAL_DECISION, inputPayload);
  }
};
