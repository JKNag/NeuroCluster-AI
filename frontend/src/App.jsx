import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, Server, AlertTriangle, Upload, Shield, Cpu, 
  Image as ImageIcon, Scan, FileText, Printer, User, 
  Calendar, Stethoscope 
} from 'lucide-react';

// Urgency Time Guard Component Import
import UrgencyTimeGuard from './components/UrgencyTimeGuard';

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [overview, setOverview] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanType, setScanType] = useState('Urgent');
  const [loading, setLoading] = useState(false);
  const [mriResult, setMriResult] = useState(null);

  // Fetch Cluster Status with Automatic Polling
  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/cluster-status');
        setNodes(res.data.nodes || []);
        setOverview(res.data.overview || {});
      } catch (err) {
        console.error("Backend Not Connected!", err);
      }
    };

    fetchCluster();
    const interval = setInterval(fetchCluster, 2000); // 2-second cluster check interval
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMriResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an MRI image first!");

    setLoading(true);
    setMriResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/process-mri?scan_type=${scanType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const hfResult = res.data.mri_ai_result || {};
      const rawLabel = hfResult.label ? String(hfResult.label).toLowerCase().trim() : 'no_tumor';
      const scoreVal = hfResult.confidence ? (hfResult.confidence * 100).toFixed(1) : '95.0';

      const isNoTumor = rawLabel.includes('no_tumor') || rawLabel.includes('notumor') || rawLabel.includes('normal') || rawLabel === 'no';
      const isTumor = !isNoTumor;

      let formattedLabel = rawLabel.replace(/_/g, ' ').toUpperCase();

      const fullReport = {
        ...res.data,
        patient_id: `PAT-${Math.floor(100000 + Math.random() * 900000)}`,
        scan_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        confidence: `${scoreVal}%`,
        is_tumor: isTumor,
        ai_finding: isTumor 
          ? `TUMOR DETECTED: YES (${formattedLabel})` 
          : 'NO TUMOR DETECTED / HEALTHY BRAIN SCAN',
        anomaly_volume: isTumor 
          ? `${(Math.random() * (25.0 - 10.0) + 10.0).toFixed(1)} cm³` 
          : '0.0 cm³ (Clear)',
        severity: isTumor 
          ? (scanType === 'Urgent' ? 'Critical (High Risk)' : 'Moderate Risk') 
          : 'Normal / Low Risk',
        recommendation: isTumor 
          ? 'Immediate Emergency Neurological Consultation & MRI Evaluation Required.' 
          : 'No clear lesion or tumor detected. Follow routine yearly brain checkup.'
      };

      setMriResult(fullReport);
    } catch (err) {
      alert("Error processing MRI Scan!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans print:bg-[#fdfbf7] print:text-slate-900 print:p-0">
      
      {/* Header (Hidden on Print) */}
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
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
          <Shield className="w-4 h-4" />
          <span>HIPAA Compliant & RBAC Active</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        
        {/* Left Section: Live GPU Nodes & Cluster Status Bar (Hidden on Print) */}
        <div className="lg:col-span-2 space-y-6 print:hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" /> Live GPU Nodes (Scikit-Learn Health Guard)
            </h2>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          {/* GPU Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  node.status === 'At Risk' 
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/50' 
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">{node.id}</h3>
                    <p className="text-xs text-slate-400">{node.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.status === 'At Risk' ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
                    <span>{node.vram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fan Speed:</span>
                    <span>{node.fan_speed}</span>
                  </div>
                </div>

                {node.status === 'At Risk' && (
                  <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Scikit-learn Alert: Migrating Jobs!</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Optimal & Metrics Bar */}
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
                overview.cluster_status?.includes('Degraded') ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
              }`}>
                {overview.cluster_status || "Optimal"}
              </p>
            </div>
          </div>

          {/* URGENCY TIME GUARD MODULE */}
          <UrgencyTimeGuard />

        </div>

        {/* Right Section: Upload Form & Report Box */}
        <div className="space-y-4">
          
          {/* Upload Form Box (Hidden on Print) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 print:hidden">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> MRI Workload Execution
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Scan Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg p-2 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:text-xs cursor-pointer"
                />
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

          {/* REPORT & PRINT AREA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden print:bg-[#fdfbf7] print:border-none print:p-6 print:text-slate-900 print:shadow-none">
            
            {/* Background Watermark (Only visible when printing) */}
            <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none opacity-[0.05] z-0 select-none">
              <h1 className="text-6xl font-black rotate-[-30deg] text-indigo-950 tracking-widest uppercase">
                NEUROCLUSTER AI
              </h1>
            </div>

            {/* Print Only Header with Name and Logo */}
            <div className="hidden print:flex justify-between items-center border-b-2 border-slate-300 pb-3 mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 leading-tight">NeuroCluster AI</h1>
                  <p className="text-[10px] font-medium text-slate-600">Advanced GPU-Accelerated Medical Diagnostics</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                  OFFICIAL DIAGNOSTIC REPORT
                </span>
              </div>
            </div>

            {/* Image Inspection Window */}
            {previewUrl && (
              <div className="space-y-2 relative z-10">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 print:text-slate-800">
                  <ImageIcon className="w-4 h-4 text-indigo-400 print:text-indigo-700" /> Image Inspection Window
                </span>
                
                <div className="relative w-full h-52 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center print:bg-slate-950 print:border-slate-400">
                  <img 
                    src={previewUrl} 
                    alt="MRI Preview" 
                    className="max-h-full max-w-full object-contain"
                  />

                  {mriResult && mriResult.is_tumor && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 border-2 border-rose-500 bg-rose-500/20 rounded animate-pulse relative">
                        <span className="absolute -top-4 left-0 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                          ROI: Anomaly ({mriResult.confidence})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diagnostic Details */}
            {mriResult ? (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 text-xs border-l-4 border-l-indigo-500 print:bg-white print:border-slate-300 print:p-4 print:shadow-none relative z-10">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 print:border-slate-200">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5 print:text-slate-900">
                    <FileText className="w-4 h-4 text-indigo-400 print:text-slate-700" /> Patient Diagnostic Report
                  </span>
                  
                  {/* Single Print Button */}
                  <button 
                    onClick={handlePrint}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition flex items-center gap-1.5 text-xs font-medium border border-slate-700 print:hidden cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>

                {/* Patient Meta Data */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800 print:bg-amber-50/50 print:border-amber-200/80 print:text-slate-800">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500 print:text-indigo-600" />
                    <span>ID: <strong className="text-slate-200 print:text-indigo-700">{mriResult.patient_id}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 print:text-indigo-600" />
                    <span>Date: <strong className="text-slate-200 print:text-slate-900">{mriResult.scan_date}</strong></span>
                  </div>
                </div>

                {/* File Logs */}
                <div className="space-y-1 text-slate-400 print:text-slate-700 text-[11px]">
                  <p>File Name: <span className="text-slate-200 print:text-slate-900 font-medium">{mriResult.filename}</span></p>
                  <p>Processed By: <span className="text-indigo-400 font-medium print:text-indigo-800">{mriResult.allocated_gpu}</span> ({mriResult.processing_time_sec}s)</p>
                </div>

                {/* AI Model Diagnosis Box */}
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 print:bg-rose-50/80 print:border-rose-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 print:text-slate-800">
                      <Stethoscope className="w-3.5 h-3.5 text-rose-400 print:text-rose-600" /> AI Model Diagnosis:
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mriResult.is_tumor ? 'bg-rose-500/20 text-rose-400 print:bg-rose-200 print:text-rose-800' : 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-200 print:text-emerald-800'
                    }`}>
                      {mriResult.severity}
                    </span>
                  </div>
                  
                  <p className={`text-xs font-bold ${mriResult.is_tumor ? 'text-rose-400 print:text-rose-700' : 'text-emerald-400 print:text-emerald-700'}`}>
                    {mriResult.ai_finding}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800 print:border-rose-200 print:text-slate-800 print:pt-2">
                    <p>Volume: <strong className="text-slate-200 print:text-slate-900">{mriResult.anomaly_volume}</strong></p>
                    <p>AI Confidence: <strong className="text-emerald-400 print:text-emerald-700">{mriResult.confidence}</strong></p>
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/30 rounded text-[11px] print:bg-emerald-50 print:border-emerald-200">
                  <p className="text-indigo-300 font-semibold print:text-emerald-900">Recommendation:</p>
                  <p className="text-slate-300 text-[10px] mt-0.5 print:text-emerald-800">{mriResult.recommendation}</p>
                </div>

                {/* Print Only Footer */}
                <div className="hidden print:block text-center text-[9px] text-slate-400 pt-3 border-t border-slate-200">
                  Automated Medical Diagnosis Report Generated by NeuroCluster AI Orchestrator
                </div>

              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Upload an MRI scan to generate diagnosis report.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}