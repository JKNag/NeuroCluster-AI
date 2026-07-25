import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, AlertCircle, RefreshCw, AlertTriangle, Clock, Layers } from 'lucide-react';

export default function UrgencyTimeGuard() {
  // প্রাথমিক জব লিস্ট (Status এবং Node সহ)
  const [jobs, setJobs] = useState([
    { id: '1', name: 'Scan: Brain MRI New.jpg', type: 'URGENT', elapsed: 22, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
    { id: '2', name: 'Emergency Acute Stroke', type: 'URGENT', elapsed: 12, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
    { id: '3', name: 'Scan: K Tumor MRI-1.jpg', type: 'URGENT', elapsed: 18, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
    { id: '4', name: 'Brain Tumor Genomics', type: 'RESEARCH', elapsed: 35, target: 120, node: 'GPU-Node-02', status: 'RUNNING' },
    { id: '5', name: 'Routine Head MRI Checkup', type: 'ROUTINE', elapsed: 15, target: 60, node: 'GPU-Node-03', status: 'RUNNING' }
  ]);

  // Preemption & Swap Logs রেকর্ড রাখার স্টেট
  const [swapLogs, setSwapLogs] = useState([]);

  // প্রতি সেকেন্ডে Elapsed সময় বাড়ানোর জন্য টাইমার (শুধু RUNNING জবগুলোর জন্য)
  useEffect(() => {
    const timer = setInterval(() => {
      setJobs(prevJobs =>
        prevJobs.map(job => 
          job.status === 'RUNNING' ? { ...job, elapsed: job.elapsed + 1 } : job
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Dynamic Performance Calculation Logic ---
  const calculatePerformance = (type) => {
    // PAUSED জবগুলো পারফরম্যান্স হিসাব থেকে বাদ থাকবে
    const activeJobs = jobs.filter(j => j.type === type && !j.status.includes('PAUSED'));
    if (activeJobs.length === 0) return 100;
    const onTimeCount = activeJobs.filter(j => j.elapsed <= j.target).length;
    return Math.round((onTimeCount / activeJobs.length) * 100);
  };

  const urgentPerf = calculatePerformance('URGENT');
  const routinePerf = calculatePerformance('ROUTINE');
  const researchPerf = calculatePerformance('RESEARCH');

  // Overdue হওয়া কেবল RUNNING জবগুলোর লিস্ট (Missed Target Cases)
  const missedJobs = jobs.filter(j => j.elapsed > j.target && j.status === 'RUNNING');

  // ⚡ Rescue / Late Risk Action Handler
  const handleRescueAndPreempt = () => {
    let freedGpuNode = '';
    let pausedJobName = '';

    // 1. Research Job Pause করা এবং Urgent Job-এর Elapsed Time রিসেট করা
    const updatedJobs = jobs.map(job => {
      if (job.type === 'RESEARCH' && job.status === 'RUNNING') {
        freedGpuNode = job.node;
        pausedJobName = job.name;
        return { ...job, status: 'PAUSED (GPU Freed)' };
      }
      if (job.type === 'URGENT') {
        return { ...job, elapsed: Math.floor(Math.random() * 5) + 1, status: 'RUNNING' }; // Elapsed reset to 1-5s
      }
      return job;
    });

    setJobs(updatedJobs);

    // 2. Record the Swap in Audit Log
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action: pausedJobName 
        ? `LATE RISK ACTION: Paused [${pausedJobName}] on ${freedGpuNode}. GPU reallocated to Urgent MRI Scans.`
        : `LATE RISK ACTION: Preemption triggered. High-priority GPU resources forced to Urgent Scans.`
    };
    
    setSwapLogs(prev => [newLog, ...prev]);
  };

  // 🔄 All Reset Handler: পুরো SLA বোর্ড রিফ্রেশ করার জন্য
  const handleResetAll = () => {
    setJobs([
      { id: '1', name: 'Scan: Brain MRI New.jpg', type: 'URGENT', elapsed: 5, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
      { id: '2', name: 'Emergency Acute Stroke', type: 'URGENT', elapsed: 12, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
      { id: '3', name: 'Scan: K Tumor MRI-1.jpg', type: 'URGENT', elapsed: 18, target: 30, node: 'GPU-Node-01', status: 'RUNNING' },
      { id: '4', name: 'Brain Tumor Genomics', type: 'RESEARCH', elapsed: 30, target: 120, node: 'GPU-Node-02', status: 'RUNNING' },
      { id: '5', name: 'Routine Head MRI Checkup', type: 'ROUTINE', elapsed: 15, target: 60, node: 'GPU-Node-03', status: 'RUNNING' }
    ]);
    setSwapLogs([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 text-slate-100">
      {/* Custom Scrollbar Dynamic Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Urgency Time Guard (Dynamic SLA Engine)
          </h2>
          <p className="text-xs text-slate-400">Live SLA Target Clock, Late Risk Warnings & Dynamic Preemption</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh/Reset State Button */}
          <button 
            onClick={handleResetAll}
            title="Reset All Timers"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Rescue Urgent Scan / Pause Research Button */}
          <button 
            onClick={handleRescueAndPreempt}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-rose-600/20 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current animate-bounce" />
            Rescue Urgent Scan (Pause Research)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Workloads */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Active Workloads & SLA Target Clocks</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {jobs.map((job) => {
              const isWarning = job.type === 'URGENT' && job.elapsed >= job.target - 8 && job.elapsed <= job.target && job.status === 'RUNNING';
              const isOverdue = job.elapsed > job.target && job.status === 'RUNNING';

              return (
                <div 
                  key={job.id} 
                  className={`p-3 rounded-lg border transition-all ${
                    isOverdue 
                      ? 'bg-rose-950/30 border-rose-500/50' 
                      : isWarning
                      ? 'bg-amber-950/30 border-amber-500/60 animate-pulse'
                      : job.status.includes('PAUSED')
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          job.type === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          job.type === 'RESEARCH' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {job.type}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{job.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Elapsed: <span className={isOverdue ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400 font-bold' : 'text-slate-200'}>{job.elapsed}s</span> / Target: <span className="text-slate-300">{job.target}s</span>
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        job.status.includes('PAUSED')
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {job.status === 'RUNNING' ? `RUNNING (${job.node})` : job.status}
                      </span>

                      {/* Late Risk Warning Badge */}
                      {isWarning && (
                        <div className="flex items-center justify-end gap-1 text-[10px] text-amber-400 font-bold">
                          <AlertTriangle className="w-3 h-3 animate-bounce" />
                          <span>Risk: Missing Target Soon!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Performance, Swap Log & Missed Target Reasons */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            On-Time Performance Report
          </h3>

          {/* Performance Percentage Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center transition-all">
              <p className="text-[10px] text-slate-400">Urgent Scans</p>
              <p className={`text-xl font-extrabold mt-1 transition-colors ${
                urgentPerf < 50 ? 'text-rose-500' : urgentPerf < 80 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {urgentPerf}%
              </p>
              <p className="text-[9px] text-slate-500">Target Met</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center transition-all">
              <p className="text-[10px] text-slate-400">Routine Scans</p>
              <p className={`text-xl font-extrabold mt-1 transition-colors ${
                routinePerf < 50 ? 'text-rose-500' : routinePerf < 80 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {routinePerf}%
              </p>
              <p className="text-[9px] text-slate-500">Target Met</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center transition-all">
              <p className="text-[10px] text-slate-400">Research Jobs</p>
              <p className={`text-xl font-extrabold mt-1 transition-colors ${
                researchPerf < 50 ? 'text-rose-500' : researchPerf < 80 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {researchPerf}%
              </p>
              <p className="text-[9px] text-slate-500">Target Met</p>
            </div>
          </div>

          {/* RECORDED PREEMPTION SWAP LOG */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> RECORDED PREEMPTION SWAP LOG:
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
              {swapLogs.length > 0 ? (
                swapLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-900 border border-indigo-500/30 rounded text-[11px] space-y-0.5">
                    <div className="flex items-center gap-1 text-indigo-400 font-bold text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>[{log.timestamp}]</span>
                    </div>
                    <p className="text-slate-300 text-[10px] leading-tight">{log.action}</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-500 text-center py-2">
                  No preemption swaps recorded yet. Click "Rescue Urgent Scan" to trigger.
                </p>
              )}
            </div>
          </div>

          {/* MISSED TARGET REASONS */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> MISSED TARGET REASONS:
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
              {missedJobs.length > 0 ? (
                missedJobs.map((mj) => (
                  <div key={mj.id} className="text-[10px] text-slate-300 border-b border-slate-800/60 pb-1.5 last:border-none">
                    <span className="text-amber-400 font-bold">[{mj.name}]</span> (Exceeded by {mj.elapsed - mj.target}s): 
                    <span className="text-slate-400 ml-1">
                      {mj.type === 'URGENT' 
                        ? 'Delayed due to high-density 3D MRI reconstruction compute contention.'
                        : 'GPU VRAM spike and pipeline queue delay.'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-emerald-400 font-medium text-center py-2">
                  ✓ All active workloads are running within their SLA target times.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}