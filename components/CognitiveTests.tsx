import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CognitiveAssessment } from '@/types/neuro';

interface MemoryTestProps {
  onComplete: (score: number, assessment: Partial<CognitiveAssessment>) => void;
}

export const MemoryTest: React.FC<MemoryTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'instruction' | 'memorize' | 'recall'>('instruction');
  const [items, setItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const allItems = ['🍎', '🚗', '🏠', '📱', '⚽', '🎨', '🌳', '🎵', '📚', '☀️', '🌙', '⭐'];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [phase]);

  const startTest = () => {
    // Select 6 random items to memorize
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6);
    setItems(selected);
    setPhase('memorize');
    setStartTime(Date.now());

    // Auto-advance to recall after 10 seconds
    setTimeout(() => {
      setPhase('recall');
    }, 10000);
  };

  const handleItemSelect = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const finishTest = () => {
    const duration = Date.now() - startTime;
    const correctItems = selectedItems.filter(item => items.includes(item));
    const score = Math.round((correctItems.length / items.length) * 100);
    const errors = selectedItems.length - correctItems.length;

    onComplete(score, {
      type: 'memory',
      score,
      duration,
      errors,
      hesitations: 0,
      difficulty: 'medium',
      metadata: {
        correctItems: correctItems.length,
        totalItems: items.length,
        falsePositives: errors,
      },
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {phase === 'instruction' && (
        <View style={styles.instructionView}>
          <Text style={styles.title}>Teste de Memória</Text>
          <Text style={styles.instruction}>
            Você verá 6 ítens por 10 segundos.{'\n'}
            Depois, selecione os ítens que você viu.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startTest}>
            <Text style={styles.startButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'memorize' && (
        <View style={styles.memorizeView}>
          <Text style={styles.phaseTitle}>Memorize estes ítens</Text>
          <View style={styles.itemsGrid}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemBox}>
                <Text style={styles.itemIcon}>{item}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.timer}>Aguarde...</Text>
        </View>
      )}

      {phase === 'recall' && (
        <View style={styles.recallView}>
          <Text style={styles.phaseTitle}>Selecione os ítens que você viu</Text>
          <View style={styles.itemsGrid}>
            {allItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.itemBox,
                  selectedItems.includes(item) && styles.itemBoxSelected,
                ]}
                onPress={() => handleItemSelect(item)}
              >
                <Text style={styles.itemIcon}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.finishButton} onPress={finishTest}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

interface AttentionTestProps {
  onComplete: (score: number, assessment: Partial<CognitiveAssessment>) => void;
}

export const AttentionTest: React.FC<AttentionTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'instruction' | 'testing'>('instruction');
  const [currentTarget, setCurrentTarget] = useState('⭐');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [correctTaps, setCorrectTaps] = useState(0);
  const [incorrectTaps, setIncorrectTaps] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const allSymbols = ['⭐', '●', '■', '▲', '◆', '♦', '♥', '♣'];

  const startTest = () => {
    // Generate random symbols with targets mixed in
    const generated = Array.from({ length: 30 }, () => {
      const isTarget = Math.random() < 0.3;
      return isTarget ? currentTarget : allSymbols[Math.floor(Math.random() * allSymbols.length)];
    });
    setSymbols(generated);
    setPhase('testing');
    setStartTime(Date.now());
  };

  const handleSymbolTap = (symbol: string) => {
    if (symbol === currentTarget) {
      setCorrectTaps(prev => prev + 1);
    } else {
      setIncorrectTaps(prev => prev + 1);
    }
  };

  const finishTest = () => {
    const duration = Date.now() - startTime;
    const totalTargets = symbols.filter(s => s === currentTarget).length;
    const accuracy = totalTargets > 0 ? (correctTaps / totalTargets) * 100 : 0;
    const score = Math.max(0, Math.round(accuracy - (incorrectTaps * 5)));

    onComplete(score, {
      type: 'attention',
      score,
      duration,
      errors: incorrectTaps,
      hesitations: 0,
      difficulty: 'medium',
      metadata: {
        correctTaps,
        incorrectTaps,
        totalTargets,
        accuracy,
      },
    });
  };

  return (
    <View style={styles.container}>
      {phase === 'instruction' && (
        <View style={styles.instructionView}>
          <Text style={styles.title}>Teste de Atenção</Text>
          <Text style={styles.instruction}>
            Toque apenas nos símbolos {currentTarget}{'\n'}
            Ignore todos os outros símbolos
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startTest}>
            <Text style={styles.startButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'testing' && (
        <View style={styles.testingView}>
          <View style={styles.targetIndicator}>
            <Text style={styles.targetLabel}>Procure:</Text>
            <Text style={styles.targetSymbol}>{currentTarget}</Text>
          </View>
          
          <View style={styles.symbolsGrid}>
            {symbols.map((symbol, index) => (
              <TouchableOpacity
                key={index}
                style={styles.symbolBox}
                onPress={() => handleSymbolTap(symbol)}
              >
                <Text style={styles.symbolText}>{symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.stats}>
            <Text style={styles.statText}>✓ {correctTaps}</Text>
            <Text style={styles.statText}>✗ {incorrectTaps}</Text>
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={finishTest}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

interface ReactionTestProps {
  onComplete: (score: number, assessment: Partial<CognitiveAssessment>) => void;
}

export const ReactionTest: React.FC<ReactionTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'instruction' | 'ready' | 'testing'>('instruction');
  const [targetVisible, setTargetVisible] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const totalRounds = 5;

  const startTest = () => {
    setPhase('ready');
    startRound();
  };

  const startRound = () => {
    setTargetVisible(false);
    const delay = 1000 + Math.random() * 2000; // Random delay 1-3 seconds
    
    setTimeout(() => {
      setTargetVisible(true);
      setRoundStartTime(Date.now());
    }, delay);
  };

  const handleTap = () => {
    if (!targetVisible) return;

    const reactionTime = Date.now() - roundStartTime;
    setReactionTimes([...reactionTimes, reactionTime]);
    setCurrentRound(prev => prev + 1);

    if (currentRound + 1 >= totalRounds) {
      finishTest([...reactionTimes, reactionTime]);
    } else {
      startRound();
    }
  };

  const finishTest = (times: number[]) => {
    const avgReactionTime = times.reduce((a, b) => a + b, 0) / times.length;
    // Score based on reaction time: < 300ms = 100, > 1000ms = 0
    const score = Math.max(0, Math.min(100, Math.round(100 - (avgReactionTime - 300) / 7)));

    onComplete(score, {
      type: 'reaction',
      score,
      duration: times.reduce((a, b) => a + b, 0),
      errors: 0,
      hesitations: times.filter(t => t > 1000).length,
      difficulty: 'medium',
      metadata: {
        avgReactionTime,
        bestTime: Math.min(...times),
        worstTime: Math.max(...times),
        allTimes: times,
      },
    });
  };

  return (
    <View style={styles.container}>
      {phase === 'instruction' && (
        <View style={styles.instructionView}>
          <Text style={styles.title}>Teste de Tempo de Reação</Text>
          <Text style={styles.instruction}>
            Toque na tela assim que o círculo verde aparecer{'\n'}
            Serão 5 rodadas
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startTest}>
            <Text style={styles.startButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === 'ready' || phase === 'testing') && (
        <TouchableOpacity 
          style={styles.reactionArea}
          onPress={handleTap}
          activeOpacity={1}
        >
          <Text style={styles.roundCounter}>Rodada {currentRound + 1}/{totalRounds}</Text>
          
          {!targetVisible && (
            <Text style={styles.waitText}>Aguarde...</Text>
          )}

          {targetVisible && (
            <View style={styles.targetCircle}>
              <Text style={styles.tapText}>TOQUE!</Text>
            </View>
          )}

          {reactionTimes.length > 0 && (
            <View style={styles.timesDisplay}>
              {reactionTimes.map((time, i) => (
                <Text key={i} style={styles.timeText}>{time}ms</Text>
              ))}
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  instructionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  memorizeView: {
    flex: 1,
    justifyContent: 'center',
  },
  recallView: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 24,
    textAlign: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  itemBox: {
    width: 80,
    height: 80,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  itemBoxSelected: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  itemIcon: {
    fontSize: 36,
  },
  timer: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  testingView: {
    flex: 1,
  },
  targetIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  targetLabel: {
    fontSize: 16,
    color: '#cbd5e1',
    marginRight: 12,
  },
  targetSymbol: {
    fontSize: 32,
  },
  symbolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  symbolBox: {
    width: 60,
    height: 60,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  statText: {
    fontSize: 18,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  reactionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
  },
  roundCounter: {
    position: 'absolute',
    top: 20,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  waitText: {
    fontSize: 20,
    color: '#64748b',
  },
  targetCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  timesDisplay: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
});
