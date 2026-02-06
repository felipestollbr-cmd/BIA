import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CognitiveAssessment, 
  BehaviorLog, 
  VitalSign, 
  Medication,
  CognitiveIndex,
  SleepData,
  CaregiverNote,
  TherapySession
} from '@/types/neuro';

interface NeuroStore {
  // Cognitive
  assessments: CognitiveAssessment[];
  currentIndex: CognitiveIndex | null;
  
  // Behavior
  behaviorLogs: BehaviorLog[];
  
  // Vitals
  vitalSigns: VitalSign[];
  sleepData: SleepData[];
  
  // Medication
  medications: Medication[];
  
  // Caregiver
  caregiverNotes: CaregiverNote[];
  
  // Therapy
  therapySessions: TherapySession[];
  
  // Actions
  addAssessment: (assessment: CognitiveAssessment) => void;
  addBehaviorLog: (log: BehaviorLog) => void;
  addVitalSign: (vital: VitalSign) => void;
  addMedication: (med: Medication) => void;
  updateMedicationAdherence: (id: string, taken: boolean) => void;
  addCaregiverNote: (note: CaregiverNote) => void;
  addTherapySession: (session: TherapySession) => void;
  syncWithHealthKit: () => Promise<void>;
  calculateIndices: () => void;
}

export const useNeuroStore = create<NeuroStore>((set, get) => ({
  assessments: [],
  currentIndex: null,
  behaviorLogs: [],
  vitalSigns: [],
  sleepData: [],
  medications: [
    {
      id: '1',
      name: 'Donepezila',
      dosage: '10mg',
      frequency: 'daily',
      times: ['08:00'],
      purpose: 'Memória e cognição',
      active: true,
      adherence: { taken: 28, missed: 2 }
    },
    {
      id: '2',
      name: 'Memantina',
      dosage: '20mg',
      frequency: 'daily',
      times: ['20:00'],
      purpose: 'Neuroproteção',
      active: true,
      adherence: { taken: 27, missed: 3 }
    }
  ],
  caregiverNotes: [],
  therapySessions: [],

  addAssessment: (assessment) => {
    set((state) => ({
      assessments: [assessment, ...state.assessments]
    }));
    get().calculateIndices();
  },

  addBehaviorLog: (log) => {
    set((state) => ({
      behaviorLogs: [log, ...state.behaviorLogs]
    }));
  },

  addVitalSign: (vital) => {
    set((state) => ({
      vitalSigns: [vital, ...state.vitalSigns]
    }));
  },

  addMedication: (med) => {
    set((state) => ({
      medications: [...state.medications, med]
    }));
  },

  updateMedicationAdherence: (id, taken) => {
    set((state) => ({
      medications: state.medications.map(med => 
        med.id === id 
          ? {
              ...med,
              adherence: {
                taken: taken ? (med.adherence?.taken || 0) + 1 : med.adherence?.taken || 0,
                missed: !taken ? (med.adherence?.missed || 0) + 1 : med.adherence?.missed || 0,
                lastTaken: taken ? new Date() : med.adherence?.lastTaken
              }
            }
          : med
      )
    }));
  },

  addCaregiverNote: (note) => {
    set((state) => ({
      caregiverNotes: [note, ...state.caregiverNotes]
    }));
  },

  addTherapySession: (session) => {
    set((state) => ({
      therapySessions: [session, ...state.therapySessions]
    }));
  },

  syncWithHealthKit: async () => {
    // This will be implemented with actual HealthKit/Health Connect integration
    console.log('Syncing with HealthKit...');
  },

  calculateIndices: () => {
    const { assessments, behaviorLogs, vitalSigns } = get();
    
    if (assessments.length === 0) return;

    // Simple calculation - in production this would be more sophisticated
    const recentAssessments = assessments.slice(0, 7);
    const avgScore = recentAssessments.reduce((sum, a) => sum + a.score, 0) / recentAssessments.length;
    
    const stabilityIndex = Math.round(avgScore);
    const declineIndex = recentAssessments.length > 1 
      ? Math.round(Math.abs(recentAssessments[0].score - recentAssessments[recentAssessments.length - 1].score))
      : 0;
    const engagementIndex = Math.round((recentAssessments.filter(a => a.score > 70).length / recentAssessments.length) * 100);

    const riskLevel: 'low' | 'medium' | 'high' = 
      declineIndex > 20 ? 'high' : declineIndex > 10 ? 'medium' : 'low';

    const trend: 'improving' | 'stable' | 'declining' = 
      declineIndex > 15 ? 'declining' : declineIndex < 5 ? 'improving' : 'stable';

    set({
      currentIndex: {
        date: new Date(),
        stabilityIndex,
        declineIndex,
        engagementIndex,
        riskLevel,
        trend
      }
    });
  }
}));
