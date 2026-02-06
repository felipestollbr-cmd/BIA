import { healthService } from './healthService';
import { useNeuroStore } from '@/store/neuroStore';

/**
 * Background sync service for HealthKit/Health Connect data
 * This would run periodically to fetch latest health data
 */
class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  async startBackgroundSync(intervalMinutes: number = 30) {
    // Initialize health service
    const initialized = await healthService.initialize();
    if (!initialized) {
      console.warn('Health service not available');
      return;
    }

    // Request permissions if not granted
    const permissionsGranted = await healthService.requestPermissions();
    if (!permissionsGranted) {
      console.warn('Health permissions not granted');
      return;
    }

    // Start periodic sync
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, intervalMinutes * 60 * 1000);

    // Perform initial sync
    await this.performSync();
  }

  async performSync() {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    this.isSyncing = true;
    
    try {
      console.log('Starting health data sync...');
      
      const data = await healthService.syncAll();
      
      // Add to store
      const store = useNeuroStore.getState();
      
      // Add steps
      data.steps.forEach(vital => store.addVitalSign(vital));
      
      // Add heart rate
      data.heartRate.forEach(vital => store.addVitalSign(vital));
      
      // Add HRV
      data.hrv.forEach(vital => store.addVitalSign(vital));
      
      // Sleep data is handled separately in the store
      if (data.sleep) {
        // In production, this would update sleepData in store
        console.log('Sleep data synced:', data.sleep);
      }

      console.log('Health data sync completed');
      
      // Send to SUZI backend (shared database)
      await this.syncToBackend({
        timestamp: new Date(),
        vitals: [...data.steps, ...data.heartRate, ...data.hrv],
        sleep: data.sleep,
        deviceInfo: {
          platform: 'ios', // or 'android'
          source: 'healthkit' // or 'health_connect'
        }
      });
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async syncToBackend(data: any) {
    // BIA → SUZI unified database
    // O NeuroTrack-BIA é um coletor de dados para o ecossistema SUZI
    // Todos os dados são compartilhados no mesmo banco
    
    console.log('📤 Syncing to SUZI unified database:', {
      dataPoints: data.vitals.length,
      timestamp: data.timestamp,
      source: 'NeuroTrack-BIA'
    });

    try {
      // Enviar dados vitais do HealthKit/Health Connect
      const response = await fetch('https://api.suzi.health/v1/bia/sync-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getUserToken()}`,
          'X-Source-App': 'NeuroTrack-BIA',
          'X-Data-Type': 'vitals'
        },
        body: JSON.stringify({
          user_id: data.userId,
          timestamp: data.timestamp,
          vitals: data.vitals,
          sleep: data.sleep,
          device_info: data.deviceInfo,
          app_version: '1.0.0'
        })
      });
      
      if (!response.ok) {
        throw new Error('Backend sync failed');
      }
      
      const result = await response.json();
      console.log('✅ Data synced to SUZI successfully:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Backend sync error:', error);
      // Queue for retry
      await this.queueForRetry(data);
    }
  }
  
  async syncCognitiveAssessment(assessment: any) {
    // Enviar avaliações cognitivas para orquestração
    console.log('📤 Syncing cognitive assessment to SUZI');
    
    try {
      const response = await fetch('https://api.suzi.health/v1/bia/sync-cognitive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getUserToken()}`,
          'X-Source-App': 'NeuroTrack-BIA'
        },
        body: JSON.stringify(assessment)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cognitive data synced:', result);
        return result;
      }
    } catch (error) {
      console.error('❌ Cognitive sync error:', error);
    }
  }
  
  async syncBehaviorEvent(event: any) {
    // Enviar eventos comportamentais
    console.log('📤 Syncing behavior event to SUZI');
    
    try {
      const response = await fetch('https://api.suzi.health/v1/bia/sync-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getUserToken()}`,
          'X-Source-App': 'NeuroTrack-BIA'
        },
        body: JSON.stringify(event)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Behavior event synced:', result);
        return result;
      }
    } catch (error) {
      console.error('❌ Behavior sync error:', error);
    }
  }

  async queueForRetry(data: any) {
    // Store failed syncs locally for retry
    // In production, use AsyncStorage or SQLite
    console.log('Queuing data for retry:', data.timestamp);
  }

  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async manualSync() {
    await this.performSync();
  }
}

export const syncService = new SyncService();
