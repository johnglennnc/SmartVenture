
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  Settings,
  Star
} from "lucide-react";

export default function AIVCConnections({ aiVCFirms, fundingRounds, companies }) {
  const getDecisionSpeedColor = (speed) => {
    const colors = {
      instant: 'bg-green-500/20 text-green-300 border-green-500/30',
      hours: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      days: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      weeks: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[speed] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      closed: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const primaryPartners = aiVCFirms.filter(
    vc => vc.name === "SmartVenture VC" || vc.name === "ForumVC AI VC"
  );
  const otherPartners = aiVCFirms.filter(
    vc => vc.name !== "SmartVenture VC" && vc.name !== "ForumVC AI VC"
  );

  const VCCard = ({ vc }) => (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Bot className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {vc.name}
                {(vc.name === "SmartVenture VC" || vc.name === "ForumVC AI VC") && (
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                )}
              </h3>
              <p className="text-blue-200/60">
                ${(vc.fund_size / 1000000).toFixed(0)}M Fund • {vc.total_investments || 0} Investments
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(vc.status)}>
              {vc.status}
            </Badge>
            <Badge className={getDecisionSpeedColor(vc.decision_speed)}>
              <Clock className="w-3 h-3 mr-1" />
              {vc.decision_speed}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <h4 className="text-white font-medium mb-3">Investment Criteria</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200/60">Investment Range</span>
                <span className="text-white">
                  ${(vc.investment_criteria?.min_investment / 1000).toFixed(0)}K -
                  ${(vc.investment_criteria?.max_investment / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/60">Min Revenue</span>
                <span className="text-white">
                  ${(vc.investment_criteria?.min_revenue / 1000 || 0).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/60">Min Growth Rate</span>
                <span className="text-white">{vc.investment_criteria?.min_growth_rate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/60">AI Readiness Score</span>
                <span className="text-white">{vc.investment_criteria?.ai_readiness_score || 0}+</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Performance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200/60">Success Rate</span>
                <span className="text-green-300 font-semibold">{vc.success_rate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/60">Available Capital</span>
                <span className="text-white">
                  ${(vc.available_capital / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/60">Decision Speed</span>
                <span className="text-white capitalize">{vc.decision_speed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Sectors */}
        {vc.investment_criteria?.target_sectors && (
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Target Sectors</h4>
            <div className="flex flex-wrap gap-2">
              {vc.investment_criteria.target_sectors.map((sector, index) => (
                <Badge key={index} variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-blue-200/50 italic">Deal submission is handled autonomously by SmartVenture AI.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* AI VC Network Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">{aiVCFirms.length}</span>
          </div>
          <p className="text-blue-200/60 text-sm">Connected AI VCs</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">
              {Math.round(aiVCFirms.reduce((sum, vc) => sum + (vc.success_rate || 0), 0) / (aiVCFirms.length || 1))}%
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Avg Success Rate</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">
              {aiVCFirms.filter(vc => vc.decision_speed === 'instant' || vc.decision_speed === 'hours').length}
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Fast Decision</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">
              ${(aiVCFirms.reduce((sum, vc) => sum + (vc.available_capital || 0), 0) / 1000000).toFixed(0)}M
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Available Capital</p>
        </div>
      </div>

      {/* Primary Partners */}
      {primaryPartners.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Primary AI VC Partners</h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {primaryPartners.map((vc) => (
              <VCCard key={vc.id} vc={vc} />
            ))}
          </div>
        </div>
      )}


      {/* Other VC Connections */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Other AI VC Network</h2>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Connect New AI VC
          </Button>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {otherPartners.map((vc) => (
            <VCCard key={vc.id} vc={vc} />
          ))}
        </div>

        {aiVCFirms.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No AI VC Firms Connected</h3>
            <p className="text-blue-200/60 mb-4">Connect with AI venture capital firms for automated funding</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="w-4 h-4 mr-2" />
              Connect AI VC Network
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
