import { Platform } from 'react-native';
import { VitalSign, SleepData } from '@/types/neuro';

// Types for HealthKit/Health Connect data
export interface HealthKitPermissions {
  steps: boolean;
  heartRate: boolean;
  sleep: boolean;
  activity: boolean;
  hrv: boolean;
}

class HealthService {
  private isAvailable: boolean = false;
  private permissions: HealthKitPermissions = {
    steps: false,
    heartRate: false,
    sleep: false,
    activity: false,
    hrv: false
  };

  async initialize(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // In production: import AppleHealthKit from 'expo-apple-health';
        // const available = await AppleHealthKit.isAvailable();
        this.isAvailable = true; // Simulated
      } else if (Platform.OS === 'android') {
        // In production: import HealthConnect from 'react-native-health-connect';
        // const available = await HealthConnect.isAvailable();
        this.isAvailable = true; // Simulated
      }
      return this.isAvailable;
    } catch (error) {
      console.error('Health service initialization failed:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // Request HealthKit permissions
        const permissions = {
          read: [
            'Steps',
            'HeartRate',
            'HeartRateVariability',
            'SleepAnalysis',
            'ActivitySummary',
            'DistanceWalkingRunning'
          ]
        };
        
        // Simulated - in production:
        // await AppleHealthKit.requestAuthorization(permissions);
        this.permissions = {
          steps: true,
          heartRate: true,
          sleep: true,
          activity: true,
          hrv: true
        };
      } else if (Platform.OS === 'android') {
        // Request Health Connect permissions
        const permissions = [
          'android.permission.health.READ_STEPS',
          'android.permission.health.READ_HEART_RATE',
          'android.permission.health.READ_SLEEP',
          'android.permission.health.READ_DISTANCE'
        ];
        
        // Simulated - in production:
        // await HealthConnect.requestPermissions(permissions);
        this.permissions = {
          steps: true,
          heartRate: true,
          sleep: true,
          activity: true,
          hrv: true
        };
      }
      
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async getSteps(startDate: Date, endDate: Date): Promise<VitalSign[]> {
    if (!this.permissions.steps) {
      throw new Error('Steps permission not granted');
    }

    // Simulated data - in production, fetch from HealthKit/Health Connect
    const mockData: VitalSign[] = [
      {
        timestamp: new Date(),
        type: 'steps',
        value: 8450,
        unit: 'steps',
        source: Platform.OS === 'ios' ? 'healthkit' : 'health_connect'
      }
    ];

    return mockData;
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<VitalSign[]> {
    if (!this.permissions.heartRate) {
      throw new Error('Heart rate permission not granted');
    }

    // Simulated data
    const mockData: VitalSign[] = [
      {
        timestamp: new Date(),
        type: 'heart_rate',
        value: 72,
        unit: 'bpm',
        source: Platform.OS === 'ios' ? 'healthkit' : 'health_connect'
      }
    ];

    return mockData;
  }

  async getHRV(startDate: Date, endDate: Date): Promise<VitalSign[]> {
    if (!this.permissions.hrv) {
      throw new Error('HRV permission not granted');
    }

    // Simulated data
    const mockData: VitalSign[] = [
      {
        timestamp: new Date(),
        type: 'hrv',
        value: 45,
        unit: 'ms',
        source: Platform.OS === 'ios' ? 'healthkit' : 'health_connect'
      }
    ];

    return mockData;
  }

  async getSleepData(date: Date): Promise<SleepData | null> {
    if (!this.permissions.sleep) {
      throw new Error('Sleep permission not granted');
    }

    // Simulated data
    const mockData: SleepData = {
      date,
      totalDuration: 420, // 7 hours
      efficiency: 85,
      stages: {
        awake: 30,
        light: 180,
        deep: 150,
        rem: 60
      },
      bedTime: new Date(date.setHours(22, 30)),
      wakeTime: new Date(date.setHours(6, 30)),
      interruptions: 2
    };

    return mockData;
  }

  async syncAll(): Promise<{
    steps: VitalSign[];
    heartRate: VitalSign[];
    hrv: VitalSign[];
    sleep: SleepData | null;
  }> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [steps, heartRate, hrv, sleep] = await Promise.all([
      this.getSteps(yesterday, now),
      this.getHeartRate(yesterday, now),
      this.getHRV(yesterday, now),
      this.getSleepData(yesterday)
    ]);

    return { steps, heartRate, hrv, sleep };
  }

  getPermissionStatus(): HealthKitPermissions {
    return this.permissions;
  }

  isServiceAvailable(): boolean {
    return this.isAvailable;
  }
}

export const healthService = new HealthService();

// Normalization utilities
export const normalizeHealthData = (data: any, source: 'healthkit' | 'health_connect'): VitalSign[] => {
  // Normalize different formats from HealthKit and Health Connect
  // This is a simplified version - production would handle various edge cases
  
  if (source === 'healthkit') {
    // HealthKit uses specific formats
    return data.map((item: any) => ({
      timestamp: new Date(item.startDate),
      type: mapHealthKitType(item.type),
      value: item.value,
      unit: item.unit,
      source: 'healthkit' as const,
      metadata: item.metadata
    }));
  } else {
    // Health Connect uses different structure
    return data.map((item: any) => ({
      timestamp: new Date(item.time),
      type: mapHealthConnectType(item.type),
      value: item.value,
      unit: item.unit,
      source: 'health_connect' as const,
      metadata: item.metadata
    }));
  }
};

const mapHealthKitType = (type: string): VitalSign['type'] => {
  const mapping: Record<string, VitalSign['type']> = {
    'HKQuantityTypeIdentifierStepCount': 'steps',
    'HKQuantityTypeIdentifierHeartRate': 'heart_rate',
    'HKQuantityTypeIdentifierHeartRateVariabilitySDNN': 'hrv',
    'HKCategoryTypeIdentifierSleepAnalysis': 'sleep'
  };
  return mapping[type] || 'heart_rate';
};

const mapHealthConnectType = (type: string): VitalSign['type'] => {
  const mapping: Record<string, VitalSign['type']> = {
    'Steps': 'steps',
    'HeartRate': 'heart_rate',
    'HeartRateVariability': 'hrv',
    'SleepSession': 'sleep'
  };
  return mapping[type] || 'heart_rate';
};
