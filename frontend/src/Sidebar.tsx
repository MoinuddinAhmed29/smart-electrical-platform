import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, LineChart, Settings, Zap } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Nodes', path: '/nodes', icon: Cpu },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">Smart Switch</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">IoT Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fleet Core Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-mono">Fleet Core</span>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">v2.0.0-production</p>
        </div>
      </div>
    </aside>
  );
}