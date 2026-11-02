import { PatientRecord, CalculatedKPIs, DistinctCommentInfo } from '../types/agent';

export const RAW_DISTINCT_COMMENTS = [
  {
    id: 'C-1',
    text: 'Discharge instructions for my blood pressure medication were contradictory; one nurse said take with food in morning, doctor note said bedtime without food. I felt dizzy and skipped a dose.'
  },
  {
    id: 'C-2',
    text: 'Waited over 4 hours in the Emergency waiting room with severe abdominal pain while newer arrivals were seen before me with no explanation from staff.'
  },
  {
    id: 'C-3',
    text: 'The patient portal kept throwing 500 server error codes when I attempted to view my post-biopsy pathology results and message my oncologist, causing massive anxiety over the weekend.'
  },
  {
    id: 'C-4',
    text: 'Doctor spoke very rapid medical jargon and refused an in-person Spanish interpreter, handing me a generic English discharge pamphlet instead.'
  },
  {
    id: 'C-5',
    text: 'Received an unexpected $1,850 out-of-network balance bill for an assistant surgeon when I specifically pre-verified prior to surgery that the entire surgical team was in-network.'
  },
  {
    id: 'C-6',
    text: 'The nurse navigator in Cardiology called the day after my stent procedure to check my incision and walk through my cardiac rehab schedule. Extremely caring, empathetic, and clear!'
  },
  {
    id: 'C-7',
    text: 'Wheelchair access ramp at clinic entrance was blocked by construction dumpsters, and automated check-in kiosk screen was positioned too high for wheelchair users.'
  },
  {
    id: 'C-8',
    text: 'Automated SMS system sent three conflicting appointment confirmation times for the same specialist visit, causing me to miss half a day of hourly wages.'
  }
];

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  // C-1 comments (Medication / Discharge)
  { Record_ID: 'REC-1001', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1002', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Primary Care', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1003', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'High Severity Escalation', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1004', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Neurology', Year: 2024, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1005', Patient_Persona: 'Medicaid Enrollee', Age_Group: '50-64', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1006', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[0].text },

  // C-2 comments (ED Wait times)
  { Record_ID: 'REC-1007', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1008', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '18-29', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1009', Patient_Persona: 'Medicaid Enrollee', Age_Group: '30-49', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1010', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2024, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1011', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1012', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '18-29', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text },
  { Record_ID: 'REC-1013', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'High Severity Escalation', Comment: RAW_DISTINCT_COMMENTS[1].text },

  // C-3 comments (Portal Tech Glitch)
  { Record_ID: 'REC-1014', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[2].text },
  { Record_ID: 'REC-1015', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[2].text },
  { Record_ID: 'REC-1016', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Telehealth', Service_Line: 'Neurology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[2].text },
  { Record_ID: 'REC-1017', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '18-29', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[2].text },
  { Record_ID: 'REC-1018', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[2].text },

  // C-4 comments (Language barrier & Interpreter refusal)
  { Record_ID: 'REC-1019', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '50-64', Visit_Type: 'Inpatient', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[3].text },
  { Record_ID: 'REC-1020', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[3].text },
  { Record_ID: 'REC-1021', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Primary Care', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[3].text },
  { Record_ID: 'REC-1022', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '18-29', Visit_Type: 'Inpatient', Service_Line: 'Women\'s Health', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[3].text },
  { Record_ID: 'REC-1023', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '50-64', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[3].text },

  // C-5 comments (Surprise Balance Billing)
  { Record_ID: 'REC-1024', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[4].text },
  { Record_ID: 'REC-1025', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '30-49', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[4].text },
  { Record_ID: 'REC-1026', Patient_Persona: 'Medicaid Enrollee', Age_Group: '50-64', Visit_Type: 'Surgical', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[4].text },
  { Record_ID: 'REC-1027', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2024, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[4].text },
  { Record_ID: 'REC-1028', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Surgical', Service_Line: 'Women\'s Health', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[4].text },

  // C-6 comments (Positive Cardiology Follow-up Navigation)
  { Record_ID: 'REC-1029', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1030', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1031', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1032', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '30-49', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1033', Patient_Persona: 'Medicaid Enrollee', Age_Group: '50-64', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2024, Patient_Satisfaction: 4, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1034', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },

  // C-7 comments (Accessibility Ramp & High Kiosk)
  { Record_ID: 'REC-1035', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[6].text },
  { Record_ID: 'REC-1036', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Outpatient', Service_Line: 'Primary Care', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[6].text },
  { Record_ID: 'REC-1037', Patient_Persona: 'Medicaid Enrollee', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[6].text },
  { Record_ID: 'REC-1038', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Outpatient', Service_Line: 'Neurology', Year: 2024, Patient_Satisfaction: 2, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[6].text },

  // C-8 comments (Conflicting SMS scheduling)
  { Record_ID: 'REC-1039', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Primary Care', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[7].text },
  { Record_ID: 'REC-1040', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Women\'s Health', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[7].text },
  { Record_ID: 'REC-1041', Patient_Persona: 'Medicaid Enrollee', Age_Group: '18-29', Visit_Type: 'Outpatient', Service_Line: 'Primary Care', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[7].text },
  { Record_ID: 'REC-1042', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '18-29', Visit_Type: 'Telehealth', Service_Line: 'Primary Care', Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Hallucination Risk', Comment: RAW_DISTINCT_COMMENTS[7].text },
  { Record_ID: 'REC-1043', Patient_Persona: 'Rural Resident', Age_Group: '50-64', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[7].text },
  { Record_ID: 'REC-1044', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[7].text },

  // Additional varied records to round out distribution
  { Record_ID: 'REC-1045', Patient_Persona: 'Tech-Savvy Millennial', Age_Group: '18-29', Visit_Type: 'Telehealth', Service_Line: 'Primary Care', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[5].text },
  { Record_ID: 'REC-1046', Patient_Persona: 'Older Adult with Chronic Illness', Age_Group: '65+', Visit_Type: 'Inpatient', Service_Line: 'Oncology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: RAW_DISTINCT_COMMENTS[0].text },
  { Record_ID: 'REC-1047', Patient_Persona: 'Non-English Primary Speaker', Age_Group: '30-49', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: RAW_DISTINCT_COMMENTS[3].text },
  { Record_ID: 'REC-1048', Patient_Persona: 'Busy Working Parent', Age_Group: '30-49', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'Standard Review', Comment: RAW_DISTINCT_COMMENTS[1].text }
];

/**
 * Pure JavaScript computation function:
 * Calculates all numbers in JavaScript, exactly as specified in the prompt requirements.
 */
export function calculateKPIs(records: PatientRecord[]): CalculatedKPIs {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followupRate: 0,
      portalUseRate: 0,
      satisfactionByServiceLine: {},
      satisfactionByYear: {},
      countsByReadmissionRisk: {},
      countsByAiRiskFlag: {},
      distinctComments: [],
      groupedStats: { byPersona: {}, byAgeGroup: {}, byVisitType: {} }
    };
  }

  let totalSat = 0;
  let totalComm = 0;
  let totalFollowup = 0;
  let totalPortal = 0;

  const satByServiceLine: Record<string, { total: number; count: number }> = {};
  const satByYear: Record<string, { total: number; count: number }> = {};
  const readmissionCounts: Record<string, number> = {};
  const aiRiskCounts: Record<string, number> = {};

  // Grouped stats
  const personaMap: Record<string, { count: number; satTotal: number; commTotal: number; followupTotal: number; portalTotal: number }> = {};
  const ageMap: Record<string, { count: number; satTotal: number; commTotal: number }> = {};
  const visitTypeMap: Record<string, { count: number; satTotal: number; commTotal: number }> = {};

  // Deduplicate comments
  const commentMap = new Map<string, {
    count: number;
    commTotal: number;
    aiRiskFlags: Record<string, number>;
    recordIds: string[];
  }>();

  for (const r of records) {
    const sat = Number(r.Patient_Satisfaction) || 0;
    const comm = Number(r.Communication_Rating) || 0;
    const fup = Number(r.Followup_Compliance) === 1 ? 1 : 0;
    const port = Number(r.Portal_Usage) === 1 ? 1 : 0;

    totalSat += sat;
    totalComm += comm;
    totalFollowup += fup;
    totalPortal += port;

    // By Service Line
    const sl = r.Service_Line || 'General';
    if (!satByServiceLine[sl]) satByServiceLine[sl] = { total: 0, count: 0 };
    satByServiceLine[sl].total += sat;
    satByServiceLine[sl].count += 1;

    // By Year
    const yr = String(r.Year || '2025');
    if (!satByYear[yr]) satByYear[yr] = { total: 0, count: 0 };
    satByYear[yr].total += sat;
    satByYear[yr].count += 1;

    // Readmission Risk
    const rr = r.Readmission_Risk || 'Unknown';
    readmissionCounts[rr] = (readmissionCounts[rr] || 0) + 1;

    // AI Risk Flag
    const flag = r.AI_Risk_Flag || 'Standard Review';
    aiRiskCounts[flag] = (aiRiskCounts[flag] || 0) + 1;

    // Grouping by Persona
    const persona = r.Patient_Persona || 'General';
    if (!personaMap[persona]) personaMap[persona] = { count: 0, satTotal: 0, commTotal: 0, followupTotal: 0, portalTotal: 0 };
    personaMap[persona].count += 1;
    personaMap[persona].satTotal += sat;
    personaMap[persona].commTotal += comm;
    personaMap[persona].followupTotal += fup;
    personaMap[persona].portalTotal += port;

    // Grouping by Age Group
    const age = r.Age_Group || 'Unknown';
    if (!ageMap[age]) ageMap[age] = { count: 0, satTotal: 0, commTotal: 0 };
    ageMap[age].count += 1;
    ageMap[age].satTotal += sat;
    ageMap[age].commTotal += comm;

    // Grouping by Visit Type
    const vt = r.Visit_Type || 'Outpatient';
    if (!visitTypeMap[vt]) visitTypeMap[vt] = { count: 0, satTotal: 0, commTotal: 0 };
    visitTypeMap[vt].count += 1;
    visitTypeMap[vt].satTotal += sat;
    visitTypeMap[vt].commTotal += comm;

    // Comment deduplication
    const commentText = (r.Comment || '').trim();
    if (commentText) {
      if (!commentMap.has(commentText)) {
        commentMap.set(commentText, { count: 0, commTotal: 0, aiRiskFlags: {}, recordIds: [] });
      }
      const item = commentMap.get(commentText)!;
      item.count += 1;
      item.commTotal += comm;
      item.recordIds.push(r.Record_ID);
      item.aiRiskFlags[flag] = (item.aiRiskFlags[flag] || 0) + 1;
    }
  }

  // Format satisfaction by service line
  const satisfactionByServiceLine: Record<string, { avg: number; count: number }> = {};
  for (const [k, v] of Object.entries(satByServiceLine)) {
    satisfactionByServiceLine[k] = {
      avg: Math.round((v.total / v.count) * 10) / 10,
      count: v.count
    };
  }

  // Format satisfaction by year
  const satisfactionByYear: Record<string, { avg: number; count: number }> = {};
  for (const [k, v] of Object.entries(satByYear)) {
    satisfactionByYear[k] = {
      avg: Math.round((v.total / v.count) * 10) / 10,
      count: v.count
    };
  }

  // Format distinct comments
  const distinctComments: DistinctCommentInfo[] = [];
  let commentIndex = 1;
  for (const [text, info] of commentMap.entries()) {
    // Check if matches known C-1 to C-8 id
    const matchedKnown = RAW_DISTINCT_COMMENTS.find(c => c.text === text);
    distinctComments.push({
      id: matchedKnown ? matchedKnown.id : `C-${commentIndex}`,
      comment: text,
      count: info.count,
      avgCommunication: Math.round((info.commTotal / info.count) * 10) / 10,
      aiRiskFlagCounts: info.aiRiskFlags,
      recordIds: info.recordIds
    });
    commentIndex++;
  }

  // Format grouped stats
  const byPersona: Record<string, any> = {};
  for (const [k, v] of Object.entries(personaMap)) {
    byPersona[k] = {
      count: v.count,
      avgSatisfaction: Math.round((v.satTotal / v.count) * 10) / 10,
      avgCommunication: Math.round((v.commTotal / v.count) * 10) / 10,
      followupRate: Math.round((v.followupTotal / v.count) * 100),
      portalRate: Math.round((v.portalTotal / v.count) * 100),
    };
  }

  const byAgeGroup: Record<string, any> = {};
  for (const [k, v] of Object.entries(ageMap)) {
    byAgeGroup[k] = {
      count: v.count,
      avgSatisfaction: Math.round((v.satTotal / v.count) * 10) / 10,
      avgCommunication: Math.round((v.commTotal / v.count) * 10) / 10
    };
  }

  const byVisitType: Record<string, any> = {};
  for (const [k, v] of Object.entries(visitTypeMap)) {
    byVisitType[k] = {
      count: v.count,
      avgSatisfaction: Math.round((v.satTotal / v.count) * 10) / 10,
      avgCommunication: Math.round((v.commTotal / v.count) * 10) / 10
    };
  }

  return {
    totalRecords,
    avgSatisfaction: Math.round((totalSat / totalRecords) * 10) / 10,
    avgCommunication: Math.round((totalComm / totalRecords) * 10) / 10,
    followupRate: Math.round((totalFollowup / totalRecords) * 100),
    portalUseRate: Math.round((totalPortal / totalRecords) * 100),
    satisfactionByServiceLine,
    satisfactionByYear,
    countsByReadmissionRisk: readmissionCounts,
    countsByAiRiskFlag: aiRiskCounts,
    distinctComments,
    groupedStats: {
      byPersona,
      byAgeGroup,
      byVisitType
    }
  };
}

/**
 * Utility to convert CSV text into PatientRecord array
 */
export function parseCSV(csvText: string): PatientRecord[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const records: PatientRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((h, idx) => {
      const cleanHeader = h.trim();
      let val: any = values[idx]?.trim() ?? '';
      if (['Patient_Satisfaction', 'Communication_Rating', 'Followup_Compliance', 'Portal_Usage', 'Year'].includes(cleanHeader)) {
        val = Number(val) || val;
      }
      row[cleanHeader] = val;
    });

    if (!row.Record_ID) {
      row.Record_ID = `REC-${1000 + i}`;
    }

    records.push(row as PatientRecord);
  }

  return records;
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

/**
 * Utility to export PatientRecords to CSV string
 */
export function exportToCSV(records: PatientRecord[]): string {
  if (records.length === 0) return '';
  const headers = ['Record_ID', 'Patient_Persona', 'Age_Group', 'Visit_Type', 'Service_Line', 'Year', 'Patient_Satisfaction', 'Communication_Rating', 'Followup_Compliance', 'Portal_Usage', 'Readmission_Risk', 'AI_Risk_Flag', 'Comment'];

  const rows = records.map(r => {
    return headers.map(h => {
      const val = r[h] ?? '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
