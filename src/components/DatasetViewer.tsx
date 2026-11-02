import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Search,
  Filter,
  CheckSquare,
  Square,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  Info,
  Check,
  RefreshCw
} from 'lucide-react';
import { PatientRecord, CalculatedKPIs } from '../types/agent';
import { exportToCSV, parseCSV } from '../data/sampleDataset';

interface DatasetViewerProps {
  records: PatientRecord[];
  selectedIds: Set<string>;
  onToggleRecord: (recordId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onUploadRecords: (newRecords: PatientRecord[]) => void;
  onResetToDefault: () => void;
  kpis: CalculatedKPIs;
}

export const DatasetViewer: React.FC<DatasetViewerProps> = ({
  records,
  selectedIds,
  onToggleRecord,
  onSelectAll,
  onDeselectAll,
  onUploadRecords,
  onResetToDefault,
  kpis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setUploadError('CSV file appeared empty or invalid format.');
          return;
        }
        onUploadRecords(parsed);
      } catch (err: any) {
        setUploadError(`Failed to parse CSV: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hospital_patient_experience_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    if (serviceFilter !== 'all' && r.Service_Line !== serviceFilter) return false;
    if (riskFilter !== 'all' && r.AI_Risk_Flag !== riskFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchComment = (r.Comment || '').toLowerCase().includes(q);
      const matchId = (r.Record_ID || '').toLowerCase().includes(q);
      const matchPersona = (r.Patient_Persona || '').toLowerCase().includes(q);
      const matchService = (r.Service_Line || '').toLowerCase().includes(q);
      if (!matchComment && !matchId && !matchPersona && !matchService) return false;
    }
    return true;
  });

  const allFilteredSelected = filteredRecords.length > 0 && filteredRecords.every(r => selectedIds.has(r.Record_ID));

  const serviceLines = Array.from(new Set(records.map(r => r.Service_Line).filter(Boolean)));
  const aiRiskFlags = Array.from(new Set(records.map(r => r.AI_Risk_Flag).filter(Boolean)));

  return (
    <div className="space-y-4">
      {/* Top action and deduplication highlight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Patient Experience Cohort Dataset
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
              {selectedIds.size} of {records.length} records selected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deduplicated into <strong>{kpis.distinctComments.length} distinct comments</strong> for AI calls, with results mapped back in code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload CSV
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset to default synthetic 48-patient cohort"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Search and Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search comments, ID, persona, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Service Lines</option>
            {serviceLines.map(sl => (
              <option key={sl} value={sl}>{sl}</option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Risk Flags</option>
            {aiRiskFlags.map(rf => (
              <option key={rf} value={rf}>{rf}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={allFilteredSelected ? onDeselectAll : onSelectAll}
            className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            {allFilteredSelected ? <Square className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
            {allFilteredSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 sticky top-0 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] z-10">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={allFilteredSelected ? onDeselectAll : onSelectAll}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Persona & Age</th>
                <th className="py-2.5 px-3">Visit & Line</th>
                <th className="py-2.5 px-3 text-center">Year</th>
                <th className="py-2.5 px-3 text-center">Satisfaction</th>
                <th className="py-2.5 px-3 text-center">Comm</th>
                <th className="py-2.5 px-3 text-center">Follow-up</th>
                <th className="py-2.5 px-3 text-center">Portal</th>
                <th className="py-2.5 px-3">AI Risk Flag</th>
                <th className="py-2.5 px-3">Patient Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No patient records matched the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isChecked = selectedIds.has(r.Record_ID);

                  return (
                    <tr
                      key={r.Record_ID}
                      onClick={() => onToggleRecord(r.Record_ID)}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isChecked ? '' : 'opacity-40 bg-slate-50/20'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleRecord(r.Record_ID)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {r.Record_ID}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{r.Patient_Persona}</div>
                        <div className="text-[10px] text-slate-400">Age: {r.Age_Group}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{r.Service_Line}</div>
                        <div className="text-[10px] text-slate-400">{r.Visit_Type}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400">
                        {r.Year}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                          r.Patient_Satisfaction <= 2 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          r.Patient_Satisfaction === 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {r.Patient_Satisfaction} / 5
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300 font-semibold">
                        {r.Communication_Rating} / 5
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          Number(r.Followup_Compliance) === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {Number(r.Followup_Compliance) === 1 ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          Number(r.Portal_Usage) === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {Number(r.Portal_Usage) === 1 ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.AI_Risk_Flag === 'Human Review Required' || r.AI_Risk_Flag === 'High Severity Escalation'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : r.AI_Risk_Flag === 'Bias Review'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {r.AI_Risk_Flag}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-sm">
                        <p className="line-clamp-2 text-slate-700 dark:text-slate-300 italic">
                          "{r.Comment}"
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
