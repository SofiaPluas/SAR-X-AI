from sqlalchemy import Column, Integer, Float, String
from database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    probability = Column(Float)
    status = Column(String, default="pending")
    confirmed_by = Column(String, nullable=True)
