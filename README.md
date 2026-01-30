# NeuroTrack-BIA 🧠

**Aplicativo de coleta de dados neurocognitivos para o ecossistema SUZI**

O NeuroTrack-BIA é o braço móvel de coleta contínua de dados do paciente com Alzheimer, atuando como sensor digital cognitivo, comportamental e fisiológico. Todos os dados coletados são compartilhados com o banco unificado SUZI para análise avançada com IA (Cell2Sentence).

---

## 📱 Visão Geral

```
┌────────────────────────────────────┐
│     NeuroTrack-BIA (Coletor)      │
│                                    │
│  • Testes Cognitivos              │
│  • Exercícios Neurais             │
│  • HealthKit/Health Connect       │
│  • Eventos Comportamentais        │
│  • Medicação                      │
└─────────────┬──────────────────────┘
              │ Sincroniza
              ▼
┌────────────────────────────────────┐
│    Banco Unificado SUZI           │
│  (Compartilhado com todo sistema) │
│                                    │
│  • Orquestração com Cell2Sentence │
│  • Análise de risco               │
│  • Predições de declínio          │
└────────────────────────────────────┘
```

---

## 🎯 Funcionalidades

### 1. Testes Cognitivos (Aba Testes 🎯)
**Propósito**: Avaliação formal que detecta declínio ou melhora

- **Teste de Memória**: Memorização e recordação
- **Teste de Atenção**: Atenção sustentada e seletiva
- **Tempo de Reação**: Velocidade de resposta
- **Função Executiva**: Planejamento e tomada de decisão
- **Linguagem**: Fluência verbal e compreensão

**Diferenciais**:
- Gera **índices cognitivos** (Estabilidade, Engajamento, Declínio)
- Detecta **tendências** (melhorando/estável/declinando)
- Dados enviados automaticamente para orquestração SUZI
- Usado para gerar parâmetros de risco no Cell2Sentence

### 2. Exercícios Cognitivos (Aba Exercícios 🎮)
**Propósito**: Treino e estimulação neural diária

5 Categorias:
- **Memória**: Sequência de números, pares de palavras
- **Atenção**: Busca visual, atenção dividida, Stroop
- **Função Executiva**: Torre de Hanói, sequências lógicas
- **Linguagem**: Associação de palavras, sinônimos
- **Visuoespacial**: Rotação mental, labirintos

**Diferenciais**:
- Exercícios adaptativos (fácil → médio → difícil)
- Sistema de progresso diário (meta: 5 exercícios/dia)
- Não são testes formais, mas ajudam a melhorar habilidades

### 3. Integração HealthKit & Health Connect
**Coleta automática de sinais vitais**:
- 💤 **Sono**: Duração, eficiência, estágios (REM, profundo)
- ❤️ **Frequência Cardíaca**: FC em repouso, variabilidade (HRV)
- 👣 **Atividade**: Passos, distância, minutos ativos
- 📊 **Ritmo Circadiano**: Regularidade de horários

**Sincronização**:
- A cada 30 minutos em background
- Dados enviados ao banco SUZI
- Mapeados para assinaturas celulares (proxy biomarkers)

### 4. Monitoramento Neuro (Aba Neuro 🧠)
- Registro de eventos comportamentais (confusão, agitação, quedas)
- Controle de medicação com adesão
- Visualização de qualidade do sono
- Padrões de atividade

### 5. Painel do Cuidador (Aba Cuidador 👥)
- Status geral do paciente
- Anotações categorizadas
- Alertas e recomendações
- Dicas de cuidados

---

## 🔄 Fluxo de Dados

```
1. COLETA (BIA)
   ├─ Testes cognitivos → scores, tempo, erros
   ├─ Exercícios → progresso, engajamento
   ├─ HealthKit/Health Connect → sono, HRV, passos
   ├─ Eventos comportamentais → tipo, severidade
   └─ Medicação → adesão, horários

2. SINCRONIZAÇÃO (Automática)
   POST https://api.suzi.health/v1/bia/sync-vitals
   POST https://api.suzi.health/v1/bia/sync-cognitive
   POST https://api.suzi.health/v1/bia/sync-behavior
   
3. ARMAZENAMENTO (Banco Unificado SUZI)
   ├─ Séries temporais de índices cognitivos
   ├─ Dados fisiológicos normalizados
   ├─ Eventos comportamentais
   └─ Metadados de contexto

4. ORQUESTRAÇÃO (Backend SUZI + Cell2Sentence)
   ├─ Mapear dados → assinaturas celulares (proxy)
   ├─ Calcular risk scores integrados
   ├─ Gerar recomendações personalizadas
   └─ (Futuro) Análise de scRNA-seq real

5. FEEDBACK (Para o BIA)
   ├─ Índices de risco atualizados
   ├─ Tendências (melhora/estável/declínio)
   ├─ Recomendações de intervenção
   └─ Alertas de atenção
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ e npm
- iOS: Xcode, simulador iOS ou dispositivo físico
- Android: Android Studio, emulador ou dispositivo físico

### Instalação Automática

```bash
cd /Users/felipestoll/Desktop/BIA
./install-and-publish.sh
```

### Instalação Manual

```bash
# 1. Instalar dependências
npm install

# 2. Instalar Expo CLI
npm install -g expo-cli

# 3. Executar
npx expo start
```

### Escanear QR Code
- **iOS**: Abrir app Câmera → escanear QR
- **Android**: Abrir app Expo Go → escanear QR

---

## 🏗️ Arquitetura Técnica

### Stack
- **Frontend**: React Native + Expo Router
- **Estado**: Zustand
- **Navegação**: Expo Router (tabs)
- **Sensores**: expo-apple-health (iOS), react-native-health-connect (Android)
- **Backend**: FastAPI (Python)
- **IA**: Cell2Sentence (orquestração)

### Estrutura do Projeto

```
BIA/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── neuro.tsx          # Monitoramento
│   │   ├── exercises.tsx      # Exercícios Cognitivos ✨ NOVO
│   │   ├── tests.tsx          # Testes Cognitivos ✨ NOVO
│   │   └── caregiver.tsx      # Painel Cuidador
│   └── _layout.tsx
├── components/
│   ├── CognitiveTests.tsx     # Microtestes interativos
│   ├── CognitiveIndexCard.tsx
│   ├── VitalSignCard.tsx
│   ├── BehaviorLogCard.tsx
│   └── MedicationCard.tsx
├── types/
│   └── neuro.ts               # TypeScript types
├── store/
│   └── neuroStore.ts          # Estado global
├── services/
│   ├── healthService.ts       # HealthKit/Health Connect
│   ├── syncService.ts         # Sincronização SUZI ✨ ATUALIZADO
│   └── orchestrationService.py # Orquestração backend
├── backend_api.py             # FastAPI endpoints
└── README.md
```

---

## 📊 Diferencial: Testes vs Exercícios

| Aspecto | Testes Cognitivos 🎯 | Exercícios Cognitivos 🎮 |
|---------|----------------------|---------------------------|
| **Objetivo** | Avaliar e detectar declínio/melhora | Treinar e estimular cognição |
| **Frequência** | 1-2x por semana | Diariamente (5x/dia ideal) |
| **Dados gerados** | Índices formais, risk scores | Progresso, engajamento |
| **Orquestração** | ✅ Enviado para Cell2Sentence | ⚠️ Opcional, para contexto |
| **Impacto** | Diagnóstico e monitoramento | Terapêutico e preventivo |
| **Exemplo** | Teste de Memória formal (score 75/100) | Jogo de pares de palavras |

---

## 🧬 Integração com Cell2Sentence

### Fase Atual: Proxy Biomarkers (Fase 2)

O BIA coleta dados comportamentais e fisiológicos que são **mapeados** para assinaturas celulares baseado em literatura científica:

```python
# Backend SUZI orquestra:
Sono fragmentado (BIA) → Ativação microglial (proxy)
HRV baixo (BIA) → Estado inflamatório (proxy)
Declínio cognitivo (BIA) → Saúde neuronal (proxy)
Sedentarismo (BIA) → Estresse metabólico (proxy)

↓

Risk Score integrado = f(todos os componentes)
```

### Futuro: Cell2Sentence Full (Fase 3)

Com parceria laboratorial:
- Exame de sangue → scRNA-seq
- Cell2Sentence analisa células reais
- Compara com database de Alzheimer (ssREAD)
- Gera assinaturas celulares verdadeiras
- Combina com dados do BIA para predição precisa

---

## 📡 API Endpoints (Backend SUZI)

```python
# Sincronização de dados vitais
POST /api/v1/bia/sync-vitals
Body: { user_id, timestamp, vitals: [], sleep: {}, device_info: {} }

# Sincronização de avaliações cognitivas
POST /api/v1/bia/sync-cognitive
Body: { user_id, assessment_type, score, duration, errors }

# Sincronização de eventos comportamentais
POST /api/v1/bia/sync-behavior
Body: { user_id, event_type, severity, notes }

# Orquestração completa (retorna risk scores)
POST /api/v1/orchestrate
Body: { user_id, cognitive: {}, vitals: {}, behavior: {} }
Response: { 
  cellular_signature, 
  integrated_risk, 
  recommendations, 
  alerts 
}
```

---

## 🔐 Privacidade e Segurança

- ✅ Dados criptografados em trânsito (HTTPS)
- ✅ Consentimento explícito para HealthKit/Health Connect
- ✅ Controle granular de permissões
- ✅ Logs de auditoria
- ✅ Conformidade LGPD/HIPAA (em desenvolvimento)
- ✅ Dados anonimizados para pesquisa

---

## 🗺️ Roadmap

### Q1 2026 ✅ (Completo)
- [x] App NeuroTrack-BIA funcionando
- [x] Integração HealthKit/Health Connect
- [x] Testes cognitivos interativos
- [x] Exercícios cognitivos por categoria
- [x] Sincronização com backend

### Q2 2026 🚧 (Em desenvolvimento)
- [ ] Deploy backend em produção
- [ ] Orquestração com proxy biomarkers
- [ ] Dashboard web para médicos
- [ ] Notificações push inteligentes

### Q3 2026 🔮 (Planejado)
- [ ] Parceria laboratorial para scRNA-seq
- [ ] Integração Cell2Sentence real
- [ ] Estudo clínico piloto (50-100 usuários)
- [ ] Validação científica

### Q4 2026 🌟 (Visão)
- [ ] Escala para 1000+ usuários
- [ ] Publicação científica
- [ ] Submissão regulatória (FDA/ANVISA)
- [ ] Modelos preditivos avançados

---

## 📚 Documentação Adicional

- **`CELL2SENTENCE_INTEGRATION.md`**: Arquitetura completa de integração
- **`INSTRUCOES.md`**: Guia de instalação e publicação
- **`backend_api.py`**: Documentação de endpoints
- **`services/orchestrationService.py`**: Lógica de orquestração

---

## 🤝 Contribuindo

O NeuroTrack-BIA é parte do ecossistema SUZI. Para contribuir:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Copyright © 2026 SUZI Health
Todos os direitos reservados.

---

## 👨‍💻 Suporte

Para dúvidas ou suporte:
- Email: support@suzi.health
- Docs: https://docs.suzi.health
- GitHub Issues: [link]

---

## 🙏 Créditos

- **Cell2Sentence**: van Dijk Lab (Yale) + Google Research
- **Alzheimer's Database**: ssREAD (Nature Communications 2024)
- **Frameworks**: React Native, Expo, FastAPI
- **Design Inspiration**: Apple Health, Strava

---

**NeuroTrack-BIA**: Transformando dados diários em insights celulares para o cuidado do Alzheimer. 🧠💜
# BIA
# BIA
