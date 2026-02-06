import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BehaviorLog } from '@/types/neuro';

interface BehaviorLogCardProps {
  log: BehaviorLog;
  onPress?: () => void;
}

export const BehaviorLogCard: React.FC<BehaviorLogCardProps> = ({ log, onPress }) => {
  const getTypeInfo = (type: BehaviorLog['type']) => {
    const map = {
      confusion: { icon: '😕', label: 'Confusão', color: '#f59e0b' },
      agitation: { icon: '😤', label: 'Agitação', color: '#ef4444' },
      apathy: { icon: '😶', label: 'Apatia', color: '#6b7280' },
      disorientation: { icon: '🤔', label: 'Desorientação', color: '#f59e0b' },
      sundowning: { icon: '🌅', label: 'Sundowning', color: '#f97316' },
      fall: { icon: '⚠️', label: 'Queda', color: '#dc2626' },
      other: { icon: '📝', label: 'Outro', color: '#64748b' }
    };
    return map[type];
  };

  const getSeverityLabel = (severity: number) => {
    const labels = ['Muito Leve', 'Leve', 'Moderado', 'Grave', 'Muito Grave'];
    return labels[severity - 1];
  };

  const typeInfo = getTypeInfo(log.type);

  return (
    <TouchableOpacity 
      style={[styles.container, { borderLeftColor: typeInfo.color }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{typeInfo.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{typeInfo.label}</Text>
          <Text style={styles.timestamp}>
            {new Date(log.timestamp).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: typeInfo.color }]}>
          <Text style={styles.severityText}>{log.severity}</Text>
        </View>
      </View>

      {log.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {log.notes}
        </Text>
      )}

      {log.duration && (
        <Text style={styles.duration}>Duração: {log.duration} min</Text>
      )}

      <Text style={styles.reportedBy}>
        Reportado por: {log.reportedBy === 'patient' ? 'Paciente' : log.reportedBy === 'caregiver' ? 'Cuidador' : 'Sistema'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  severityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  notes: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
    lineHeight: 20,
  },
  duration: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  reportedBy: {
    fontSize: 11,
    color: '#64748b',
  },
});
