import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNeuroStore } from '@/store/neuroStore';

export default function ExercisesScreen() {
  const { therapySessions, addTherapySession } = useNeuroStore();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const exerciseCategories = [
    {
      id: 'memory',
      title: 'Memória',
      icon: '🧩',
      description: 'Exercícios para fortalecer memória de trabalho',
      color: '#3b82f6',
      exercises: [
        { name: 'Sequência de Números', difficulty: 'easy', duration: 5 },
        { name: 'Pares de Palavras', difficulty: 'medium', duration: 10 },
        { name: 'Reconhecimento Visual', difficulty: 'hard', duration: 15 },
      ]
    },
    {
      id: 'attention',
      title: 'Atenção',
      icon: '🎯',
      description: 'Treinos de foco e concentração sustentada',
      color: '#8b5cf6',
      exercises: [
        { name: 'Busca Visual', difficulty: 'easy', duration: 5 },
        { name: 'Atenção Dividida', difficulty: 'medium', duration: 10 },
        { name: 'Stroop Test', difficulty: 'hard', duration: 8 },
      ]
    },
    {
      id: 'executive',
      title: 'Função Executiva',
      icon: '🧠',
      description: 'Planejamento, organização e resolução de problemas',
      color: '#ec4899',
      exercises: [
        { name: 'Torre de Hanói', difficulty: 'medium', duration: 10 },
        { name: 'Categorização', difficulty: 'easy', duration: 7 },
        { name: 'Sequências Lógicas', difficulty: 'hard', duration: 12 },
      ]
    },
    {
      id: 'language',
      title: 'Linguagem',
      icon: '💬',
      description: 'Vocabulário, fluência verbal e compreensão',
      color: '#10b981',
      exercises: [
        { name: 'Associação de Palavras', difficulty: 'easy', duration: 5 },
        { name: 'Completar Frases', difficulty: 'medium', duration: 8 },
        { name: 'Sinônimos e Antônimos', difficulty: 'hard', duration: 10 },
      ]
    },
    {
      id: 'visual_spatial',
      title: 'Visuoespacial',
      icon: '🎨',
      description: 'Percepção espacial e coordenação visuomotora',
      color: '#f59e0b',
      exercises: [
        { name: 'Rotação Mental', difficulty: 'medium', duration: 7 },
        { name: 'Labirintos', difficulty: 'easy', duration: 5 },
        { name: 'Espelhamento', difficulty: 'hard', duration: 10 },
      ]
    },
  ];

  const handleStartExercise = (categoryId: string, exerciseName: string) => {
    // Simular exercício
    setTimeout(() => {
      addTherapySession({
        id: Date.now().toString(),
        timestamp: new Date(),
        type: categoryId as any,
        duration: 300,
        score: Math.floor(70 + Math.random() * 30),
        completed: true,
        enjoyment: Math.floor(3 + Math.random() * 3),
      });
      setActiveExercise(null);
    }, 2000);
    
    setActiveExercise(`${categoryId}_${exerciseName}`);
  };

  const todaySessions = therapySessions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.timestamp).toDateString() === today;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Exercícios Cognitivos</Text>
            <Text style={styles.subtitle}>Estimulação neural diária</Text>
          </View>
        </View>

        {/* Daily Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progresso Hoje</Text>
            <Text style={styles.progressBadge}>{todaySessions.length}/5 exercícios</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(todaySessions.length / 5) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {todaySessions.length === 0 && 'Comece sua rotina de exercícios hoje!'}
            {todaySessions.length > 0 && todaySessions.length < 3 && 'Bom começo! Continue assim 💪'}
            {todaySessions.length >= 3 && todaySessions.length < 5 && 'Excelente progresso! Quase lá 🎉'}
            {todaySessions.length >= 5 && 'Meta diária alcançada! Parabéns! 🏆'}
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Exercícios vs Testes</Text>
            <Text style={styles.infoText}>
              Exercícios são atividades de treino que ajudam a melhorar suas habilidades cognitivas.
              Use a aba "Testes" para avaliações formais que medem declínio/melhora.
            </Text>
          </View>
        </View>

        {/* Exercise Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias de Exercícios</Text>
          {exerciseCategories.map(category => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={[styles.categoryHeader, { borderLeftColor: category.color }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryHeaderText}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>

              <View style={styles.exercisesList}>
                {category.exercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exerciseCard}
                    onPress={() => handleStartExercise(category.id, exercise.name)}
                    disabled={activeExercise !== null}
                  >
                    <View style={styles.exerciseContent}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View style={styles.exerciseMeta}>
                        <View style={[styles.difficultyBadge, { 
                          backgroundColor: 
                            exercise.difficulty === 'easy' ? '#10b98130' :
                            exercise.difficulty === 'medium' ? '#f59e0b30' :
                            '#ef444430'
                        }]}>
                          <Text style={[styles.difficultyText, {
                            color:
                              exercise.difficulty === 'easy' ? '#10b981' :
                              exercise.difficulty === 'medium' ? '#f59e0b' :
                              '#ef4444'
                          }]}>
                            {exercise.difficulty === 'easy' ? 'Fácil' :
                             exercise.difficulty === 'medium' ? 'Médio' :
                             'Difícil'}
                          </Text>
                        </View>
                        <Text style={styles.duration}>⏱️ {exercise.duration}min</Text>
                      </View>
                    </View>
                    <View style={[styles.startButton, { backgroundColor: category.color }]}>
                      <Text style={styles.startButtonText}>▶</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Dicas para Melhores Resultados</Text>
          <Text style={styles.tipText}>• Pratique em horário fixo diariamente</Text>
          <Text style={styles.tipText}>• Comece com exercícios fáceis e progrida gradualmente</Text>
          <Text style={styles.tipText}>• Alterne entre diferentes categorias</Text>
          <Text style={styles.tipText}>• Descanse se sentir cansaço mental</Text>
        </View>
      </ScrollView>

      {/* Loading overlay */}
      {activeExercise && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>Carregando exercício...</Text>
          </View>
        </View>
      )}
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
  progressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  progressBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 13,
    color: '#94a3b8',
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryHeaderText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
  exercisesList: {
    gap: 8,
  },
  exerciseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  duration: {
    fontSize: 12,
    color: '#94a3b8',
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tipsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
