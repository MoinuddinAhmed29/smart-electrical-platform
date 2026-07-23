import { useState, useEffect, useCallback } from 'react';
import { fetchNodes } from './api';
import type { NodeData } from './api';
import { Cpu, Server } from 'lucide-react';

export default function Nodes() {
  const [nodes, setNodes] = useState<NodeData[]>([]);

  const loadNodes = useCallback(async () => {
    try {
      const data = await fetchNodes();
      setNodes(data);
    } catch (err) {
      console.error("Error fetching nodes table", err);
    }
  }, []);

  useEffect(() => {
    loadNodes();
    const interval = setInterval(loadNodes, 3000);
    return () => clearInterval(interval);
  }, [loadNodes]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Hardware Nodes Fleet</h1>
        <p className="text-sm text-slate-400 mt-1">Detailed status and registry of all connected ESP32 microcontrollers.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Connected Hardware Registry</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Nodes: {nodes.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 bg-slate-950/50">
                <th className="p-4">Node ID</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Voltage</th>
                <th className="p-4">Current</th>
                <th className="p-4">Power</th>
                <th className="p-4">Relay State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
              {nodes.map((node) => (
                <tr key={node.node_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-white font-semibold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    {node.node_id}
                  </td>
                  <td className="p-4 text-slate-300">{node.location}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      node.is_online ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {node.is_online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{node.voltage.toFixed(1)} V</td>
                  <td className="p-4 text-slate-300">{node.current.toFixed(2)} A</td>
                  <td className="p-4 text-amber-400 font-bold">{node.power.toFixed(1)} W</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${node.switch_state === 'CLOSED' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/20 text-rose-400'}`}>
                      {node.switch_state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}