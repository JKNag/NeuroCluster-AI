import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, Server, AlertTriangle, Upload, Shield, Cpu, Scan, UserRound
} from 'lucide-react';

import UrgencyTimeGuard from './UrgencyTimeGuard';
import PatientDetailsFields, { emptyPatient } from './PatientDetailsFields';
import MriReport from './MriReport';
import { buildReport } from '../lib/buildReport';
import { API_BASE } from '../lib/config';

export default function Dashboard({ onOpenPatient }) {
  const [nodes, setNodes] = useState([]);
  const [overview, setOverview] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanType, setScanType] = useState('Urgent');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(emptyPatient);

  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cluster-status`);
        setNodes(res.data.nodes || []);
        setOverview(res.data.overview || {});
      } catch (err) {
        console.error("Backend Not Connected!", err);
      }
    };

    fetchCluster();
    const interval = setInterval(fetchCluster, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setReport(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an MRI image first!");

    setLoading(true);
    setReport(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(`${API_BASE}/api/process-mri?scan_type=${scanType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setReport(buildReport({
        apiResult: res.data,
        patient,
        previewUrl,
        filename: selectedFile.name,
      }));
    } catch (err) {
      alert("Error processing MRI Scan!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans print:bg-white print:text-slate-900 print:p-0">
      
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">NeuroCluster AI</h1>
            <p className="text-xs text-slate-400">Smart Medical Workload & GPU Orchestrator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span>HIPAA Compliant & RBAC Active</span>
          </div>
          <button
            onClick={onOpenPatient}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <UserRound className="w-4 h-4" /> For Patient
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6 print:hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" /> Live GPU Nodes
            </h2>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          {/* GPU Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const isHeavyOrAtRisk = node.status?.includes('Heavy') || node.status === 'At Risk' || node.temp > 80;

              return (
                <div 
                  key={node.id} 
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isHeavyOrAtRisk 
                      ? 'bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/50' 
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">{node.id}</h3>
                      <p className="text-xs text-slate-400">{node.name}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isHeavyOrAtRisk ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className={node.temp > 80 ? 'text-rose-400 font-bold' : 'text-slate-100'}>{node.temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VRAM Usage:</span>
                      <span className={parseInt(node.vram) > 85 ? 'text-rose-400 font-bold' : 'text-slate-100'}>{node.vram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fan Speed:</span>
                      <span>{node.fan_speed}</span>
                    </div>
                  </div>

                  {isHeavyOrAtRisk && (
                    <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded text-[11px] text-rose-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>High Compute Contention</span>
                      </div>
                      <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">BLOCKED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <div>
              <p className="text-xs text-slate-400">Priority Preemption Rate</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">
                {overview.preemption_rate || "< 1.2s"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Idle GPU Saved</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                {overview.idle_gpu_saved || "38.4%"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Cluster Status</p>
              <p className={`text-xl font-bold mt-1 ${
                overview.cluster_status?.includes('Rebalancing') || overview.cluster_status?.includes('High') ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
              }`}>
                {overview.cluster_status || "Optimal"}
              </p>
            </div>
          </div>

          {/* Urgency Time Guard Module */}
          <UrgencyTimeGuard />

        </div>

        {/* Right Section */}
        <div className="space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 print:hidden">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> MRI Workload Execution
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <PatientDetailsFields value={patient} onChange={setPatient} compact />

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Scan Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg p-2 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:text-xs cursor-pointer"
                />
                {previewUrl && (
                  <div className="mt-2 h-32 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={previewUrl} alt="MRI Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Workload Priority</label>
                <select 
                  value={scanType} 
                  onChange={(e) => setScanType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Urgent">🚨 Urgent (Stroke / Trauma - High Priority)</option>
                  <option value="Routine">🔵 Routine (Batch Research Processing)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading || !selectedFile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Scan className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Submit to Cluster
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Diagnostic Report Area */}
          {report ? (
            <MriReport
              report={report}
              lang={patient.lang}
              onLangChange={(lang) => setPatient((p) => ({ ...p, lang }))}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-6 text-center text-xs text-slate-500 print:hidden">
              Enter patient details and upload an MRI scan to generate the diagnosis report.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}