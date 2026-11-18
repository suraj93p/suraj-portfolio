import { useState } from 'react';
import type { ExperienceDisplay } from '../models/portfolio.selectors';

export function useExperienceController(items: readonly ExperienceDisplay[]) {
  const [selectedCompanyId, selectCompany] = useState('all');
  return {
    selectedCompanyId, selectCompany,
    visibleExperience: selectedCompanyId === 'all' ? items : items.filter((item) => item.id === selectedCompanyId),
    reset: () => selectCompany('all')
  };
}
