import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VitalSignCardProps {
  icon: string;
  title: string;
  value: string;
  unit: string;
  source: 'healthkit' | 'health_connect' | 'manual';
  timestamp?: Date;
  status?: 'normal' | 'attention' | 'critical';
}

export const VitalSignCard: React.FC<VitalSignCardProps> = ({
  icon,
  title,
  value,
  unit,
  source,
  timestamp,
  status = 'normal'
}) => {
  const getStatusColor = () => {
    if (status === 'critical') return '#ef4444';
    if (status === 'attention') return '#f59e0b';
    return '#10b981';
  };

  const getSourceLabel = () => {
    if (source === 'healthkit') return '🍎 HealthKit';
    if (source === 'health_connect') return '🤖 Health Connect';
    return '📝 Manual';
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.source}>{getSourceLabel()}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {timestamp && (
        <Text style={styles.timestamp}>
          Atualizado {formatTimestamp(timestamp)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  
  if (diff < 1) return 'agora';
  if (diff < 60) return `há ${diff}m`;
  if (diff < 1440) return `há ${Math.floor(diff / 60)}h`;
  return `há ${Math.floor(diff / 1440)}d`;
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
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  source: {
    fontSize: 11,
    color: '#94a3b8',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  unit: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
  },
});
