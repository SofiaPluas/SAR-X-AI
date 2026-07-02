from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
from datetime import datetime


class Detection(Base):

    __tablename__ = "detections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    latitude = Column(Float)

    longitude = Column(Float)

    probability = Column(Float)

    status = Column(
        String,
        default="pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    photo = Column(
        String,
        nullable=True
    )

    audio = Column(
        String,
        nullable=True
    )

    confirmed_by = Column(
        String,
        nullable=True
    )
