# Cell2Sentence + NeuroTrack-BIA: Arquitetura de Integração

## Visão Geral

Cell2Sentence (C2S) é um framework de IA que usa LLMs para analisar dados de transcriptômica de células únicas (scRNA-seq). Ele converte perfis de expressão gênica em "sentenças celulares" que podem ser processadas por modelos de linguagem.

### O que o Cell2Sentence faz:
- 🧬 Análise de células únicas via LLMs
- 🎯 Predição de tipos celulares
- 🔬 Identificação de assinaturas de doenças
- 📊 Geração de embeddings celulares
- 🧠 Análise de populações celulares associadas ao Alzheimer

---

## Arquitetura de Orquestração

```
┌─────────────────────────────────────────────────────────────────┐
│                    NeuroTrack-BIA (React Native)                │
│  • Testes Cognitivos    • Eventos Comportamentais              │
│  • HealthKit/Health Connect    • Medicação                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend SUZI (Python/FastAPI)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Orquestrador de IA                                      │  │
│  │  • Recebe dados do BIA                                   │  │
│  │  • Normaliza métricas comportamentais/cognitivas         │  │
│  │  • Mapeia para assinaturas celulares                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Cell2Sentence│  │  Biomarcadores│  │   Modelos    │
│   (scRNA-seq)│  │    Proxy      │  │  Preditivos  │
│              │  │  (HealthKit)  │  │   AD Risk    │
│ • Análise    │  │               │  │              │
│   celular    │  │ • Sono        │  │ • Declínio   │
│ • Embeddings │  │ • HRV         │  │ • Risco      │
│ • Predição   │  │ • Atividade   │  │ • Progressão │
└──────┬───────┘  └───────┬───────┘  └───────┬──────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Banco Unificado SUZI                           │
│  • Dados cognitivos      • Dados celulares                      │
│  • Dados comportamentais • Índices de risco                     │
│  • Dados fisiológicos    • Predições                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integração Prática: 3 Fases

### **Fase 1: Base (Atual - Sem C2S)**
*O que já temos no NeuroTrack-BIA*

```python
# BIA coleta dados
{
  "user_id": "user123",
  "timestamp": "2026-01-28T10:30:00Z",
  "cognitive_score": 85,
  "sleep_efficiency": 0.82,
  "hrv": 45,
  "steps": 8450,
  "behavior_events": ["confusion"],
  "medication_adherence": 0.93
}
```

### **Fase 2: Proxy Biomarkers (Curto Prazo)**
*Mapear dados do BIA para assinaturas celulares conhecidas*

```python
# Backend SUZI processa
def map_to_cellular_signature(bia_data):
    """
    Mapeia métricas comportamentais para marcadores celulares
    baseado em literatura científica de Alzheimer
    """
    
    # Sono ruim → inflamação → ativação microglial
    microglial_score = calculate_inflammatory_state(
        sleep_efficiency=bia_data['sleep_efficiency'],
        hrv=bia_data['hrv']
    )
    
    # Declínio cognitivo → disfunção neuronal
    neuronal_health = calculate_neuronal_integrity(
        cognitive_score=bia_data['cognitive_score'],
        behavior_events=bia_data['behavior_events']
    )
    
    # Sedentarismo → estresse oxidativo
    metabolic_stress = calculate_oxidative_stress(
        steps=bia_data['steps'],
        activity_minutes=bia_data['activity']
    )
    
    return {
        "cellular_signature": {
            "microglial_activation": microglial_score,
            "neuronal_health": neuronal_health,
            "metabolic_stress": metabolic_stress
        },
        "ad_risk_score": calculate_composite_risk(...)
    }
```

### **Fase 3: Cell2Sentence Full (Médio Prazo)**
*Integração real com análise de células do sangue*

```python
# Backend SUZI + Cell2Sentence
from cell2sentence import CSModel, tasks

# 1. Carregar modelo pré-treinado
csmodel = CSModel.load("vandijklab/C2S-Scale-Gemma-2-2B")

# 2. Receber dados de scRNA-seq (de exame de sangue)
blood_sample_data = receive_from_lab(user_id="user123")

# 3. Gerar embeddings celulares
cell_embeddings = tasks.get_cell_embeddings(
    csmodel=csmodel,
    csdata=blood_sample_data
)

# 4. Comparar com database de Alzheimer (ssREAD)
ad_similarity = compare_to_ad_database(
    embeddings=cell_embeddings,
    reference="ssREAD_alzheimer_dataset"
)

# 5. Combinar com dados do BIA
def orchestrate_full_analysis(bia_data, cellular_data):
    return {
        "user_id": bia_data['user_id'],
        "timestamp": datetime.now(),
        
        # Dados cognitivos do BIA
        "cognitive_index": calculate_cognitive_indices(bia_data),
        
        # Dados celulares do Cell2Sentence
        "cellular_analysis": {
            "cell_types": cellular_data['predicted_types'],
            "ad_signature_similarity": ad_similarity,
            "inflammatory_markers": extract_markers(cellular_data),
            "neuronal_derived_exosomes": analyze_nde(cellular_data)
        },
        
        # Correlação multi-modal
        "integrated_risk": {
            "overall_score": 0.35,  # 0-1
            "cognitive_component": 0.15,
            "cellular_component": 0.20,
            "behavioral_component": 0.12,
            "confidence": 0.87
        },
        
        # Recomendações personalizadas
        "recommendations": generate_interventions(
            cognitive_state=bia_data['cognitive_score'],
            cellular_state=cellular_data['health_status'],
            lifestyle_metrics=bia_data['healthkit']
        )
    }
```

---

## Implementação Técnica

### Backend Service (Python FastAPI)

```python
# services/cell2sentence_orchestrator.py

from fastapi import FastAPI, BackgroundTasks
from cell2sentence import CSModel, tasks
import asyncio

app = FastAPI()

# Carregar modelo na inicialização
csmodel = None

@app.on_event("startup")
async def load_model():
    global csmodel
    # Modelo menor para latência aceitável
    csmodel = CSModel.load("vandijklab/C2S-Scale-Pythia-410M")
    print("Cell2Sentence model loaded")

@app.post("/api/v1/analyze-cellular-state")
async def analyze_cellular_state(
    user_id: str,
    bia_data: dict,
    cellular_data: dict = None  # Opcional: dados de scRNA-seq
):
    """
    Orquestra análise completa:
    - Dados do NeuroTrack-BIA
    - (Opcional) Dados celulares de exame
    - Gera risk score integrado
    """
    
    # Fase 2: Proxy biomarkers (sempre disponível)
    proxy_signature = map_to_cellular_signature(bia_data)
    
    # Fase 3: Cell2Sentence (se houver dados celulares)
    c2s_analysis = None
    if cellular_data:
        c2s_analysis = await run_cell2sentence_analysis(
            csmodel=csmodel,
            data=cellular_data
        )
    
    # Orquestrar resultado final
    result = {
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        "cognitive_indices": calculate_indices(bia_data),
        "proxy_biomarkers": proxy_signature,
        "cellular_analysis": c2s_analysis,
        "integrated_risk_score": calculate_risk(
            cognitive=bia_data,
            proxy=proxy_signature,
            cellular=c2s_analysis
        ),
        "recommendations": generate_recommendations(...)
    }
    
    # Salvar no banco unificado SUZI
    await save_to_database(result)
    
    return result

async def run_cell2sentence_analysis(csmodel, data):
    """
    Executa análise Cell2Sentence em background
    """
    # Converter dados para formato CSData
    csdata = prepare_csdata(data)
    
    # Gerar embeddings
    embeddings = tasks.get_cell_embeddings(
        csmodel=csmodel,
        csdata=csdata
    )
    
    # Predizer tipos celulares
    cell_types = tasks.predict_cell_types(
        csmodel=csmodel,
        csdata=csdata,
        reference_labels=load_reference()
    )
    
    # Comparar com database de AD
    ad_similarity = compare_to_ad_signatures(embeddings)
    
    return {
        "embeddings": embeddings.tolist(),
        "cell_types": cell_types,
        "ad_similarity_score": ad_similarity,
        "risk_level": classify_risk(ad_similarity)
    }

def map_to_cellular_signature(bia_data):
    """
    Fase 2: Mapeia métricas do BIA para assinaturas celulares
    baseado em correlações conhecidas na literatura
    """
    
    # Literatura: Sono fragmentado → ativação microglial
    sleep_score = bia_data.get('sleep_efficiency', 0.8)
    microglial_activation = 1.0 - sleep_score  # Simplificado
    
    # Literatura: Baixo HRV → estresse sistêmico → inflamação
    hrv = bia_data.get('hrv', 50)
    inflammatory_state = max(0, (50 - hrv) / 50)
    
    # Declínio cognitivo → saúde neuronal
    cognitive_score = bia_data.get('cognitive_score', 80)
    neuronal_health = cognitive_score / 100
    
    return {
        "microglial_activation": microglial_activation,
        "inflammatory_state": inflammatory_state,
        "neuronal_health": neuronal_health,
        "composite_score": calculate_composite(...)
    }
```

---

## Fluxo de Dados Completo

```
1. COLETA (NeuroTrack-BIA)
   ├─ Microtestes cognitivos → score, tempo, erros
   ├─ HealthKit/Health Connect → sono, HRV, passos
   ├─ Eventos comportamentais → confusão, agitação
   └─ Medicação → adesão, horários
   
2. ENVIO (REST API)
   POST https://api.suzi.health/v1/orchestrate
   {
     "user_id": "...",
     "cognitive": {...},
     "vitals": {...},
     "behavior": {...}
   }
   
3. ORQUESTRAÇÃO (Backend SUZI)
   ├─ Normalização de dados
   ├─ Mapeamento para biomarcadores proxy
   ├─ (Opcional) Análise Cell2Sentence se houver scRNA-seq
   └─ Cálculo de risco integrado
   
4. ARMAZENAMENTO (Banco Unificado)
   ├─ Série temporal de índices cognitivos
   ├─ Assinaturas celulares (proxy ou reais)
   ├─ Scores de risco evolutivos
   └─ Embeddings para ML
   
5. RETORNO (Para o BIA)
   {
     "risk_score": 0.35,
     "trend": "stable",
     "recommendations": [
       "Melhorar qualidade do sono",
       "Aumentar atividade física"
     ],
     "next_assessment": "2026-02-04"
   }
```

---

## Instalação e Setup

### Backend (Python)

```bash
# 1. Criar ambiente
conda create -n suzi-backend python=3.10
conda activate suzi-backend

# 2. Instalar dependências
pip install fastapi uvicorn
pip install cell2sentence
pip install torch transformers
pip install pandas numpy scikit-learn

# 3. Estrutura do projeto
suzi-backend/
├── main.py                          # FastAPI app
├── services/
│   ├── cell2sentence_service.py     # Wrapper do C2S
│   ├── orchestrator.py              # Orquestração principal
│   └── biomarker_mapper.py          # Proxy biomarkers
├── models/
│   └── risk_calculator.py           # Modelos de risco
└── config/
    └── settings.py                  # Configurações

# 4. Executar
uvicorn main:app --reload --port 8000
```

### React Native (BIA)

```typescript
// services/orchestrationService.ts

export const sendToOrchestrator = async (data: {
  cognitiveData: CognitiveAssessment[];
  vitalSigns: VitalSign[];
  behaviorLogs: BehaviorLog[];
}) => {
  const response = await fetch('https://api.suzi.health/v1/orchestrate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      user_id: getUserId(),
      timestamp: new Date().toISOString(),
      cognitive: normalizecognitive(data.cognitiveData),
      vitals: normalizeVitals(data.vitalSigns),
      behavior: normalizeBehavior(data.behaviorLogs)
    })
  });
  
  return await response.json();
};
```

---

## Requisitos de Infraestrutura

### Para Fase 2 (Proxy Biomarkers)
- **CPU**: 2-4 cores suficiente
- **RAM**: 4-8GB
- **Storage**: 10GB
- **Cloud**: AWS t3.medium, GCP e2-medium

### Para Fase 3 (Cell2Sentence Full)
- **CPU**: 8+ cores
- **GPU**: NVIDIA T4 ou melhor (para modelo 2B-27B)
- **RAM**: 16-32GB
- **Storage**: 50GB (modelos + cache)
- **Cloud**: AWS g4dn.xlarge, GCP n1-standard-8 + GPU

---

## Roadmap de Implementação

### Q1 2026: Fase 1 (Completo ✅)
- NeuroTrack-BIA app funcionando
- Coleta de dados cognitivos, comportamentais e HealthKit
- Backend básico recebendo dados

### Q2 2026: Fase 2 (Proxy Biomarkers)
- [ ] Implementar backend de orquestração (FastAPI)
- [ ] Mapear literatura: métricas BIA ↔ marcadores celulares
- [ ] Criar modelo de proxy biomarkers
- [ ] Calcular risk score baseado em proxy
- [ ] Dashboard de visualização no BIA

### Q3 2026: Fase 3 Pilot (Cell2Sentence)
- [ ] Parceria com laboratório para scRNA-seq
- [ ] Integrar Cell2Sentence no backend
- [ ] Testar com 50-100 usuários piloto
- [ ] Validar correlação proxy vs real

### Q4 2026: Fase 3 Scale
- [ ] Deploy Cell2Sentence em produção
- [ ] Escalar para 1000+ usuários
- [ ] Refinar modelos de risco
- [ ] Publicar resultados científicos

---

## Considerações Regulatórias

⚠️ **Importante**:
- Cell2Sentence + risco de Alzheimer = **dispositivo médico** (FDA/ANVISA)
- Fase 2 (proxy) pode ser "wellness", mas deve ter disclaimers
- Fase 3 requer:
  - IRB approval (comitê de ética)
  - Estudos clínicos
  - Submissão regulatória

**Estratégia recomendada**:
1. Lançar como "ferramenta de pesquisa"
2. Coletar dados e validar cientificamente
3. Publicar papers
4. Aplicar para aprovação regulatória

---

## Resumo

**Cell2Sentence** é uma IA revolucionária para análise celular que pode transformar o NeuroTrack-BIA em uma plataforma de monitoramento de Alzheimer de precisão baseada em células.

**Integração realista**:
- **Agora**: Usar proxy biomarkers (Fase 2)
- **6-12 meses**: Pilotar com scRNA-seq de sangue (Fase 3)
- **1-2 anos**: Escalar para produção

**Valor diferencial**:
- Primeiro app consumer que une cognição + comportamento + células
- Monitoramento longitudinal de assinaturas celulares
- Predição de risco personalizada ao nível celular
