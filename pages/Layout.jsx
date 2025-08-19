

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CollapsibleMenuItem from './components/common/CollapsibleMenuItem';
import {
  Home,
  Target,
  Briefcase,
  Settings,
  Rocket,
  Bell,
  User,
  Handshake,
  DollarSign,
  Library,
  FileText,
  ClipboardList,
  Code,
  Sparkles,
  Layers
} from "lucide-react";

const launchSyncSubItems = [
  { title: "SalesSync AI", url: createPageUrl("SalesSyncAI"), icon: Handshake },
  { title: "AccuSync AI", url: createPageUrl("AccuSyncAI"), icon: Library },
  { title: "RegSync AI", url: createPageUrl("RegSyncAI"), icon: FileText },
  { title: "OpsSync AI", url: createPageUrl("OpsSyncAI"), icon: ClipboardList },
  { title: "TechSync AI", url: createPageUrl("TechSyncAI"), icon: Code },
];

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Opportunities",
    url: createPageUrl("Opportunities"),
    icon: Target,
  },
  {
    title: "Portfolio",
    url: createPageUrl("Portfolio"),
    icon: Briefcase,
  },
  {
    title: "LaunchSync AI",
    icon: Layers,
    url: launchSyncSubItems[0].url, // Default URL for mobile and initial desktop link
    subItems: launchSyncSubItems,
  },
  {
    title: "Funding",
    url: createPageUrl("Funding"),
    icon: DollarSign,
  },
  {
    title: "Trinity Chat & Tools",
    url: "https://trinity.smartventure.ai",
    icon: Sparkles,
    external: true,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <style>
        {`
          .bg-animation {
            background: linear-gradient(-45deg, #1e293b, #1e40af, #7c3aed, #0f172a);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .floating {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl floating" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl floating" style={{animationDelay: '4s'}}></div>
      </div>

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

      {/* Main content */}
      <main className="relative pb-20 md:ml-64 md:pb-0">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 5).map((item) => {
            // Determine if the item or any of its sub-items are currently active for mobile navigation
            const isActive = item.subItems
              ? item.subItems.some(subItem => location.pathname === subItem.url)
              : location.pathname === item.url;

            if (item.external) {
              return (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Access ${item.title}`}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-blue-200/70 hover:text-white`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </a>
              );
            } else {
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-blue-200/70 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            }
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-black/10 backdrop-blur-lg border-r border-white/10 hidden md:block">
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => {
            if (item.subItems) {
              // Render collapsible menu item for items with sub-items (e.g., LaunchSync AI)
              return <CollapsibleMenuItem key={item.title} item={item} />;
            }
            if (item.external) {
              // Render external link
              return (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Access ${item.title}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-blue-200/70 hover:text-white hover:bg-white/5"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </a>
              );
            }
            // Render internal link
            return (
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
            );
          })}
        </div>

        {/* AI Status Panel */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          
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

