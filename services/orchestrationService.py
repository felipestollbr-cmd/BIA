"""
Cell2Sentence Orchestration Service for NeuroTrack-BIA
Integrates cognitive/behavioral data with cellular analysis
"""

from typing import Dict, List, Optional
from datetime import datetime
import numpy as np

class BiomarkerMapper:
    """
    Maps NeuroTrack-BIA metrics to cellular signatures
    Based on scientific literature correlations
    """
    
    @staticmethod
    def map_sleep_to_microglial_activation(sleep_efficiency: float, interruptions: int) -> float:
        """
        Literature: Poor sleep → microglial activation → neuroinflammation
        References: PMC11272704 (cellular senescence in neurodegeneration)
        """
        # Sleep efficiency < 80% correlates with increased microglial activation
        base_activation = max(0, (0.85 - sleep_efficiency) / 0.85)
        
        # Each interruption adds ~5% activation
        interruption_factor = min(0.3, interruptions * 0.05)
        
        return min(1.0, base_activation + interruption_factor)
    
    @staticmethod
    def map_hrv_to_inflammatory_state(hrv: float, resting_hr: float) -> float:
        """
        Literature: Low HRV → systemic inflammation → AD risk
        Normal HRV: 40-60ms, Resting HR: 60-100 bpm
        """
        # HRV below 40ms indicates high inflammatory state
        hrv_score = max(0, (50 - hrv) / 50) if hrv < 50 else 0
        
        # Elevated resting HR (>80) indicates inflammation
        hr_score = max(0, (resting_hr - 70) / 30) if resting_hr > 70 else 0
        
        return min(1.0, (hrv_score + hr_score) / 2)
    
    @staticmethod
    def map_cognitive_to_neuronal_health(
        cognitive_score: float,
        reaction_time: float,
        errors: int
    ) -> float:
        """
        Literature: Cognitive decline correlates with neuronal dysfunction
        """
        # Cognitive score (0-100) directly maps to neuronal health
        cognitive_factor = cognitive_score / 100
        
        # Slow reaction time (>800ms) indicates neuronal dysfunction
        reaction_factor = max(0, min(1, (1000 - reaction_time) / 500))
        
        # Errors indicate executive dysfunction
        error_factor = max(0, 1 - (errors * 0.1))
        
        # Weighted average
        return (cognitive_factor * 0.5 + reaction_factor * 0.3 + error_factor * 0.2)
    
    @staticmethod
    def map_activity_to_metabolic_health(steps: int, active_minutes: int) -> float:
        """
        Literature: Sedentary lifestyle → oxidative stress → neurodegeneration
        """
        # WHO recommendation: 150 min/week moderate activity, ~7500 steps/day
        steps_score = min(1.0, steps / 7500)
        activity_score = min(1.0, active_minutes / 30)  # Daily target
        
        return (steps_score + activity_score) / 2


class CellularSignatureCalculator:
    """
    Calculates cellular signatures from NeuroTrack-BIA data
    Phase 2: Proxy biomarkers (no actual scRNA-seq required)
    """
    
    def __init__(self):
        self.mapper = BiomarkerMapper()
    
    def calculate_signature(self, bia_data: Dict) -> Dict:
        """
        Main orchestration: BIA data → cellular signature
        """
        # Extract metrics from BIA
        sleep_efficiency = bia_data.get('sleep_efficiency', 0.8)
        sleep_interruptions = bia_data.get('sleep_interruptions', 2)
        hrv = bia_data.get('hrv', 45)
        resting_hr = bia_data.get('resting_hr', 72)
        cognitive_score = bia_data.get('cognitive_score', 80)
        reaction_time = bia_data.get('reaction_time', 500)
        errors = bia_data.get('errors', 2)
        steps = bia_data.get('steps', 5000)
        active_minutes = bia_data.get('active_minutes', 20)
        
        # Map to cellular signatures
        microglial_activation = self.mapper.map_sleep_to_microglial_activation(
            sleep_efficiency, sleep_interruptions
        )
        
        inflammatory_state = self.mapper.map_hrv_to_inflammatory_state(
            hrv, resting_hr
        )
        
        neuronal_health = self.mapper.map_cognitive_to_neuronal_health(
            cognitive_score, reaction_time, errors
        )
        
        metabolic_health = self.mapper.map_activity_to_metabolic_health(
            steps, active_minutes
        )
        
        # Calculate composite AD risk score
        # Weighted by clinical significance
        ad_risk_score = (
            microglial_activation * 0.25 +
            inflammatory_state * 0.25 +
            (1 - neuronal_health) * 0.35 +  # Inverted (low health = high risk)
            (1 - metabolic_health) * 0.15
        )
        
        return {
            "timestamp": datetime.now().isoformat(),
            "cellular_signature": {
                "microglial_activation": round(microglial_activation, 3),
                "inflammatory_state": round(inflammatory_state, 3),
                "neuronal_health": round(neuronal_health, 3),
                "metabolic_health": round(metabolic_health, 3)
            },
            "ad_risk_score": round(ad_risk_score, 3),
            "risk_level": self._classify_risk(ad_risk_score),
            "contributing_factors": self._identify_factors(
                microglial_activation,
                inflammatory_state,
                neuronal_health,
                metabolic_health
            )
        }
    
    def _classify_risk(self, score: float) -> str:
        """Classify risk level based on composite score"""
        if score < 0.3:
            return "low"
        elif score < 0.6:
            return "medium"
        else:
            return "high"
    
    def _identify_factors(
        self,
        microglial: float,
        inflammatory: float,
        neuronal: float,
        metabolic: float
    ) -> List[str]:
        """Identify main contributing factors to risk"""
        factors = []
        
        if microglial > 0.6:
            factors.append("sleep_quality")
        if inflammatory > 0.6:
            factors.append("systemic_inflammation")
        if neuronal < 0.4:
            factors.append("cognitive_decline")
        if metabolic < 0.4:
            factors.append("sedentary_lifestyle")
        
        return factors


class RecommendationEngine:
    """
    Generates personalized recommendations based on cellular signatures
    """
    
    @staticmethod
    def generate_recommendations(cellular_signature: Dict, bia_data: Dict) -> List[Dict]:
        """
        Generate actionable recommendations
        """
        recommendations = []
        sig = cellular_signature['cellular_signature']
        factors = cellular_signature['contributing_factors']
        
        # Sleep recommendations
        if 'sleep_quality' in factors or sig['microglial_activation'] > 0.5:
            recommendations.append({
                "category": "sleep",
                "priority": "high",
                "title": "Melhorar Qualidade do Sono",
                "actions": [
                    "Manter horário regular de dormir (antes das 22h)",
                    "Evitar telas 1h antes de dormir",
                    "Ambiente escuro e fresco (18-20°C)"
                ],
                "impact": "Reduz inflamação cerebral e melhora consolidação de memória"
            })
        
        # Anti-inflammatory recommendations
        if 'systemic_inflammation' in factors or sig['inflammatory_state'] > 0.5:
            recommendations.append({
                "category": "nutrition",
                "priority": "high",
                "title": "Dieta Anti-Inflamatória",
                "actions": [
                    "Aumentar ômega-3 (peixes, nozes)",
                    "Reduzir açúcar e processados",
                    "Adicionar cúrcuma e chá verde"
                ],
                "impact": "Reduz marcadores inflamatórios sistêmicos"
            })
        
        # Cognitive stimulation
        if 'cognitive_decline' in factors or sig['neuronal_health'] < 0.6:
            recommendations.append({
                "category": "cognitive",
                "priority": "high",
                "title": "Estimulação Cognitiva Diária",
                "actions": [
                    "Realizar 2-3 microtestes por dia no app",
                    "Aprender algo novo (idioma, instrumento)",
                    "Jogos de estratégia e quebra-cabeças"
                ],
                "impact": "Estimula plasticidade neural e neuroproteção"
            })
        
        # Physical activity
        if 'sedentary_lifestyle' in factors or sig['metabolic_health'] < 0.6:
            recommendations.append({
                "category": "exercise",
                "priority": "medium",
                "title": "Aumentar Atividade Física",
                "actions": [
                    "Meta: 7500 passos por dia",
                    "30 min de exercício aeróbico 5x/semana",
                    "Incluir treino de força 2x/semana"
                ],
                "impact": "Melhora fluxo sanguíneo cerebral e reduz estresse oxidativo"
            })
        
        # Stress management (always relevant)
        if sig['inflammatory_state'] > 0.4:
            recommendations.append({
                "category": "stress",
                "priority": "medium",
                "title": "Gerenciamento de Estresse",
                "actions": [
                    "Meditação 10-15 min/dia",
                    "Exercícios de respiração profunda",
                    "Contato social regular"
                ],
                "impact": "Reduz cortisol e inflamação sistêmica"
            })
        
        return recommendations


class OrchestrationService:
    """
    Main orchestration service
    Coordinates data from NeuroTrack-BIA and generates insights
    """
    
    def __init__(self):
        self.signature_calculator = CellularSignatureCalculator()
        self.recommendation_engine = RecommendationEngine()
    
    def orchestrate(self, bia_data: Dict) -> Dict:
        """
        Main orchestration pipeline
        
        Args:
            bia_data: Data from NeuroTrack-BIA app
            
        Returns:
            Comprehensive analysis with risk scores and recommendations
        """
        # Calculate cellular signature from proxy biomarkers
        cellular_signature = self.signature_calculator.calculate_signature(bia_data)
        
        # Generate personalized recommendations
        recommendations = self.recommendation_engine.generate_recommendations(
            cellular_signature,
            bia_data
        )
        
        # Calculate trend (requires historical data)
        trend = self._calculate_trend(bia_data.get('user_id'))
        
        # Compile final response
        return {
            "user_id": bia_data.get('user_id'),
            "timestamp": datetime.now().isoformat(),
            "analysis_type": "proxy_biomarkers",  # Phase 2
            
            # Core metrics
            "cognitive_indices": {
                "stability_index": bia_data.get('cognitive_score', 80),
                "engagement_index": bia_data.get('engagement', 75),
                "decline_rate": trend.get('cognitive_decline_rate', 0)
            },
            
            # Cellular insights (proxy)
            "cellular_signature": cellular_signature,
            
            # Integrated risk
            "integrated_risk": {
                "overall_score": cellular_signature['ad_risk_score'],
                "risk_level": cellular_signature['risk_level'],
                "cognitive_component": (100 - bia_data.get('cognitive_score', 80)) / 100,
                "cellular_component": cellular_signature['ad_risk_score'],
                "confidence": 0.75  # Phase 2 proxy = moderate confidence
            },
            
            # Actionable insights
            "recommendations": recommendations,
            
            # Monitoring
            "next_assessment_due": self._calculate_next_assessment(
                cellular_signature['risk_level']
            ),
            "alerts": self._generate_alerts(cellular_signature, bia_data)
        }
    
    def _calculate_trend(self, user_id: str) -> Dict:
        """
        Calculate trends from historical data
        In production: query database for user's history
        """
        # Placeholder - would query SUZI database
        return {
            "cognitive_decline_rate": 0.5,  # % per month
            "sleep_trend": "improving",
            "activity_trend": "stable"
        }
    
    def _calculate_next_assessment(self, risk_level: str) -> str:
        """
        Determine when next assessment should be done
        """
        from datetime import timedelta
        
        if risk_level == "high":
            days = 7  # Weekly for high risk
        elif risk_level == "medium":
            days = 14  # Bi-weekly for medium
        else:
            days = 30  # Monthly for low risk
        
        next_date = datetime.now() + timedelta(days=days)
        return next_date.isoformat()
    
    def _generate_alerts(self, cellular_signature: Dict, bia_data: Dict) -> List[Dict]:
        """
        Generate alerts for concerning patterns
        """
        alerts = []
        
        # High risk alert
        if cellular_signature['risk_level'] == 'high':
            alerts.append({
                "severity": "high",
                "type": "risk_elevation",
                "message": "Score de risco elevado detectado. Considere consulta médica.",
                "action_required": True
            })
        
        # Rapid decline alert
        cognitive_score = bia_data.get('cognitive_score', 80)
        if cognitive_score < 60:
            alerts.append({
                "severity": "medium",
                "type": "cognitive_decline",
                "message": "Declínio cognitivo detectado nos últimos testes.",
                "action_required": True
            })
        
        # Poor sleep alert
        sleep_efficiency = bia_data.get('sleep_efficiency', 0.8)
        if sleep_efficiency < 0.7:
            alerts.append({
                "severity": "medium",
                "type": "sleep_quality",
                "message": "Qualidade do sono abaixo do recomendado.",
                "action_required": False
            })
        
        return alerts


# Example usage
if __name__ == "__main__":
    # Sample data from NeuroTrack-BIA
    sample_bia_data = {
        "user_id": "user123",
        "timestamp": "2026-01-28T10:30:00Z",
        "cognitive_score": 75,
        "reaction_time": 650,  # ms
        "errors": 3,
        "sleep_efficiency": 0.78,
        "sleep_interruptions": 3,
        "hrv": 38,  # Low
        "resting_hr": 78,
        "steps": 4500,  # Low
        "active_minutes": 15
    }
    
    # Run orchestration
    orchestrator = OrchestrationService()
    result = orchestrator.orchestrate(sample_bia_data)
    
    # Print results
    import json
    print(json.dumps(result, indent=2))
