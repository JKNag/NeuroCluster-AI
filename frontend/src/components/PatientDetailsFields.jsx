import { User, Calendar, Users, Languages } from 'lucide-react';

const inputCls =
  'w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 placeholder:text-slate-600';
const labelCls = 'block text-xs font-medium text-slate-400 mb-1';

/** Shared form fields: Patient Name, Age, Gender, Report Language. Controlled by `value` / `onChange`. */
export default function PatientDetailsFields({ value, onChange, compact = false }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });

  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls}><User className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Patient Name</label>
        <input
          type="text" required value={value.name} onChange={set('name')}
          placeholder="Enter full name" className={inputCls}
        />
      </div>

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div>
          <label className={labelCls}><Calendar className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Age</label>
          <input
            type="number" required min="0" max="120" value={value.age} onChange={set('age')}
            placeholder="Years" className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}><Users className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Gender</label>
          <select required value={value.gender} onChange={set('gender')} className={`${inputCls} cursor-pointer`}>
            <option value="" disabled>Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}><Languages className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Report Language</label>
        <div className="grid grid-cols-2 gap-2">
          {[['en', 'English'], ['bn', 'বাংলা (Bangla)']].map(([code, name]) => (
            <button
              key={code} type="button" onClick={() => onChange({ ...value, lang: code })}
              className={`py-2.5 rounded-lg text-sm border transition cursor-pointer ${
                value.lang === code
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const emptyPatient = { name: '', age: '', gender: '', lang: 'en' };
