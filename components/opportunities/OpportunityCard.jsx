import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Rocket, 
  Eye,
  ArrowRight,
  Brain
} from "lucide-react";

export default function OpportunityCard({ opportunity, onView, onLaunch }) {
  const getNicheColor = (niche) => {
    const colors = {
      fintech: 'bg-green-500/20 text-green-300 border-green-500/30',
      healthtech: 'bg-red-500/20 text-red-300 border-red-500/30',
      edtech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      ai_tools: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      saas: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      ecommerce: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      climate: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    };
    return colors[niche] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCompetitionColor = (level) => {
    const colors = {
      low: 'bg-green-500/20 text-green-300 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getStatusColor = (status) => {
    const colors = {
      identified: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      analyzing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      ready_to_launch: 'bg-green-500/20 text-green-300 border-green-500/30',
      launched: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <Badge className={getStatusColor(opportunity.status)}>
          {opportunity.status?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-4 pr-20">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {opportunity.title}
        </h3>
        <p className="text-blue-200/70 text-sm line-clamp-3">
          {opportunity.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={getNicheColor(opportunity.niche)}>
          {opportunity.niche?.replace('_', ' ')}
        </Badge>
        <Badge className={getCompetitionColor(opportunity.competition_level)}>
          {opportunity.competition_level} competition
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              ${(opportunity.market_size || 0).toFixed(1)}M
            </p>
            <p className="text-blue-200/60 text-xs">Market Size</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              ${((opportunity.projected_revenue || 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-blue-200/60 text-xs">Projected Rev</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              {opportunity.ai_feasibility || 0}%
            </p>
            <p className="text-blue-200/60 text-xs">AI Feasible</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              {opportunity.confidence_score || 0}%
            </p>
            <p className="text-blue-200/60 text-xs">Confidence</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        
        {opportunity.status === 'ready_to_launch' || opportunity.status === 'identified' ? (
          <Button
            size="sm"
            onClick={onLaunch}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Launch
          </Button>
        ) : (
          <Button
            size="sm"
            disabled
            className="flex-1 bg-gray-500/20 text-gray-400"
          >
            Processing...
          </Button>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}