import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNeuroStore } from '@/store/neuroStore';
import { CaregiverNote } from '@/types/neuro';

export default function CaregiverScreen() {
  const { caregiverNotes, addCaregiverNote, behaviorLogs, medications, currentIndex } = useNeuroStore();
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<CaregiverNote['category']>('observation');

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const note: CaregiverNote = {
      id: Date.now().toString(),
      timestamp: new Date(),
      category: noteCategory,
      content: noteContent,
    };

    addCaregiverNote(note);
    setNoteContent('');
    setShowAddNote(false);
  };

  const recentLogs = behaviorLogs.slice(0, 3);
  const activeMeds = medications.filter(m => m.active);

  const caregiverTips = [
    {
      icon: '💡',
      title: 'Rotina Consistente',
      description: 'Mantenha horários regulares para refeições, sono e atividades.',
    },
    {
      icon: '🗣️',
      title: 'Comunicação Clara',
      description: 'Use frases curtas e simples. Dê tempo para respostas.',
    },
    {
      icon: '🏃',
      title: 'Atividade Física',
      description: 'Caminhadas leves diárias melhoram cognição e humor.',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Painel do Cuidador</Text>
            <Text style={styles.subtitle}>Apoio e orientação</Text>
          </View>
        </View>

        {/* Patient Status Summary */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Status Geral</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>🧠</Text>
              <Text style={styles.statusLabel}>Cognitivo</Text>
              <Text style={[styles.statusValue, { color: getStatusColor(currentIndex?.stabilityIndex) }]}>
                {currentIndex?.stabilityIndex || '--'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>💊</Text>
              <Text style={styles.statusLabel}>Medicação</Text>
              <Text style={[styles.statusValue, { color: '#10b981' }]}>
                {activeMeds.length} ativos
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>📋</Text>
              <Text style={styles.statusLabel}>Eventos</Text>
              <Text style={[styles.statusValue, { color: recentLogs.length > 0 ? '#f59e0b' : '#10b981' }]}>
                {recentLogs.length} hoje
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Ligar Médico</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🚨</Text>
              <Text style={styles.actionText}>Emergência</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowAddNote(true)}
            >
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionText}>Adicionar Nota</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Behavior Logs */}
        {recentLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eventos Recentes</Text>
            {recentLogs.map(log => (
              <View key={log.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventType}>
                    {getEventIcon(log.type)} {getEventLabel(log.type)}
                  </Text>
                  <Text style={styles.eventTime}>
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {log.notes && (
                  <Text style={styles.eventNotes}>{log.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Caregiver Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas Anotações</Text>
            <TouchableOpacity onPress={() => setShowAddNote(true)}>
              <Text style={styles.addLink}>+ Nova</Text>
            </TouchableOpacity>
          </View>
          {caregiverNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                Adicione observações importantes sobre o paciente
              </Text>
            </View>
          ) : (
            caregiverNotes.slice(0, 5).map(note => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={[styles.noteCategoryBadge, { 
                    backgroundColor: getCategoryColor(note.category)
                  }]}>
                    <Text style={styles.noteCategoryText}>
                      {getCategoryLabel(note.category)}
                    </Text>
                  </View>
                  <Text style={styles.noteTime}>
                    {new Date(note.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Text style={styles.noteContent}>{note.content}</Text>
              </View>
            ))
          )}
        </View>

        {/* Caregiver Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas para Cuidadores</Text>
          {caregiverTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Support Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos de Apoio</Text>
          <TouchableOpacity style={styles.resourceCard}>
            <Text style={styles.resourceIcon}>📚</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Guia do Cuidador</Text>
              <Text style={styles.resourceDescription}>
                Material completo sobre cuidados com Alzheimer
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceCard}>
            <Text style={styles.resourceIcon}>👥</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Grupo de Apoio</Text>
              <Text style={styles.resourceDescription}>
                Conecte-se com outros cuidadores
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Note Modal */}
      <Modal
        visible={showAddNote}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddNote(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Anotação</Text>
            <TouchableOpacity onPress={handleAddNote}>
              <Text style={styles.modalSave}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Categoria</Text>
            <View style={styles.categories}>
              {(['observation', 'concern', 'improvement', 'routine', 'medical'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    noteCategory === cat && styles.categoryChipActive
                  ]}
                  onPress={() => setNoteCategory(cat)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    noteCategory === cat && styles.categoryChipTextActive
                  ]}>
                    {getCategoryLabel(cat)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Anotação</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={6}
              placeholder="Descreva o que observou..."
              placeholderTextColor="#64748b"
              value={noteContent}
              onChangeText={setNoteContent}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function getStatusColor(value?: number): string {
  if (!value) return '#64748b';
  if (value >= 80) return '#10b981';
  if (value >= 60) return '#f59e0b';
  return '#ef4444';
}

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    confusion: '😕',
    agitation: '😤',
    apathy: '😶',
    disorientation: '🤔',
    sundowning: '🌅',
    fall: '⚠️',
    other: '📝',
  };
  return icons[type] || '📝';
}

function getEventLabel(type: string): string {
  const labels: Record<string, string> = {
    confusion: 'Confusão',
    agitation: 'Agitação',
    apathy: 'Apatia',
    disorientation: 'Desorientação',
    sundowning: 'Sundowning',
    fall: 'Queda',
    other: 'Outro',
  };
  return labels[type] || type;
}

function getCategoryLabel(category: CaregiverNote['category']): string {
  const labels: Record<string, string> = {
    observation: 'Observação',
    concern: 'Preocupação',
    improvement: 'Melhora',
    routine: 'Rotina',
    medical: 'Médico',
  };
  return labels[category];
}

function getCategoryColor(category: CaregiverNote['category']): string {
  const colors: Record<string, string> = {
    observation: '#3b82f6',
    concern: '#f59e0b',
    improvement: '#10b981',
    routine: '#8b5cf6',
    medical: '#ef4444',
  };
  return colors[category];
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
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
  addLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ea580c',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  eventTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  eventNotes: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 8,
    lineHeight: 18,
  },
  noteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteCategoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noteCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  noteTime: {
    fontSize: 11,
    color: '#64748b',
  },
  noteContent: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
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
  tipCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  resourceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resourceIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalClose: {
    fontSize: 24,
    color: '#94a3b8',
    width: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ea580c',
    width: 60,
    textAlign: 'right',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#fff',
    height: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
  },
});
