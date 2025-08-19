import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = "up",
  gradient = "from-blue-500 to-cyan-400" 
}) {
  return (
    <div className="relative group">
      {/* Glass morphism card */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-xl`}></div>
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {trend && (
            <Badge 
              variant="secondary" 
              className={`${
                trendDirection === 'up' 
                  ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border-red-500/30'
              } backdrop-blur-sm`}
            >
              {trendDirection === 'up' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {trend}
            </Badge>
          )}
        </div>
        
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {value}
          </h3>
          <p className="text-sm text-blue-200/60">
            {title}
          </p>
        </div>
        
        {/* Hover glow effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
      </div>
    </div>
  );
}