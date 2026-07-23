from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NodeRegister(BaseModel):
    node_id: str
    board_type: str
    firmware_version: str
    mac_address: str
    location: str

class EventCreate(BaseModel):
    node_id: str
    event_type: str
    description: str
    previous_state: Optional[str] = None
    current_state: Optional[str] = None