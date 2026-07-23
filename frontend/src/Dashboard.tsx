import { useState, useEffect, useCallback } from 'react';
import NodeCard from './NodeCard';
import { fetchNodes, sendCommand } from './api';
import type { NodeData } from './api';
import { Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function Dashboard() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch nodes from Raspberry Pi backend
  const loadData = useCallback(async () => {
    try {
      const data = await fetchNodes();
      setNodes(data);
    } catch (err) {
      console.error("Failed to fetch nodes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll telemetry every 3 seconds for real-time updates
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handler for toggle buttons (LED / Fan / Relay)
  const handleCommand = async (nodeId: string, action: 'led' | 'fan' | 'manual', value: number) => {
    try {
      await sendCommand(nodeId, action, value);
      await loadData(); // Immediately refresh data after command execution
    } catch (err) {
      console.error("Failed to send command", err);
    }
  };

  const onlineCount = nodes.filter(n => n.is_online).length;
  const totalPower = nodes.reduce((acc, n) => acc + (n.power || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time telemetry and hardware controls from Raspberry Pi core.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-slate-300">Active Nodes: <strong className="text-white">{onlineCount}/{nodes.length}</strong></span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">Total Power: <strong className="text-white">{totalPower.toFixed(1)} W</strong></span>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">Loading telemetry stream from Raspberry Pi...</div>
      ) : nodes.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No nodes detected in fleet.</p>
          <p className="text-slate-500 text-xs mt-1">Ensure your ESP32 hardware is connected and sending telemetry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nodes.map((node) => (
            <NodeCard key={node.node_id} node={node} onCommand={handleCommand} />
          ))}
        </div>
      )}
    </div>
  );
}