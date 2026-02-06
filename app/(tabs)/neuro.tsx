import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNeuroStore } from '@/store/neuroStore';
import { BehaviorLogCard } from '@/components/BehaviorLogCard';
import { MedicationCard } from '@/components/MedicationCard';
import { BehaviorLog } from '@/types/neuro';

export default function NeuroScreen() {
  const { behaviorLogs, medications, updateMedicationAdherence, addBehaviorLog } = useNeuroStore();
  const [showAddBehavior, setShowAddBehavior] = useState(false);

  const handleTakeMedication = (id: string) => {
    updateMedicationAdherence(id, true);
  };

  const handleSkipMedication = (id: string) => {
    updateMedicationAdherence(id, false);
  };

  const handleAddBehavior = (type: BehaviorLog['type'], severity: 1 | 2 | 3 | 4 | 5) => {
    const newLog: BehaviorLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      severity,
      reportedBy: 'caregiver',
    };
    addBehaviorLog(newLog);
    setShowAddBehavior(false);
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
            <Text style={styles.title}>Monitoramento</Text>
            <Text style={styles.subtitle}>Neuro & Comportamental</Text>
          </View>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Medicamentos</Text>
          {medications.filter(m => m.active).map(med => (
            <MedicationCard
              key={med.id}
              medication={med}
              onTake={handleTakeMedication}
              onSkip={handleSkipMedication}
            />
          ))}
        </View>

        {/* Behavior Logs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Eventos Comportamentais</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddBehavior(!showAddBehavior)}
            >
              <Text style={styles.addButtonText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          {showAddBehavior && (
            <View style={styles.addBehaviorPanel}>
              <Text style={styles.addBehaviorTitle}>Registrar evento</Text>
              <View style={styles.behaviorTypes}>
                <TouchableOpacity 
                  style={styles.behaviorTypeButton}
                  onPress={() => handleAddBehavior('confusion', 3)}
                >
                  <Text style={styles.behaviorTypeIcon}>😕</Text>
                  <Text style={styles.behaviorTypeText}>Confusão</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.behaviorTypeButton}
                  onPress={() => handleAddBehavior('agitation', 3)}
                >
                  <Text style={styles.behaviorTypeIcon}>😤</Text>
                  <Text style={styles.behaviorTypeText}>Agitação</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.behaviorTypeButton}
                  onPress={() => handleAddBehavior('disorientation', 3)}
                >
                  <Text style={styles.behaviorTypeIcon}>🤔</Text>
                  <Text style={styles.behaviorTypeText}>Desorientação</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.behaviorTypeButton}
                  onPress={() => handleAddBehavior('fall', 5)}
                >
                  <Text style={styles.behaviorTypeIcon}>⚠️</Text>
                  <Text style={styles.behaviorTypeText}>Queda</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {behaviorLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={styles.emptyText}>
                Nenhum evento registrado hoje
              </Text>
            </View>
          ) : (
            behaviorLogs.slice(0, 10).map(log => (
              <BehaviorLogCard key={log.id} log={log} />
            ))
          )}
        </View>

        {/* Sleep Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💤 Qualidade do Sono</Text>
          <View style={styles.sleepCard}>
            <View style={styles.sleepMetric}>
              <Text style={styles.sleepLabel}>Duração</Text>
              <Text style={styles.sleepValue}>7h 20m</Text>
            </View>
            <View style={styles.sleepMetric}>
              <Text style={styles.sleepLabel}>Eficiência</Text>
              <Text style={styles.sleepValue}>85%</Text>
            </View>
            <View style={styles.sleepMetric}>
              <Text style={styles.sleepLabel}>Interrupções</Text>
              <Text style={styles.sleepValue}>2</Text>
            </View>
          </View>
          <Text style={styles.sleepNote}>
            🍎 Dados do Apple HealthKit
          </Text>
        </View>

        {/* Activity Pattern */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚶 Padrão de Atividade</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityStatus}>Sem mudanças significativas</Text>
            <Text style={styles.activityDetails}>
              Rotina mantida estável nos últimos 7 dias
            </Text>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  addBehaviorPanel: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addBehaviorTitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 12,
    fontWeight: '600',
  },
  behaviorTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  behaviorTypeButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: '23%',
  },
  behaviorTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  behaviorTypeText: {
    fontSize: 11,
    color: '#e2e8f0',
    fontWeight: '600',
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
  },
  sleepCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sleepMetric: {
    alignItems: 'center',
  },
  sleepLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  sleepValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  sleepNote: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activityStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  activityDetails: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
