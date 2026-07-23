import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface NodeData {
  node_id: string;
  location: string;
  is_online: boolean;
  voltage: number;
  current: number;
  power: number;
  switch_state: string;
  led_state: number;
  fan_state: number;
}

// Fetch all hardware nodes telemetry from FastAPI
export async function fetchNodes(): Promise<NodeData[]> {
  const response = await axios.get(`${API_BASE_URL}/api/nodes`);
  return response.data;
}

// Send control commands (LED, Fan, Relay) to a specific node
export async function sendCommand(nodeId: string, action: 'led' | 'fan' | 'manual', value: number) {
  const response = await axios.post(`${API_BASE_URL}/api/command`, {
    node_id: nodeId,
    action,
    value,
  });
  return response.data;
}