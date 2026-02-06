import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CognitiveIndexCardProps {
  title: string;
  value: number;
  trend?: 'improving' | 'stable' | 'declining';
  subtitle?: string;
}

export const CognitiveIndexCard: React.FC<CognitiveIndexCardProps> = ({
  title,
  value,
  trend,
  subtitle
}) => {
  const getColor = () => {
    if (value >= 80) return ['#10b981', '#059669'];
    if (value >= 60) return ['#f59e0b', '#d97706'];
    return ['#ef4444', '#dc2626'];
  };

  const getTrendIcon = () => {
    if (trend === 'improving') return '↗';
    if (trend === 'declining') return '↘';
    return '→';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getColor()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {trend && (
            <Text style={styles.trend}>{getTrendIcon()}</Text>
          )}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradient: {
    padding: 20,
  },
  title: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  trend: {
    fontSize: 24,
    marginLeft: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
});
