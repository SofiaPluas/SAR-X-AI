from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import Detection


# REPARACIÓN INICIAL DE BASE DE DATOS
# Después de que funcione se cambia por solo create_all
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SAR-X AI"
)


# Permitir conexión desde React / Flutter
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



# -----------------------------
# MODELOS DE DATOS
# -----------------------------

class DetectionData(BaseModel):

    latitude: float

    longitude: float

    probability: float



class ConfirmData(BaseModel):

    id: int

    confirmed_by: str



# -----------------------------
# HOME
# -----------------------------

@app.get("/")
def home():

    return {
        "system": "SAR-X AI",
        "status": "online"
    }



# -----------------------------
# CREAR DETECCION
# -----------------------------

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



# -----------------------------
# VER TODAS LAS DETECCIONES
# -----------------------------

@app.get("/detections")
def get_detections():

    db = SessionLocal()

    detections = db.query(Detection).all()

    db.close()


    return detections



# -----------------------------
# CONFIRMAR ALERTA
# -----------------------------

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



# -----------------------------
# FALSA ALARMA
# -----------------------------

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



# -----------------------------
# ALERTAS PENDIENTES
# -----------------------------

@app.get("/alerts")
def alerts():

    db = SessionLocal()



    alerts = db.query(Detection).filter(
        Detection.status == "pending"
    ).all()



    db.close()



    return alerts




# -----------------------------
# MISIONES CONFIRMADAS
# -----------------------------

@app.get("/missions")
def missions():

    db = SessionLocal()



    missions = db.query(Detection).filter(
        Detection.status == "confirmed"
    ).all()



    db.close()



    return missions

