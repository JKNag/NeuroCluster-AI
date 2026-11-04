import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PatientPortal from './components/PatientPortal';

// Tiny hash-based routing: "#/patient" = patient portal, anything else = hospital dashboard.
const viewFromHash = () => (window.location.hash === '#/patient' ? 'patient' : 'dashboard');

export default function App() {
  const [view, setView] = useState(viewFromHash);

  useEffect(() => {
    const onHashChange = () => {
      setView(viewFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const go = (v) => {
    window.location.hash = v === 'patient' ? '#/patient' : '#/';
  };

  return view === 'patient'
    ? <PatientPortal onBack={() => go('dashboard')} />
    : <Dashboard onOpenPatient={() => go('patient')} />;
}
