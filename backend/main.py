from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import Detection


# Crear tablas
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SAR-X AI"
)


# Permitir conexión desde React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



class DetectionData(BaseModel):

    latitude: float

    longitude: float

    probability: float



@app.get("/")
def home():

    return {
        "system": "SAR-X AI",
        "status": "online"
    }



@app.post("/detection")
def create_detection(data: DetectionData):

    db = SessionLocal()


    detection = Detection(

        latitude=data.latitude,

        longitude=data.longitude,

        probability=data.probability

    )


    db.add(detection)

    db.commit()

    db.refresh(detection)

    db.close()


    return {

        "message": "Detection saved",

        "id": detection.id

    }



@app.get("/detections")
def get_detections():

    db = SessionLocal()

    detections = db.query(Detection).all()

    db.close()


    return detections

from pydantic import BaseModel


class ConfirmData(BaseModel):

    id: int

    confirmed_by: str



@app.post("/confirm")
def confirm(data: ConfirmData):

    db = SessionLocal()

    detection = db.query(Detection).filter(
        Detection.id == data.id
    ).first()


    if detection is None:

        db.close()

        return {
            "error": "Detection not found"
        }


    detection.status = "confirmed"

    detection.confirmed_by = data.confirmed_by


    db.commit()

    db.close()


    return {
        "message": "Detection confirmed"
    }



@app.post("/false-alarm")
def false_alarm(data: ConfirmData):

    db = SessionLocal()

    detection = db.query(Detection).filter(
        Detection.id == data.id
    ).first()


    if detection is None:

        db.close()

        return {
            "error": "Detection not found"
        }


    detection.status = "false_alarm"

    detection.confirmed_by = data.confirmed_by


    db.commit()

    db.close()


    return {
        "message": "False alarm saved"
    }



@app.get("/alerts")
def alerts():

    db = SessionLocal()

    alerts = db.query(Detection).filter(
        Detection.status == "pending"
    ).all()


    db.close()


    return alerts



@app.get("/missions")
def missions():

    db = SessionLocal()

    missions = db.query(Detection).filter(
        Detection.status == "confirmed"
    ).all()


    db.close()


    return missions
    
