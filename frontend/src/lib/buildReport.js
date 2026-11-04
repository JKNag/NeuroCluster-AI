import { classifyLabel } from './reportContent';

/** Combine the AI result + patient details into one report object used by <MriReport />. */
export function buildReport({ apiResult, patient, previewUrl, filename }) {
  const ai = apiResult?.mri_ai_result || {};
  const label = ai.label ? String(ai.label) : 'no_tumor';
  const classKey = classifyLabel(label);
  const confidence = Math.max(0, Math.min(100, (Number(ai.confidence) || 0) * 100));

  return {
    reportId: `NC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
    patientName: patient.name.trim(),
    age: patient.age,
    gender: patient.gender,
    label,
    classKey,
    isTumor: classKey !== 'notumor',
    confidence,
    previewUrl,
    filename,
    allocatedGpu: apiResult?.allocated_gpu,
    processingTimeSec: apiResult?.processing_time_sec,
  };
}
