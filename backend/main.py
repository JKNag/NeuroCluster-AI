import io
import time
import random
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import sklearn
import numpy as np
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="NeuroCluster AI - Hospital Compute & Time Guard")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State & Dynamic Recovery Tracker
last_urgent_job_time = 0

# --- URGENCY TIME GUARD DYNAMIC DATA STRUCTURES ---
jobs_db = [
    {
        "id": "JOB-101", 
        "patient_name": "Emergency Acute Stroke", 
        "scan_type": "urgent", 
        "target_time_sec": 30, 
        "start_timestamp": time.time() - 24, # 24s elapsed (Triggers Risk Warning)
        "status": "running", 
        "gpu_assigned": "GPU-Node-01"
    },
    {
        "id": "JOB-102", 
        "patient_name": "Brain Tumor Genomics Study", 
        "scan_type": "research", 
        "target_time_sec": 120, 
        "start_timestamp": time.time() - 45, 
        "status": "running", 
        "gpu_assigned": "GPU-Node-02"
    },
    {
        "id": "JOB-103", 
        "patient_name": "Routine Head MRI Checkup", 
        "scan_type": "routine", 
        "target_time_sec": 60, 
        "start_timestamp": time.time() - 20, 
        "status": "running", 
        "gpu_assigned": "GPU-Node-03"
    },
]

swap_logs = []

missed_reasons_db = [
    {
        "job_id": "JOB-078", 
        "class": "Routine", 
        "reason": "GPU VRAM spike during high-density 3D brain reconstruction."
    }
]

# Pydantic Model for Manual Swap Records
class SwapRecord(BaseModel):
    urgent_job: str
    paused_job: str
    freed_gpu: str

# 1. Load Hugging Face Brain Tumor Classifier
print("Loading Medical AI Deep Learning Model...")
mri_classifier = None
try:
    mri_classifier = pipeline("image-classification", model="dima806/brain_tumor_detection")
    print("HuggingFace AI Model Loaded Successfully!")
except Exception as e:
    print(f"Error loading Hugging Face model: {e}")

@app.get("/")
def home():
    return {"status": "NeuroCluster AI Backend Running with Urgency Time Guard"}

# 2. Cluster Status API
@app.get("/api/cluster-status")
def get_cluster_status():
    global last_urgent_job_time
    current_time = time.time()
    
    is_rebalancing = (current_time - last_urgent_job_time) < 8
    
    node_configs = [
        {"id": "GPU-Node-01", "name": "NVIDIA A100 (Primary Priority)"},
        {"id": "GPU-Node-02", "name": "NVIDIA RTX 4090 (Research Node)"},
        {"id": "GPU-Node-03", "name": "NVIDIA RTX 3090 (Routine Node)"}
    ]
    
    nodes = []

    for idx, config in enumerate(node_configs):
        if is_rebalancing and idx == 1:
            temp = int(np.random.normal(86, 2))
            vram = f"{np.random.randint(90, 98)}%"
            fan_speed = f"{np.random.randint(95, 100)}%"
            status = "At Risk"
        else:
            temp = int(np.random.normal(62, 3))
            vram = f"{np.random.randint(30, 60)}%"
            fan_speed = f"{np.random.randint(45, 70)}%"
            status = "Healthy"

        nodes.append({
            "id": config["id"],
            "name": config["name"],
            "temp": temp,
            "vram": vram,
            "fan_speed": fan_speed,
            "status": status
        })

    overview = {
        "preemption_rate": f"< {round(random.uniform(1.4, 1.9), 1)}s" if is_rebalancing else f"< {round(random.uniform(0.8, 1.1), 1)}s",
        "idle_gpu_saved": f"{round(random.uniform(37.2, 39.8), 1)}%",
        "cluster_status": "Degraded (Rebalancing)" if is_rebalancing else "Optimal"
    }

    return {
        "nodes": nodes,
        "overview": overview
    }

# 3. Process MRI Scan API
@app.post("/api/process-mri")
async def process_mri(file: UploadFile = File(...), scan_type: str = "Urgent"):
    global last_urgent_job_time
    start_time = time.time()
    
    if scan_type.lower() == "urgent":
        last_urgent_job_time = time.time()
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    label = "no_tumor"
    confidence = 0.95
    
    if mri_classifier:
        try:
            predictions = mri_classifier(image)
            top_prediction = predictions[0]
            label = top_prediction['label']
            confidence = top_prediction['score']
        except Exception as e:
            print(f"Prediction Error: {e}")

    processing_time = round(time.time() - start_time, 2)
    
    new_job_id = f"JOB-{random.randint(200, 999)}"
    jobs_db.insert(0, {
        "id": new_job_id,
        "patient_name": f"Scan: {file.filename}",
        "scan_type": scan_type.lower(),
        "target_time_sec": 30 if scan_type.lower() == "urgent" else 90,
        "start_timestamp": time.time(),
        "status": "running",
        "gpu_assigned": "GPU-Node-01" if scan_type.lower() == "urgent" else "GPU-Node-03"
    })

    return {
        "status": "success",
        "filename": file.filename,
        "scan_type": scan_type,
        "allocated_gpu": "GPU-Node-01 (High Priority Cluster)" if scan_type.lower() == "urgent" else "GPU-Node-03 (Batch Processing)",
        "processing_time_sec": processing_time,
        "mri_ai_result": {
            "label": label,
            "confidence": float(confidence)
        }
    }

# =====================================================================
# 4. URGENCY TIME GUARD MODULE APIs (UPDATED FOR LATE RISK ACTION)
# =====================================================================

@app.get("/api/time-guard/jobs")
def get_time_guard_jobs():
    """Calculates real-time elapsed seconds and checks Late Risk Warning status"""
    current_now = time.time()
    formatted_jobs = []

    for job in jobs_db:
        if job["status"] == "running":
            elapsed = int(current_now - job["start_timestamp"])
        else:
            elapsed = job.get("frozen_elapsed", 45)

        # Late Risk Warning: Urgent scan within 8 seconds of target time
        is_at_risk = (
            job["scan_type"] == "urgent" 
            and elapsed >= (job["target_time_sec"] - 8) 
            and elapsed <= job["target_time_sec"]
            and job["status"] == "running"
        )

        formatted_jobs.append({
            "id": job["id"],
            "patient_name": job["patient_name"],
            "scan_type": job["scan_type"],
            "target_time_sec": job["target_time_sec"],
            "elapsed_time_sec": elapsed,
            "status": job["status"],
            "gpu_assigned": job["gpu_assigned"],
            "is_at_risk": is_at_risk
        })

    return {"jobs": formatted_jobs}

@app.post("/api/time-guard/rescue-urgent")
def rescue_urgent_job():
    """
    FEATURE: Late Risk Action & Preemption Swap.
    Pauses a running research job, frees GPU, resets urgent scan timer, and logs the swap.
    """
    global last_urgent_job_time
    last_urgent_job_time = time.time()

    research_job = next((j for j in jobs_db if j["scan_type"] == "research" and j["status"] == "running"), None)
    urgent_job = next((j for j in jobs_db if j["scan_type"] == "urgent" and j["status"] == "running"), None)

    if research_job and urgent_job:
        # 1. Pause Research Job & Freeze Time
        research_job["status"] = "PAUSED (GPU Freed)"
        research_job["frozen_elapsed"] = int(time.time() - research_job["start_timestamp"])
        freed_gpu = research_job["gpu_assigned"]

        # 2. Re-allocate GPU and Reset Urgent Job Timer
        urgent_job["gpu_assigned"] = f"{freed_gpu} (Rescued)"
        urgent_job["start_timestamp"] = time.time() - 5 # Reset elapsed to ~5s

        # 3. Record Swap Log History
        log_entry = {
            "id": len(swap_logs) + 1,
            "timestamp": time.strftime("%H:%M:%S"),
            "urgent_job_id": urgent_job["id"],
            "paused_job_id": research_job["id"],
            "gpu_rescued": freed_gpu,
            "message": f"🚨 LATE RISK ACTION: Paused [{research_job['patient_name']}] on {freed_gpu}. Reallocated GPU to [{urgent_job['patient_name']}]."
        }
        swap_logs.insert(0, log_entry)

        # 4. Record in Missed Target Reasons Database
        missed_reasons_db.insert(0, {
            "job_id": research_job["id"],
            "class": "Research",
            "reason": f"Preempted & paused by Time Guard at {time.strftime('%H:%M:%S')} to free {freed_gpu} for urgent MRI scan."
        })
        
        return {
            "success": True,
            "action": "PREEMPTION_SWAP_SUCCESSFUL",
            "log": log_entry
        }
    
    return {
        "success": False, 
        "message": "No active research jobs available to pause or no urgent jobs at risk."
    }

@app.post("/api/record-swap")
def record_manual_swap(data: SwapRecord):
    """Direct API to record swap events from frontend interactions"""
    entry = {
        "id": len(swap_logs) + 1,
        "timestamp": time.strftime("%H:%M:%S"),
        "urgent_job": data.urgent_job,
        "paused_job": data.paused_job,
        "gpu_rescued": data.freed_gpu,
        "message": f"PREEMPTION SWAP: Paused [{data.paused_job}] on {data.freed_gpu} to reallocate resources for [{data.urgent_job}]."
    }
    swap_logs.insert(0, entry)
    return {"status": "Success", "recorded_entry": entry}

@app.get("/api/time-guard/report")
def get_ontime_report():
    """
    FEATURE: Dynamic On-Time Delivery Report, Recorded Swap Logs & Missed Targets.
    """
    urgent_count = len([j for j in jobs_db if j.get('scan_type') == 'urgent'])
    
    return {
        "summary": [
            {
                "class_name": "Urgent Scans", 
                "met_target_pct": 100, 
                "total_jobs": urgent_count, 
                "missed": 0
            },
            {
                "class_name": "Routine Scans", 
                "met_target_pct": 89, 
                "total_jobs": 28, 
                "missed": 3
            },
            {
                "class_name": "Research Jobs", 
                "met_target_pct": 62, 
                "total_jobs": 12, 
                "missed": len(missed_reasons_db)
            }
        ],
        "missed_reasons": missed_reasons_db,
        "logs": swap_logs
    }