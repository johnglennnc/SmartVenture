import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Eye, 
  ExternalLink,
  Bot,
  Calendar,
  Percent
} from "lucide-react";

export default function CompanyCard({ company, agents, onView }) {
  const getStatusColor = (status) => {
    const colors = {
      building: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      testing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      launched: 'bg-green-500/20 text-green-300 border-green-500/30',
      scaling: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      paused: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getNicheColor = (niche) => {
    const colors = {
      fintech: 'bg-green-500/20 text-green-300 border-green-500/30',
      healthtech: 'bg-red-500/20 text-red-300 border-red-500/30',
      edtech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      ai_tools: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      saas: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      ecommerce: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[niche] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const activeAgents = agents.filter(agent => agent.status === 'active').length;

  return (
    <div className="group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 truncate">
            {company.name}
          </h3>
          <div className="flex gap-2 mb-2">
            <Badge className={getNicheColor(company.niche)}>
              {company.niche?.replace('_', ' ')}
            </Badge>
            <Badge className={getStatusColor(company.status)}>
              {company.status}
            </Badge>
          </div>
        </div>
        
        {company.mvp_url && (
          <a
            href={company.mvp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-300/60 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              ${((company.current_valuation || 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-blue-200/60 text-xs">Valuation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              ${((company.monthly_revenue || 0) / 1000).toFixed(1)}K
            </p>
            <p className="text-blue-200/60 text-xs">Monthly Rev</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              {company.equity_stake || 0}%
            </p>
            <p className="text-blue-200/60 text-xs">Our Stake</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-white font-semibold text-sm">
              {activeAgents}/{company.ai_agents_count || 0}
            </p>
            <p className="text-blue-200/60 text-xs">AI Agents</p>
          </div>
        </div>
      </div>

      {/* Growth indicator */}
      <div className="flex items-center gap-2 mb-4">
        {(company.growth_rate || 0) >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-sm font-medium ${
          (company.growth_rate || 0) >= 0 ? 'text-green-300' : 'text-red-300'
        }`}>
          {(company.growth_rate || 0) >= 0 ? '+' : ''}{(company.growth_rate || 0).toFixed(1)}% growth
        </span>
      </div>

      {/* Launch date */}
      <div className="flex items-center gap-2 mb-4 text-blue-200/60">
        <Calendar className="w-4 h-4" />
        <span className="text-xs">
          Launched {company.launch_date ? new Date(company.launch_date).toLocaleDateString() : 'N/A'}
        </span>
      </div>

      {/* Action */}
      <Button
        onClick={onView}
        variant="outline"
        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </Button>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}