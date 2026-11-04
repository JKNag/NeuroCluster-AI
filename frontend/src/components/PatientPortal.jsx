import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Cpu, Upload, ArrowRight, ArrowLeft, Scan, Sparkles, ShieldCheck,
  FileText, ClipboardList, X, Info,
} from 'lucide-react';
import PatientDetailsFields, { emptyPatient } from './PatientDetailsFields';
import MriReport from './MriReport';
import { buildReport } from '../lib/buildReport';
import { API_BASE } from '../lib/config';

const steps = [
  { icon: Upload, title: 'Upload MRI', text: 'Add your brain MRI image (JPG / PNG).' },
  { icon: ClipboardList, title: 'Your details', text: 'Name, age, gender and report language.' },
  { icon: FileText, title: 'Get report', text: 'View, print or download your AI report.' },
];

export default function PatientPortal({ onBack }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [patient, setPatient] = useState(emptyPatient);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const uploadRef = useRef(null);
  const reportRef = useRef(null);
  const inputRef = useRef(null);

  // free object URL on change/unmount
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file (JPG, JPEG or PNG).');
      return;
    }
    setError('');
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setReport(null);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setReport(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload your MRI image first.'); return; }
    setError('');
    setLoading(true);
    setReport(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API_BASE}/api/patient/analyze-mri`, fd);
      setReport(buildReport({ apiResult: res.data, patient, previewUrl, filename: file.name }));
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        'Could not analyze the scan. Please check that the backend is running and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans print:bg-white print:text-slate-900">
      {/* Top bar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">NeuroCluster AI</h1>
            <p className="text-xs text-slate-400">Patient Portal</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Hospital Dashboard
        </button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center px-6 pt-14 pb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> For patients · No hospital login needed
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">Brain MRI AI Read</h2>
          <p className="text-3xl sm:text-4xl font-extrabold mt-1 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Instant AI Analysis & Report
          </p>
          <p className="text-slate-400 mt-5 text-sm sm:text-base max-w-xl mx-auto">
            Upload your brain MRI image and get an AI-generated report in English or Bangla —
            without needing extensive medical knowledge.
          </p>
          <button
            onClick={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Analyze Your MRI Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <Icon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <p className="text-xs text-slate-400">{text}</p>
          </div>
        ))}
      </section>

      {/* Upload + details */}
      <section ref={uploadRef} className="max-w-xl mx-auto px-6 pt-10 pb-6 scroll-mt-6 print:hidden">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-lg font-semibold">Brain MRI</h3>

          {/* Dropzone */}
          {!previewUrl ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]); }}
              className={`h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition ${
                dragOver ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-900 hover:border-indigo-500/60'
              }`}
            >
              <Upload className="w-10 h-10 text-indigo-400 mb-3" />
              <p className="text-sm text-slate-200">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">JPG, JPEG or PNG supported</p>
            </div>
          ) : (
            <div className="relative h-56 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden">
              <img src={previewUrl} alt="MRI preview" className="max-h-full max-w-full object-contain" />
              <button
                type="button" onClick={clearFile} aria-label="Remove image"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 border border-slate-700 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300 max-w-[80%] truncate">
                {file?.name}
              </span>
            </div>
          )}
          <input
            ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />

          {/* Patient details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-400" /> Patient details (printed on your report)
            </h3>
            <PatientDetailsFields value={patient} onChange={setPatient} />
          </div>

          {error && (
            <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (<><Scan className="w-4 h-4 animate-spin" /> Analyzing…</>) : (<>AI Read & Generate Report</>)}
          </button>

          <p className="flex gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-slate-500" />
            This is an AI-generated prototype report for reference only. It is not a medical diagnosis —
            please consult a qualified doctor. <ShieldCheck className="inline w-3.5 h-3.5 -mt-0.5" /> Your image
            and details are used only to build this report on screen and are not saved.
          </p>
        </form>
      </section>

      {/* Report */}
      {report && (
        <section ref={reportRef} className="max-w-3xl mx-auto px-6 pb-16 scroll-mt-6 print:p-0 print:max-w-none">
          <h3 className="text-lg font-semibold mb-3 print:hidden">Your AI Report</h3>
          <MriReport
            report={report}
            lang={patient.lang}
            onLangChange={(lang) => setPatient((p) => ({ ...p, lang }))}
          />
        </section>
      )}
    </div>
  );
}
