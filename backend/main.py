
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import Detection

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SAR-X AI")

# CORS (React / Flutter)
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


# ---------------- CREAR DETECCION ----------------

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


# ---------------- ALERTAS PENDIENTES ----------------

@app.get("/alerts")
def alerts():
    db = SessionLocal()
    data = db.query(Detection).filter(Detection.status == "pending").all()
    db.close()
    return data


# ---------------- MISIONES ----------------

@app.get("/missions")
def missions():
    db = SessionLocal()
    data = db.query(Detection).filter(Detection.status == "confirmed").all()
    db.close()
    return data
