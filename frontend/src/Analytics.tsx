import { useState, useEffect } from 'react';
import ChartCard from './ChartCard';
import { fetchNodes } from './api';

export default function Analytics() {
  const [voltageData, setVoltageData] = useState<Array<{ time: string; value: number }>>([]);
  const [powerData, setPowerData] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    const loadStream = async () => {
      try {
        const nodes = await fetchNodes();
        if (nodes.length > 0) {
          const timeNow = new Date().toLocaleTimeString();
          const avgVoltage = nodes.reduce((acc, n) => acc + n.voltage, 0) / nodes.length;
          const totalPower = nodes.reduce((acc, n) => acc + n.power, 0);

          setVoltageData(prev => [...prev.slice(-15), { time: timeNow, value: Number(avgVoltage.toFixed(1)) }]);
          setPowerData(prev => [...prev.slice(-15), { time: timeNow, value: Number(totalPower.toFixed(1)) }]);
        }
      } catch (err) {
        console.error("Analytics stream error", err);
      }
    };

    loadStream();
    const interval = setInterval(loadStream, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Live historical telemetry streams for voltage fluctuations and power consumption.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Average Fleet Voltage"
          data={voltageData}
          color="#38bdf8"
          unit="V"
        />
        <ChartCard
          title="Total System Power Consumption"
          data={powerData}
          color="#f59e0b"
          unit="W"
        />
      </div>
    </div>
  );
}