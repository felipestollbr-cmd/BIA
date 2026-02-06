"""
FastAPI Backend for NeuroTrack-BIA + Cell2Sentence Orchestration
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime
import sys
import os

# Add services to path
sys.path.append(os.path.dirname(__file__))

from services.orchestrationService import OrchestrationService

app = FastAPI(
    title="SUZI Neuro API",
    description="Backend orchestration for NeuroTrack-BIA with Cell2Sentence integration",
    version="1.0.0"
)

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specify your domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestration service
orchestrator = OrchestrationService()

# Request/Response Models
class BIADataRequest(BaseModel):
    user_id: str
    timestamp: str
    cognitive_score: Optional[float] = 80
    reaction_time: Optional[float] = 500
    errors: Optional[int] = 2
    sleep_efficiency: Optional[float] = 0.8
    sleep_interruptions: Optional[int] = 2
    hrv: Optional[float] = 45
    resting_hr: Optional[float] = 72
    steps: Optional[int] = 5000
    active_minutes: Optional[int] = 20
    behavior_events: Optional[List[str]] = []
    medication_adherence: Optional[float] = 1.0

class OrchestrationResponse(BaseModel):
    user_id: str
    timestamp: str
    analysis_type: str
    cognitive_indices: Dict
    cellular_signature: Dict
    integrated_risk: Dict
    recommendations: List[Dict]
    next_assessment_due: str
    alerts: List[Dict]

# Health check
@app.get("/")
async def root():
    return {
        "service": "SUZI Neuro API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "orchestrate": "/api/v1/orchestrate",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "orchestrator": "active",
            "cell2sentence": "phase2_proxy"  # Will be "active" when C2S integrated
        }
    }

@app.post("/api/v1/orchestrate", response_model=OrchestrationResponse)
async def orchestrate_analysis(
    data: BIADataRequest,
    background_tasks: BackgroundTasks
):
    """
    Main orchestration endpoint
    
    Receives data from NeuroTrack-BIA and returns:
    - Cellular signatures (proxy biomarkers)
    - Risk scores
    - Personalized recommendations
    - Alerts
    """
    try:
        # Convert request to dict
        bia_data = data.dict()
        
        # Run orchestration
        result = orchestrator.orchestrate(bia_data)
        
        # Save to database in background
        background_tasks.add_task(save_to_database, result)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/cognitive-assessment")
async def submit_cognitive_assessment(
    user_id: str,
    assessment_type: str,
    score: float,
    duration: int,
    errors: int
):
    """
    Submit individual cognitive assessment result
    """
    assessment = {
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        "type": assessment_type,
        "score": score,
        "duration": duration,
        "errors": errors
    }
    
    # Save to database
    await save_assessment(assessment)
    
    return {
        "status": "success",
        "assessment_id": generate_id(),
        "message": "Cognitive assessment saved"
    }

@app.post("/api/v1/behavior-event")
async def submit_behavior_event(
    user_id: str,
    event_type: str,
    severity: int,
    notes: Optional[str] = None
):
    """
    Submit behavior event (confusion, agitation, etc)
    """
    event = {
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        "type": event_type,
        "severity": severity,
        "notes": notes
    }
    
    await save_behavior_event(event)
    
    return {
        "status": "success",
        "event_id": generate_id(),
        "message": "Behavior event logged"
    }

@app.post("/api/v1/vitals-sync")
async def sync_vitals(
    user_id: str,
    vitals: List[Dict]
):
    """
    Bulk sync of HealthKit/Health Connect vitals
    """
    saved_count = 0
    for vital in vitals:
        vital['user_id'] = user_id
        await save_vital_sign(vital)
        saved_count += 1
    
    return {
        "status": "success",
        "synced_count": saved_count,
        "message": f"Synced {saved_count} vital signs"
    }

@app.get("/api/v1/risk-history/{user_id}")
async def get_risk_history(user_id: str, days: int = 30):
    """
    Get historical risk scores for user
    """
    # In production: query database
    history = await fetch_risk_history(user_id, days)
    
    return {
        "user_id": user_id,
        "period_days": days,
        "history": history
    }

@app.get("/api/v1/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    """
    Get current recommendations for user
    """
    # Fetch latest analysis
    latest_analysis = await fetch_latest_analysis(user_id)
    
    if not latest_analysis:
        return {
            "user_id": user_id,
            "recommendations": [],
            "message": "No analysis available yet"
        }
    
    return {
        "user_id": user_id,
        "timestamp": latest_analysis['timestamp'],
        "recommendations": latest_analysis['recommendations']
    }

# Database functions (placeholders - implement with actual DB)
async def save_to_database(result: Dict):
    """Save orchestration result to SUZI unified database"""
    print(f"[DB] Saving analysis for user {result['user_id']}")
    # TODO: Implement actual database save
    # await db.analyses.insert_one(result)

async def save_assessment(assessment: Dict):
    """Save cognitive assessment"""
    print(f"[DB] Saving assessment: {assessment['type']}")
    # TODO: Implement

async def save_behavior_event(event: Dict):
    """Save behavior event"""
    print(f"[DB] Saving behavior event: {event['type']}")
    # TODO: Implement

async def save_vital_sign(vital: Dict):
    """Save vital sign"""
    print(f"[DB] Saving vital: {vital.get('type')}")
    # TODO: Implement

async def fetch_risk_history(user_id: str, days: int) -> List[Dict]:
    """Fetch risk history from database"""
    # TODO: Implement actual database query
    return [
        {"date": "2026-01-28", "risk_score": 0.35, "risk_level": "medium"},
        {"date": "2026-01-21", "risk_score": 0.32, "risk_level": "low"},
        {"date": "2026-01-14", "risk_score": 0.38, "risk_level": "medium"}
    ]

async def fetch_latest_analysis(user_id: str) -> Optional[Dict]:
    """Fetch latest analysis for user"""
    # TODO: Implement
    return None

def generate_id() -> str:
    """Generate unique ID"""
    from uuid import uuid4
    return str(uuid4())

# Run with: uvicorn backend_api:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
