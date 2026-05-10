import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  CoreNumbers,
  MatrixData,
  MoneyCode,
  PersonalCycleData,
  calculateCoreNumbers,
  calculateMatrix,
  calculateMoneyCode,
  calculatePersonalCycles,
} from '@/services/calculations';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface SavedReport {
  id: string;
  name: string;
  dateOfBirth: string;
  createdAt: string;
  type: 'personal' | 'compatibility';
  core?: CoreNumbers;
  isPremium?: boolean;
}

export interface CalculationSession {
  name: string;
  dateOfBirth: string;
  gender?: string;
  placeOfBirth?: string;
  intention?: string;
  core: CoreNumbers;
  matrix: MatrixData;
  money: MoneyCode;
  cycles: PersonalCycleData;
}

export type PremiumModule = 'full_report' | 'deep_matrix' | 'full_cycles' | 'money_deep';

interface AppContextType {
  user: UserProfile | null;
  isOnboarded: boolean;
  currentSession: CalculationSession | null;
  savedReports: SavedReport[];
  isPremium: boolean;
  unlockedModules: Set<PremiumModule>;

  login: (email: string, isGuest?: boolean) => void;
  logout: () => void;
  completeOnboarding: () => void;
  runCalculation: (
    name: string, dateOfBirth: string,
    gender?: string, placeOfBirth?: string, intention?: string
  ) => CalculationSession | null;
  saveCurrentReport: () => void;
  deleteReport: (id: string) => void;
  unlockPremium: () => void;
  unlockModule: (module: PremiumModule) => void;
  isModuleUnlocked: (module: PremiumModule) => boolean;
  trackEvent: (name: string, props?: Record<string, any>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentSession, setCurrentSession] = useState<CalculationSession | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [unlockedModules, setUnlockedModules] = useState<Set<PremiumModule>>(new Set());

  const trackEvent = useCallback((name: string, props?: Record<string, any>) => {
    if (__DEV__) console.log(`[Analytics] ${name}`, props ?? {});
  }, []);

  const login = useCallback((email: string, isGuest = false) => {
    setUser({
      id: isGuest ? `guest_${Date.now()}` : email,
      name: isGuest ? 'Гость' : email.split('@')[0],
      email: isGuest ? undefined : email,
      isGuest,
    });
    setIsOnboarded(true);
    trackEvent(isGuest ? 'auth_guest_selected' : 'auth_email_started');
  }, [trackEvent]);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentSession(null);
    setIsPremium(false);
    setUnlockedModules(new Set());
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    trackEvent('onboarding_completed');
  }, [trackEvent]);

  const runCalculation = useCallback((
    name: string, dateOfBirth: string,
    gender?: string, placeOfBirth?: string, intention?: string
  ): CalculationSession | null => {
    trackEvent('calculation_started', { dateOfBirth });
    const parts = dateOfBirth.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const core = calculateCoreNumbers(day, month, year);
    const matrix = calculateMatrix(core);
    const money = calculateMoneyCode(day, month, year);
    const cycles = calculatePersonalCycles(day, month, 2026, new Date().getMonth() + 1);

    const session: CalculationSession = {
      name: name.trim() || 'Ваш код',
      dateOfBirth, gender, placeOfBirth, intention,
      core, matrix, money, cycles,
    };
    setCurrentSession(session);
    trackEvent('calculation_completed', {
      soul: core.soulFinal, expression: core.expressionFinal,
      path: core.pathFinal, direction: core.directionFinal, result: core.resultFinal,
    });
    return session;
  }, [trackEvent]);

  const saveCurrentReport = useCallback(() => {
    if (!currentSession) return;
    const report: SavedReport = {
      id: Date.now().toString(),
      name: currentSession.name,
      dateOfBirth: currentSession.dateOfBirth,
      createdAt: new Date().toISOString().split('T')[0],
      type: 'personal',
      core: currentSession.core,
      isPremium,
    };
    setSavedReports(prev => {
      const exists = prev.some(r => r.name === report.name && r.dateOfBirth === report.dateOfBirth);
      if (exists) return prev;
      return [report, ...prev];
    });
    trackEvent('report_saved', { name: report.name });
  }, [currentSession, isPremium, trackEvent]);

  const deleteReport = useCallback((id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
  }, []);

  const unlockPremium = useCallback(() => {
    setIsPremium(true);
    setUnlockedModules(new Set(['full_report', 'deep_matrix', 'full_cycles', 'money_deep']));
    trackEvent('purchase_success', { product: 'big_report' });
  }, [trackEvent]);

  const unlockModule = useCallback((module: PremiumModule) => {
    setUnlockedModules(prev => new Set([...prev, module]));
  }, []);

  const isModuleUnlocked = useCallback((module: PremiumModule): boolean => {
    return isPremium || unlockedModules.has(module);
  }, [isPremium, unlockedModules]);

  return (
    <AppContext.Provider value={{
      user, isOnboarded, currentSession, savedReports, isPremium, unlockedModules,
      login, logout, completeOnboarding, runCalculation,
      saveCurrentReport, deleteReport, unlockPremium, unlockModule,
      isModuleUnlocked, trackEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
}
