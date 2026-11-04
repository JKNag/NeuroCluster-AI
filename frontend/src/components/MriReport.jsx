import { useRef, useState } from 'react';
import { Printer, Download, Cpu, Image as ImageIcon, Languages } from 'lucide-react';
import { LABELS, getReportBody, confidenceBand } from '../lib/reportContent';

// Renders **bold** segments
function RichText({ text }) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>));
}

function Row({ label, children }) {
  return (
    <li className="leading-relaxed">
      <strong>{label}:</strong> {children}
    </li>
  );
}

export default function MriReport({ report, lang, onLangChange }) {
  const paperRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const t = LABELS[lang];
  const body = getReportBody(report.classKey, lang, report.label);
  const band = confidenceBand(report.confidence);
  const confText = band === 'High' ? t.confHigh : band === 'Mid' ? t.confMid : t.confLow;
  const genderText = t.genders[report.gender] || report.gender;
  const dateLocale = lang === 'bn' ? 'bn-BD' : 'en-GB';
  const dateText = new Date(report.createdAt).toLocaleString(dateLocale, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setDownloading(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      await html2pdf()
        .set({
          margin: 8,
          filename: `NeuroCluster-Report-${report.reportId}-${lang}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css'] },
        })
        .from(paperRef.current)
        .save();
    } catch (err) {
      console.error(err);
      alert('Could not create PDF. Please use Print and choose "Save as PDF".');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar (screen only) */}
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-indigo-400" />
          <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">
            {[['en', 'English'], ['bn', 'বাংলা']].map(([code, name]) => (
              <button
                key={code}
                type="button"
                onClick={() => onLangChange(code)}
                className={`px-3 py-1.5 transition cursor-pointer ${
                  lang === code ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-medium border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 text-xs font-medium disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Paper */}
      <div
        id="report-print-area"
        ref={paperRef}
        className={`report-paper relative bg-white text-slate-900 rounded-xl p-6 sm:p-8 text-[13px] shadow-xl ${lang === 'bn' ? 'font-bangla' : ''}`}
      >
        {/* watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none overflow-hidden">
          <span className="text-6xl font-black -rotate-[30deg] tracking-widest text-indigo-950 whitespace-nowrap">
            NEUROCLUSTER AI
          </span>
        </div>

        <div className="relative z-10 space-y-5">
          {/* Letterhead */}
          <div className="flex items-start justify-between gap-3 border-b-2 border-slate-300 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <h1 className="text-sm sm:text-base font-extrabold leading-snug">{t.title}</h1>
            </div>
            <div className="text-[10px] text-slate-600 text-right shrink-0 leading-relaxed">
              <div>{t.reportId}: <strong>{report.reportId}</strong></div>
              <div>{t.reportDate}: <strong>{dateText}</strong></div>
            </div>
          </div>

          {/* Patient + module */}
          <ul className="list-disc pl-5 space-y-1">
            <Row label={t.patientName}>{report.patientName}</Row>
            <Row label={t.age}>{report.age}</Row>
            <Row label={t.gender}>{genderText}</Row>
          </ul>
          <ul className="list-disc pl-5 space-y-1">
            <Row label={t.platformModule}>{t.moduleValue}</Row>
            <Row label={t.studyType}>{t.studyValue}</Row>
            <Row label={t.timestamp}>{t.timestampValue}</Row>
          </ul>

          {/* Image Inspection Window */}
          {report.previewUrl && (
            <div className="space-y-1.5 break-inside-avoid">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> {t.inspection}
              </div>
              <div className="relative w-full h-56 bg-slate-950 rounded-lg overflow-hidden border border-slate-400 flex items-center justify-center">
                <img src={report.previewUrl} alt="MRI" className="max-h-full max-w-full object-contain" />
                {report.isTumor && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 border-2 border-rose-500 bg-rose-500/20 rounded relative">
                      <span className="absolute -top-4 left-0 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                        ROI: Anomaly ({report.confidence.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1 */}
          <section className="break-inside-avoid">
            <h2 className="font-bold mb-1">{t.s1}</h2>
            <ul className="list-disc pl-5 space-y-1">
              <Row label={t.modality}>{t.modalityValue}</Row>
              <Row label={t.sequence}>{t.sequenceValue}</Row>
              <Row label={t.confidence}>{confText} ({report.confidence.toFixed(1)}%)</Row>
            </ul>
          </section>

          {/* 2 */}
          <section className="break-inside-avoid">
            <h2 className="font-bold mb-1">{t.s2}</h2>
            <ul className="list-disc pl-5 space-y-1">
              <Row label={t.lesion}>{body.lesion}</Row>
              <Row label={t.location}>{body.location}</Row>
              <Row label={t.massEffect}>{body.massEffect}</Row>
              <Row label={t.ventricles}>{body.ventricles}</Row>
            </ul>
          </section>

          {/* 3 */}
          <section className="break-inside-avoid">
            <h2 className="font-bold mb-1">{t.s3}</h2>
            <ul className="list-disc pl-5 space-y-1">
              <Row label={t.primary}><RichText text={body.primary} /></Row>
              <Row label={t.differential}>{body.differential}</Row>
            </ul>
          </section>

          {/* 4 */}
          <section className="break-inside-avoid">
            <h2 className="font-bold mb-1">{t.s4}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {body.recs.map((r, i) => (
                <li key={i} className="leading-relaxed"><RichText text={r} /></li>
              ))}
            </ul>
          </section>

          <p className="border-t border-slate-300 pt-3 text-[11px] text-slate-700 leading-relaxed break-inside-avoid">
            <strong>{t.disclaimerLabel}</strong> {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
