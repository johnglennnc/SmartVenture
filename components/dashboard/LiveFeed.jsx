import React from "react";
import { Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LiveFeed({ activities }) {
  const getActivityColor = (type) => {
    switch (type) {
      case 'launch': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'revenue': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'opportunity': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'agent': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Live Activity Feed</h2>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
              <activity.icon className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{activity.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-blue-200/60" />
                <span className="text-xs text-blue-200/60">{activity.time}</span>
                <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                  {activity.type}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}