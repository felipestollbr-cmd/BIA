import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNeuroStore } from '@/store/neuroStore';
import { syncService } from '@/services/syncService';
import { CognitiveIndexCard } from '@/components/CognitiveIndexCard';
import { VitalSignCard } from '@/components/VitalSignCard';

export default function HomeScreen() {
  const { currentIndex, vitalSigns } = useNeuroStore();

  useEffect(() => {
    // Start background sync when app opens
    syncService.startBackgroundSync(30); // Every 30 minutes

    return () => {
      syncService.stopBackgroundSync();
    };
  }, []);

  const handleManualSync = async () => {
    await syncService.manualSync();
  };

  const latestVitals = {
    heartRate: vitalSigns.find(v => v.type === 'heart_rate'),
    hrv: vitalSigns.find(v => v.type === 'hrv'),
    steps: vitalSigns.find(v => v.type === 'steps'),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá</Text>
            <Text style={styles.patientName}>Maria Silva</Text>
          </View>
          <TouchableOpacity style={styles.syncButton} onPress={handleManualSync}>
            <Text style={styles.syncIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Cognitive Indices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Índices Cognitivos</Text>
          
          {currentIndex ? (
            <>
              <CognitiveIndexCard
                title="Índice de Estabilidade"
                value={currentIndex.stabilityIndex}
                trend={currentIndex.trend}
                subtitle="Desempenho cognitivo geral"
              />
              <CognitiveIndexCard
                title="Índice de Engajamento"
                value={currentIndex.engagementIndex}
                trend={currentIndex.trend}
                subtitle="Participação em atividades"
              />
              <View style={[styles.riskBadge, { 
                backgroundColor: 
                  currentIndex.riskLevel === 'low' ? '#10b98120' :
                  currentIndex.riskLevel === 'medium' ? '#f59e0b20' :
                  '#ef444420'
              }]}>
                <Text style={[styles.riskText, {
                  color:
                    currentIndex.riskLevel === 'low' ? '#10b981' :
                    currentIndex.riskLevel === 'medium' ? '#f59e0b' :
                    '#ef4444'
                }]}>
                  Risco de descompensação: {
                    currentIndex.riskLevel === 'low' ? 'Baixo' :
                    currentIndex.riskLevel === 'medium' ? 'Médio' :
                    'Alto'
                  }
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🧠</Text>
              <Text style={styles.emptyText}>
                Realize um microteste para gerar seus índices cognitivos
              </Text>
              <TouchableOpacity style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Iniciar Teste</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Vital Signs from HealthKit/Health Connect */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sinais Vitais</Text>
            <Text style={styles.sectionSubtitle}>Integrado com sensores</Text>
          </View>

          {latestVitals.heartRate && (
            <VitalSignCard
              icon="❤️"
              title="Frequência Cardíaca"
              value={latestVitals.heartRate.value.toString()}
              unit="bpm"
              source={latestVitals.heartRate.source}
              timestamp={new Date(latestVitals.heartRate.timestamp)}
              status="normal"
            />
          )}

          {latestVitals.hrv && (
            <VitalSignCard
              icon="📊"
              title="Variabilidade (HRV)"
              value={latestVitals.hrv.value.toString()}
              unit="ms"
              source={latestVitals.hrv.source}
              timestamp={new Date(latestVitals.hrv.timestamp)}
              status="normal"
            />
          )}

          {latestVitals.steps && (
            <VitalSignCard
              icon="👣"
              title="Passos Hoje"
              value={latestVitals.steps.value.toString()}
              unit="passos"
              source={latestVitals.steps.source}
              timestamp={new Date(latestVitals.steps.timestamp)}
              status="normal"
            />
          )}

          {vitalSigns.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⌚</Text>
              <Text style={styles.emptyText}>
                Conecte seu Apple Watch ou dispositivo Android para monitoramento contínuo
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Microteste</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>💊</Text>
              <Text style={styles.quickActionText}>Medicação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📝</Text>
              <Text style={styles.quickActionText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📞</Text>
              <Text style={styles.quickActionText}>Ajuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
  },
  patientName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  syncButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIcon: {
    fontSize: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  riskBadge: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
});
