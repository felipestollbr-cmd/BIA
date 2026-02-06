import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNeuroStore } from '@/store/neuroStore';
import { MemoryTest, AttentionTest, ReactionTest } from '@/components/CognitiveTests';
import { CognitiveAssessment } from '@/types/neuro';

export default function TestsScreen() {
  const { assessments, addAssessment, currentIndex } = useNeuroStore();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  const cognitiveTests = [
    {
      id: 'memory',
      title: 'Teste de Memória',
      icon: '🧩',
      description: 'Avalia memória de curto prazo e capacidade de recordação',
      color: '#3b82f6',
      duration: '5-7 min',
      measures: ['Memória de trabalho', 'Capacidade de recordação', 'Erros'],
    },
    {
      id: 'attention',
      title: 'Teste de Atenção',
      icon: '🎯',
      description: 'Mede atenção sustentada e seletiva',
      color: '#8b5cf6',
      duration: '3-5 min',
      measures: ['Atenção seletiva', 'Velocidade de processamento', 'Precisão'],
    },
    {
      id: 'reaction',
      title: 'Tempo de Reação',
      icon: '⚡',
      description: 'Avalia velocidade de resposta e tempo de reação',
      color: '#ec4899',
      duration: '2-3 min',
      measures: ['Tempo de reação', 'Consistência', 'Velocidade'],
    },
    {
      id: 'executive',
      title: 'Função Executiva',
      icon: '🧠',
      description: 'Testa planejamento, tomada de decisão e flexibilidade cognitiva',
      color: '#10b981',
      duration: '8-10 min',
      measures: ['Planejamento', 'Flexibilidade', 'Resolução de problemas'],
    },
    {
      id: 'language',
      title: 'Teste de Linguagem',
      icon: '💬',
      description: 'Avalia fluência verbal e compreensão',
      color: '#f59e0b',
      duration: '5-7 min',
      measures: ['Fluência verbal', 'Compreensão', 'Nomeação'],
    },
  ];

  const handleStartTest = (testId: string) => {
    setActiveTest(testId);
  };

  const handleTestComplete = (score: number, assessment: Partial<CognitiveAssessment>) => {
    const fullAssessment: CognitiveAssessment = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: activeTest as any,
      score,
      duration: assessment.duration || 0,
      errors: assessment.errors || 0,
      hesitations: assessment.hesitations || 0,
      difficulty: assessment.difficulty || 'medium',
      metadata: assessment.metadata,
    };

    addAssessment(fullAssessment);
    setTestResults({ score, assessment: fullAssessment });
    setActiveTest(null);
  };

  const recentTests = assessments.slice(0, 5);
  
  const todayTests = assessments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.timestamp).toDateString() === today;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getTrend = () => {
    if (assessments.length < 2) return null;
    const recent = assessments.slice(0, 5);
    const avgRecent = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
    const older = assessments.slice(5, 10);
    if (older.length === 0) return 'stable';
    const avgOlder = older.reduce((sum, a) => sum + a.score, 0) / older.length;
    
    if (avgRecent > avgOlder + 5) return 'improving';
    if (avgRecent < avgOlder - 5) return 'declining';
    return 'stable';
  };

  const trend = getTrend();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Testes Cognitivos</Text>
            <Text style={styles.subtitle}>Avaliação formal de declínio/melhora</Text>
          </View>
        </View>

        {/* Current Status */}
        {currentIndex && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Status Cognitivo Atual</Text>
              {trend && (
                <View style={styles.trendBadge}>
                  <Text style={styles.trendIcon}>
                    {trend === 'improving' ? '↗️' : trend === 'declining' ? '↘️' : '→'}
                  </Text>
                  <Text style={[styles.trendText, {
                    color: trend === 'improving' ? '#10b981' : trend === 'declining' ? '#ef4444' : '#94a3b8'
                  }]}>
                    {trend === 'improving' ? 'Melhorando' : trend === 'declining' ? 'Declínio' : 'Estável'}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.indicesRow}>
              <View style={styles.indexBox}>
                <Text style={styles.indexValue}>{currentIndex.stabilityIndex}</Text>
                <Text style={styles.indexLabel}>Estabilidade</Text>
              </View>
              <View style={styles.indexBox}>
                <Text style={styles.indexValue}>{currentIndex.engagementIndex}</Text>
                <Text style={styles.indexLabel}>Engajamento</Text>
              </View>
              <View style={styles.indexBox}>
                <Text style={styles.indexValue}>{currentIndex.declineIndex}</Text>
                <Text style={styles.indexLabel}>Declínio</Text>
              </View>
            </View>

            <Text style={styles.statusInfo}>
              Testes hoje: {todayTests.length}/3 • Última avaliação: {
                assessments.length > 0 
                  ? new Date(assessments[0].timestamp).toLocaleDateString('pt-BR')
                  : 'Nunca'
              }
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🎯</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Testes vs Exercícios</Text>
            <Text style={styles.infoText}>
              Testes são avaliações formais que medem suas habilidades cognitivas e geram
              parâmetros para detectar declínio ou melhora ao longo do tempo. Os dados são
              enviados ao ecossistema SUZI para análise avançada.
            </Text>
          </View>
        </View>

        {/* Available Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testes Disponíveis</Text>
          {cognitiveTests.map(test => (
            <TouchableOpacity
              key={test.id}
              style={[styles.testCard, { borderLeftColor: test.color }]}
              onPress={() => handleStartTest(test.id)}
            >
              <Text style={styles.testIcon}>{test.icon}</Text>
              <View style={styles.testContent}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testDescription}>{test.description}</Text>
                <View style={styles.testMeta}>
                  <Text style={styles.testDuration}>⏱️ {test.duration}</Text>
                  <Text style={styles.testMeasures}>
                    Mede: {test.measures.join(', ')}
                  </Text>
                </View>
              </View>
              <View style={[styles.testButton, { backgroundColor: test.color }]}>
                <Text style={styles.testButtonText}>Iniciar</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultados Recentes</Text>
          {recentTests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>
                Nenhum teste realizado ainda. Faça seu primeiro teste para começar!
              </Text>
            </View>
          ) : (
            recentTests.map(test => (
              <View key={test.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View>
                    <Text style={styles.resultType}>
                      {getTestIcon(test.type)} {getTestName(test.type)}
                    </Text>
                    <Text style={styles.resultDate}>
                      {new Date(test.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.scoreCircle}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(test.score) }]}>
                      {test.score}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultStats}>
                  <Text style={styles.resultStat}>⏱️ {Math.floor(test.duration / 1000)}s</Text>
                  <Text style={styles.resultStat}>✗ {test.errors} erros</Text>
                  {test.hesitations > 0 && (
                    <Text style={styles.resultStat}>⏸️ {test.hesitations} hesitações</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>📋 Recomendação de Testes</Text>
          <Text style={styles.recommendationText}>
            Para monitoramento ideal, realize:
          </Text>
          <Text style={styles.recommendationItem}>• 1-2 testes por semana (mínimo)</Text>
          <Text style={styles.recommendationItem}>• Alterne entre diferentes tipos</Text>
          <Text style={styles.recommendationItem}>• Faça no mesmo horário do dia</Text>
          <Text style={styles.recommendationItem}>• Evite testar quando cansado</Text>
        </View>
      </ScrollView>

      {/* Test Modals */}
      <Modal
        visible={activeTest === 'memory'}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.testModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setActiveTest(null)}
          >
            <Text style={styles.closeButtonText}>✕ Fechar</Text>
          </TouchableOpacity>
          <MemoryTest onComplete={handleTestComplete} />
        </View>
      </Modal>

      <Modal
        visible={activeTest === 'attention'}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.testModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setActiveTest(null)}
          >
            <Text style={styles.closeButtonText}>✕ Fechar</Text>
          </TouchableOpacity>
          <AttentionTest onComplete={handleTestComplete} />
        </View>
      </Modal>

      <Modal
        visible={activeTest === 'reaction'}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.testModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setActiveTest(null)}
          >
            <Text style={styles.closeButtonText}>✕ Fechar</Text>
          </TouchableOpacity>
          <ReactionTest onComplete={handleTestComplete} />
        </View>
      </Modal>

      {/* Results Modal */}
      <Modal
        visible={testResults !== null}
        animationType="fade"
        transparent
      >
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Teste Concluído! 🎉</Text>
            <View style={styles.resultsScoreCircle}>
              <Text style={[styles.resultsScore, { 
                color: testResults ? getScoreColor(testResults.score) : '#fff' 
              }]}>
                {testResults?.score}
              </Text>
            </View>
            <Text style={styles.resultsLabel}>
              {testResults?.score >= 80 ? 'Excelente!' :
               testResults?.score >= 60 ? 'Bom resultado!' :
               'Continue praticando!'}
            </Text>
            <Text style={styles.resultsInfo}>
              Seus dados foram enviados ao ecossistema SUZI para análise.
            </Text>
            <TouchableOpacity
              style={styles.resultsButton}
              onPress={() => setTestResults(null)}
            >
              <Text style={styles.resultsButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function getTestIcon(type: string): string {
  const icons: Record<string, string> = {
    memory: '🧩',
    attention: '🎯',
    reaction: '⚡',
    executive: '🧠',
    language: '💬',
    recognition: '👁️',
  };
  return icons[type] || '📊';
}

function getTestName(type: string): string {
  const names: Record<string, string> = {
    memory: 'Memória',
    attention: 'Atenção',
    reaction: 'Tempo de Reação',
    executive: 'Função Executiva',
    language: 'Linguagem',
    recognition: 'Reconhecimento',
  };
  return names[type] || type;
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
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
  },
  indicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  indexBox: {
    alignItems: 'center',
  },
  indexValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  indexLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusInfo: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#1e40af20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e40af40',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#60a5fa',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  testCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
    lineHeight: 18,
  },
  testMeta: {
    gap: 4,
  },
  testDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  testMeasures: {
    fontSize: 11,
    color: '#64748b',
  },
  testButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
  },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultStats: {
    flexDirection: 'row',
    gap: 16,
  },
  resultStat: {
    fontSize: 12,
    color: '#64748b',
  },
  recommendationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 22,
  },
  testModalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  resultsScoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsScore: {
    fontSize: 48,
    fontWeight: '700',
  },
  resultsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 16,
  },
  resultsInfo: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resultsButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
  },
  resultsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
