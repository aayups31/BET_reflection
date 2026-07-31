import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ExperienceContextValue = {
  reducedMotion: boolean;
  toggleMotion: () => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function systemPrefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(systemPrefersReducedMotion);
  const [manualReduced, setManualReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setSystemReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const reducedMotion = manualReduced ?? systemReduced;
  const value = useMemo(
    () => ({
      reducedMotion,
      toggleMotion: () => setManualReduced((current) => !(current ?? systemReduced)),
    }),
    [reducedMotion, systemReduced],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error('useExperience must be used inside ExperienceProvider');
  return value;
}
