interface HeaderProps {
  backendOnline: boolean;
  lastSync: string;
}

export default function Header({ backendOnline, lastSync }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
      {/* Workspace Context Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Workspace /</span>
        <span className="text-xs font-mono font-medium text-white">Distributed Electrical Platform</span>
      </div>

      {/* System Health Status Badge */}
      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner">
        <div className="flex items-center gap-2">
          {backendOnline ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
          <span className="text-xs font-medium tracking-wide text-slate-300">
            {backendOnline ? 'Cloud Synced' : 'Backend Offline'}
          </span>
        </div>
        <div className="h-3.5 w-[1px] bg-slate-800" />
        <span className="text-[11px] text-slate-400 font-mono">Sync: {lastSync}</span>
      </div>
    </header>
  );
}