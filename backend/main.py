
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import asyncio
import cv2

from database import engine, Base, SessionLocal
from models import Detection
from ai.yolo_realtime import analyze_frame


# ---------------- INIT DB ----------------
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SAR-X AI")


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- MODELOS ----------------
class DetectionData(BaseModel):
    latitude: float
    longitude: float
    probability: float


class ConfirmData(BaseModel):
    id: int
    confirmed_by: str


class DetectionOut(BaseModel):
    id: int
    latitude: float
    longitude: float
    probability: float
    status: str

    class Config:
        orm_mode = True


# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"system": "SAR-X AI", "status": "online"}


# ---------------- CREAR DETECCIÓN ----------------
@app.post("/detection")
def create_detection(data: DetectionData):
    db = SessionLocal()

    detection = Detection(
        latitude=data.latitude,
        longitude=data.longitude,
        probability=data.probability,
        status="pending"
    )

    db.add(detection)
    db.commit()
    db.refresh(detection)
    db.close()

    return {
        "id": detection.id,
        "latitude": detection.latitude,
        "longitude": detection.longitude,
        "probability": detection.probability,
        "status": detection.status
    }


# ---------------- VER DETECCIONES ----------------
@app.get("/detections", response_model=list[DetectionOut])
def get_detections():
    db = SessionLocal()
    data = db.query(Detection).all()
    db.close()
    return data


# ---------------- CONFIRMAR ----------------
@app.post("/confirm")
def confirm(data: ConfirmData):
    db = SessionLocal()

    detection = db.query(Detection).filter(Detection.id == data.id).first()

    if not detection:
        db.close()
        return {"error": "Detection not found"}

    detection.status = "confirmed"
    detection.confirmed_by = data.confirmed_by

    db.commit()
    db.close()

    return {"message": "Detection confirmed"}


# ---------------- FALSA ALARMA ----------------
@app.post("/false-alarm")
def false_alarm(data: ConfirmData):
    db = SessionLocal()

    detection = db.query(Detection).filter(Detection.id == data.id).first()

    if not detection:
        db.close()
        return {"error": "Detection not found"}

    detection.status = "false_alarm"
    detection.confirmed_by = data.confirmed_by

    db.commit()
    db.close()

    return {"message": "False alarm saved"}


# ---------------- WEBSOCKET YOLO EN TIEMPO REAL ----------------
@app.websocket("/ws/yolo")
async def yolo_stream(websocket: WebSocket):
    await websocket.accept()

    cap = cv2.VideoCapture(0)

    try:
        while True:
            ret, frame = cap.read()

            if not ret:
                break

            # 🧠 YOLO detection
            people = analyze_frame(frame)

            # 📊 score de supervivencia
            score = min(people * 0.4, 1.0)

            # 📡 enviar al frontend
            await websocket.send_json({
                "people_detected": people,
                "survivor_score": score,
                "status": "critical" if score > 0.7 else "low"
            })

            # 🔥 evitar saturar CPU
            await asyncio.sleep(0.2)

    except Exception as e:
        print("ERROR:", e)

    finally:
        cap.release()
