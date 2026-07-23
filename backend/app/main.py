from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn
import os

app = FastAPI()

nodes = {}

@app.post("/telemetry")
async def receive_telemetry(data: dict):
    node_id = data.get("node_id", "UNKNOWN")
    if node_id not in nodes:
        nodes[node_id] = {"manual_mode": True, "led_state": 0, "fan_state": 0, "voltage": 0, "switch_state": "OPEN"}
    
    nodes[node_id]["voltage"] = data.get("voltage", 0)
    nodes[node_id]["switch_state"] = data.get("switch_state", "OPEN")
    return {"status": "success"}

@app.get("/data")
async def get_data():
    return nodes

@app.post("/command/{node_id}/{action}/{value}")
async def send_command(node_id: str, action: str, value: int):
    if node_id in nodes:
        if action == "led":
            nodes[node_id]["led_state"] = value
        elif action == "fan":
            nodes[node_id]["fan_state"] = value
        elif action == "manual":
            nodes[node_id]["manual_mode"] = bool(value)
    return {"status": "success"}

@app.get("/config/{node_id}")
async def get_config(node_id: str):
    # If the node doesn't exist, return a default state
    if node_id not in nodes:
        return {"led_state": 0, "fan_state": 0, "manual_mode": True}
    
    return {
        "led_state": nodes[node_id]["led_state"], 
        "fan_state": nodes[node_id]["fan_state"],
        "manual_mode": nodes[node_id]["manual_mode"]
    }

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    file_path = os.path.join(os.path.dirname(__file__), "dashboard.html")
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return f.read()
    return "<h1>Dashboard not found</h1>"

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)