export interface CognitiveAssessment {
  id: string;
  timestamp: Date;
  type: 'memory' | 'attention' | 'executive' | 'recognition' | 'reaction';
  score: number; // 0-100
  duration: number; // ms
  errors: number;
  hesitations: number;
  difficulty: 'easy' | 'medium' | 'hard';
  metadata?: Record<string, any>;
}

export interface CognitiveIndex {
  date: Date;
  stabilityIndex: number; // 0-100
  declineIndex: number; // 0-100
  engagementIndex: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'stable' | 'declining';
}

export interface BehaviorLog {
  id: string;
  timestamp: Date;
  type: 'confusion' | 'agitation' | 'apathy' | 'disorientation' | 'sundowning' | 'fall' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  duration?: number; // minutes
  triggers?: string[];
  notes?: string;
  reportedBy: 'patient' | 'caregiver' | 'system';
}

export interface VitalSign {
  timestamp: Date;
  type: 'heart_rate' | 'hrv' | 'sleep' | 'steps' | 'activity' | 'sleep_stage';
  value: number;
  unit: string;
  source: 'healthkit' | 'health_connect' | 'manual';
  metadata?: {
    sleepStage?: 'awake' | 'light' | 'deep' | 'rem';
    activityType?: string;
    quality?: number;
  };
}

export interface SleepData {
  date: Date;
  totalDuration: number; // minutes
  efficiency: number; // percentage
  stages: {
    awake: number;
    light: number;
    deep: number;
    rem: number;
  };
  bedTime: Date;
  wakeTime: Date;
  interruptions: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed';
  times: string[]; // HH:mm
  purpose: string;
  active: boolean;
  adherence?: {
    taken: number;
    missed: number;
    lastTaken?: Date;
  };
}

export interface CaregiverNote {
  id: string;
  timestamp: Date;
  category: 'observation' | 'concern' | 'improvement' | 'routine' | 'medical';
  content: string;
  tags?: string[];
  attachments?: string[];
}

export interface TherapySession {
  id: string;
  timestamp: Date;
  type: 'memory' | 'attention' | 'language' | 'visual' | 'executive';
  duration: number; // seconds
  score: number;
  completed: boolean;
  enjoyment?: number; // 1-5
}
