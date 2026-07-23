import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Nodes from './Nodes';
import Analytics from './Analytics';
import Settings from './Settings';
import { fetchNodes } from './api';

// Layout shell component wrapping Sidebar, Header, and main view container
function DashboardLayout() {
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  // Function to check if FastAPI backend is reachable
  const checkHealth = useCallback(async () => {
    try {
      await fetchNodes();
      setBackendOnline(true);
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      setBackendOnline(false);
    }
  }, []);

  // Poll backend health every 5 seconds
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header backendOnline={backendOnline} lastSync={lastSync} />
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}