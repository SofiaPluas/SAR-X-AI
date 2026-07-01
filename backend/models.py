from sqlalchemy import Column, Integer, Float, DateTime
from database import Base
from datetime import datetime


class Detection(Base):

    __tablename__ = "detections"


    id = Column(
        Integer,
        primary_key=True
    )


    latitude = Column(
        Float
    )


    longitude = Column(
        Float
    )


    probability = Column(
        Float
    )


    created = Column(
        DateTime,
        default=datetime.utcnow
    )

