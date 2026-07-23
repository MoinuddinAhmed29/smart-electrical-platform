import { Power, Cpu, Zap, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import type { NodeData } from './api';

interface NodeCardProps {
  node: NodeData;
  onCommand: (nodeId: string, action: 'led' | 'fan' | 'manual', value: number) => void;
}

export default function NodeCard({ node, onCommand }: NodeCardProps) {
  const isRelayClosed = node.switch_state === 'CLOSED';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{node.node_id}</h3>
              <p className="text-xs text-slate-400 font-mono">{node.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-2.5 w-2.5 rounded-full ${node.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-mono text-slate-400">{node.is_online ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Voltage</span>
            </div>
            <p className="text-lg font-bold font-mono text-white">{node.voltage.toFixed(1)} <span className="text-xs font-normal text-slate-400">V</span></p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1 font-mono">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Current</span>
            </div>
            <p className="text-lg font-bold font-mono text-white">{node.current.toFixed(2)} <span className="text-xs font-normal text-slate-400">A</span></p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1 font-mono">
              <Power className="w-3.5 h-3.5 text-emerald-400" />
              <span>Power</span>
            </div>
            <p className="text-lg font-bold font-mono text-white">{node.power.toFixed(1)} <span className="text-xs font-normal text-slate-400">W</span></p>
          </div>
        </div>
      </div>

      {/* Manual Control Actions Panel */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        {/* Main Relay Manual Switch */}
        <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
          <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <span>Manual Relay:</span>
            <span className={`font-bold ${isRelayClosed ? 'text-emerald-400' : 'text-rose-400'}`}>{node.switch_state}</span>
          </div>
          <button
            onClick={() => onCommand(node.node_id, 'manual', isRelayClosed ? 0 : 1)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isRelayClosed
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30'
                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
            }`}
          >
            {isRelayClosed ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            {isRelayClosed ? 'Trip / Open' : 'Close / Power On'}
          </button>
        </div>

        {/* Peripheral Controls (LED & Fan) */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Peripherals:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCommand(node.node_id, 'led', node.led_state === 1 ? 0 : 1)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                node.led_state === 1
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              LED {node.led_state === 1 ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => onCommand(node.node_id, 'fan', node.fan_state === 1 ? 0 : 1)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                node.fan_state === 1
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              FAN {node.fan_state === 1 ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}