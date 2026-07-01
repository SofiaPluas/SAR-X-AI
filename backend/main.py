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
