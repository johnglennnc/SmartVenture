import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Search, 
  Bot, 
  Settings,
  Zap,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions({ onAutoLaunch }) {
  const actions = [
    {
      title: "Scan Market",
      description: "Find new opportunities",
      icon: Search,
      gradient: "from-purple-500 to-pink-500",
      action: () => window.location.href = createPageUrl("Opportunities")
    },
    {
      title: "Launch Startup",
      description: "Deploy new company",
      icon: Rocket,
      gradient: "from-blue-500 to-cyan-400",
      action: onAutoLaunch
    },
    {
      title: "Deploy Agents",
      description: "Scale AI workforce",
      icon: Bot,
      gradient: "from-green-500 to-emerald-400",
      action: () => console.log("Deploy agents")
    },
    {
      title: "Optimize",
      description: "Enhance performance",
      icon: Settings,
      gradient: "from-orange-500 to-red-400",
      action: () => window.location.href = createPageUrl("Settings")
    }
  ];

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            variant="ghost"
            className="h-auto p-4 flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-20`}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white text-sm">{action.title}</div>
              <div className="text-xs text-blue-200/60">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}