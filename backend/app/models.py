from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Node(Base):
    __tablename__ = "nodes"
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, unique=True, index=True)
    board_type = Column(String)
    firmware_version = Column(String)
    mac_address = Column(String, unique=True)
    location = Column(String)
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    node_id = Column(String, index=True)
    event_type = Column(String)
    description = Column(String)