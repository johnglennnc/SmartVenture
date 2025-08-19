import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap, Shield, TrendingUp, DollarSign, Play } from "lucide-react";

export default function TechOptimizationView({ optimizations, platforms, companies }) {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || "Unknown Company";
  };

  const getPlatformName = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.platform_name || "Unknown Platform";
  };

  const getOptimizationIcon = (type) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'security': return Shield;
      case 'cost_reduction': return DollarSign;
      case 'user_experience': return Lightbulb;
      default: return Zap;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300';
      case 'high': return 'bg-orange-500/20 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'implementing': return 'bg-blue-500/20 text-blue-300';
      case 'identified': return 'bg-purple-500/20 text-purple-300';
      case 'deferred': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'low': return 'text-green-300';
      case 'medium': return 'text-yellow-300';
      case 'high': return 'text-red-300';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {optimizations.map((optimization) => {
          const Icon = getOptimizationIcon(optimization.optimization_type);
          
          return (
            <div key={optimization.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 bg-opacity-20">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{optimization.title}</h3>
                    <p className="text-sm text-blue-200 mb-1">
                      {getPlatformName(optimization.platform_id)} • {getCompanyName(optimization.company_id)}
                    </p>
                    <p className="text-sm text-gray-300">{optimization.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getPriorityColor(optimization.priority)}>
                    {optimization.priority}
                  </Badge>
                  <Badge className={getStatusColor(optimization.status)}>
                    {optimization.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-xs text-blue-200">Implementation Effort</span>
                  <p className={`font-semibold ${getEffortColor(optimization.implementation_effort)}`}>
                    {optimization.implementation_effort?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-200">AI Confidence</span>
                  <p className="font-semibold text-white">{optimization.ai_confidence_score}/100</p>
                </div>
                <div>
                  <span className="text-xs text-blue-200">Auto-Implementable</span>
                  <p className={`font-semibold ${optimization.auto_implementable ? 'text-green-300' : 'text-red-300'}`}>
                    {optimization.auto_implementable ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {optimization.estimated_impact && (
                <div className="mb-4 p-3 bg-black/20 rounded-lg">
                  <span className="text-xs text-blue-200">Expected Impact:</span>
                  <p className="text-white text-sm mt-1">{optimization.estimated_impact}</p>
                </div>
              )}

              <div className="flex gap-2">
                {optimization.status === 'identified' && optimization.auto_implementable && (
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-600">
                    <Play className="w-3 h-3 mr-1" />
                    Auto-Implement
                  </Button>
                )}
                {optimization.status === 'identified' && !optimization.auto_implementable && (
                  <Button size="sm" variant="outline">
                    <Zap className="w-3 h-3 mr-1" />
                    Schedule Implementation
                  </Button>
                )}
                {optimization.status === 'implementing' && (
                  <Button size="sm" variant="outline" disabled>
                    <Zap className="w-3 h-3 mr-1" />
                    In Progress...
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {optimizations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Optimizations Found</h3>
          <p className="text-blue-200">AI will identify optimization opportunities as platforms are analyzed.</p>
        </div>
      )}
    </div>
  );
}