// ... keep existing code (imports and navigationItems) ...

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);

  // Initialize DateSync AI on app startup
  useEffect(() => {
    const initializeDateSync = async () => {
      try {
        const { DateSync } = await import('../utils/DateSyncAI');
        await DateSync.initialize();
      } catch (error) {
        console.error('Failed to initialize DateSync AI:', error);
      }
    };

    initializeDateSync();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* ... keep existing code (style, background effects) ... */}

      {/* Header */}
      <header className="relative backdrop-blur-lg bg-white/5 border-b border-white/10 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                SmartVenture
              </h1>
              <p className="text-xs text-blue-200/60 hidden sm:block">AI-Powered Startup Launcher</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DateSync Status Indicator */}
            <div className="hidden md:block">
              <DateSyncStatus />
            </div>
            
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-200/70 hover:text-white cursor-pointer transition-colors" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{notifications}</span>
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* ... keep existing code (main content and navigation) ... */}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-black/10 backdrop-blur-lg border-r border-white/10 hidden md:block">
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.url
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30'
                  : 'text-blue-200/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* AI Status Panel with DateSync */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <DateSyncStatus showDetails={true} />
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-300">AI Systems Online</span>
            </div>
            <p className="text-xs text-green-200/70">456 agents actively working</p>
          </div>
        </div>
      </aside>
    </div>
  );
}