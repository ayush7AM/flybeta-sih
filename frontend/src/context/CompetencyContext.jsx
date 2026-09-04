import { createContext, useContext, useState, useEffect } from 'react';

const CompetencyContext = createContext(null);

export function CompetencyProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mospi_competency_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load competency profile', e);
    }
    setIsLoaded(true);
  }, []);

  const saveProfile = (newProfile) => {
    const profileWithMeta = {
      ...newProfile,
      completedAt: new Date().toISOString()
    };
    setProfile(profileWithMeta);
    localStorage.setItem('mospi_competency_profile', JSON.stringify(profileWithMeta));
  };

  const hasCompletedDiagnostic = !!profile;
  const userDesignation = profile?.designation || null;
  const userDivision = profile?.division || null;
  const yearsOfService = profile?.yearsOfService || null;
  const previousTrainings = profile?.previousTrainings || [];

  return (
    <CompetencyContext.Provider value={{ 
      profile, 
      saveProfile, 
      hasCompletedDiagnostic, 
      isLoaded,
      userDesignation,
      userDivision,
      yearsOfService,
      previousTrainings,
    }}>
      {children}
    </CompetencyContext.Provider>
  );
}

export function useCompetency() {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
}
