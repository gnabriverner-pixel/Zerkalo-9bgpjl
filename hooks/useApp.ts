import { useContext } from 'react';
import { AppContext, PremiumModule } from '@/contexts/AppContext';

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function usePremiumGate(module: PremiumModule) {
  const { isModuleUnlocked, isPremium } = useApp();
  return {
    isLocked: !isModuleUnlocked(module),
    isPremium,
  };
}
