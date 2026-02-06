import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medication } from '@/types/neuro';

interface MedicationCardProps {
  medication: Medication;
  onTake?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onTake,
  onSkip 
}) => {
  const adherenceRate = medication.adherence 
    ? Math.round((medication.adherence.taken / (medication.adherence.taken + medication.adherence.missed)) * 100)
    : 100;

  const getAdherenceColor = () => {
    if (adherenceRate >= 90) return '#10b981';
    if (adherenceRate >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
        </View>
        {!medication.active && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>Inativo</Text>
          </View>
        )}
      </View>

      <Text style={styles.purpose}>{medication.purpose}</Text>

      <View style={styles.schedule}>
        <Text style={styles.scheduleLabel}>Horários:</Text>
        <View style={styles.times}>
          {medication.times.map((time, index) => (
            <View key={index} style={styles.timeChip}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
        </View>
      </View>

      {medication.adherence && (
        <View style={styles.adherence}>
          <View style={styles.adherenceHeader}>
            <Text style={styles.adherenceLabel}>Adesão</Text>
            <Text style={[styles.adherenceRate, { color: getAdherenceColor() }]}>
              {adherenceRate}%
            </Text>
          </View>
          <View style={styles.adherenceBar}>
            <View 
              style={[
                styles.adherenceProgress, 
                { 
                  width: `${adherenceRate}%`,
                  backgroundColor: getAdherenceColor()
                }
              ]} 
            />
          </View>
          <Text style={styles.adherenceStats}>
            ✓ {medication.adherence.taken} tomados  ✗ {medication.adherence.missed} perdidos
          </Text>
        </View>
      )}

      {medication.active && onTake && onSkip && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.skipButton]}
            onPress={() => onSkip(medication.id)}
          >
            <Text style={styles.skipButtonText}>Pular</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.takeButton]}
            onPress={() => onTake(medication.id)}
          >
            <Text style={styles.takeButtonText}>✓ Tomei</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: '#94a3b8',
  },
  inactiveBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inactiveText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  purpose: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  schedule: {
    marginBottom: 12,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  adherence: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adherenceLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  adherenceRate: {
    fontSize: 16,
    fontWeight: '700',
  },
  adherenceBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  adherenceProgress: {
    height: '100%',
    borderRadius: 3,
  },
  adherenceStats: {
    fontSize: 11,
    color: '#64748b',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#334155',
  },
  skipButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  takeButton: {
    backgroundColor: '#10b981',
  },
  takeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
