import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Users,
  Building2,
  Eye,
  Plus
} from "lucide-react";

export default function FundingRounds({ fundingRounds, companies, aiVCFirms }) {
  const getStatusColor = (status) => {
    const colors = {
      preparing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      active: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      closed: 'bg-green-500/20 text-green-300 border-green-500/30',
      failed: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getRoundTypeColor = (type) => {
    const colors = {
      pre_seed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      seed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      series_a: 'bg-green-500/20 text-green-300 border-green-500/30',
      series_b: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      series_c: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Funding Rounds Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">{fundingRounds.length}</span>
          </div>
          <p className="text-blue-200/60 text-sm">Total Rounds</p>
        </div>
        
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">
              {fundingRounds.filter(r => r.status === 'active').length}
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Active Rounds</p>
        </div>
        
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">
              ${(fundingRounds.reduce((sum, r) => sum + (r.amount_raised || 0), 0) / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Total Raised</p>
        </div>
        
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">
              {Math.round(fundingRounds.reduce((sum, r) => sum + ((r.amount_raised || 0) / (r.amount_requested || 1) * 100), 0) / (fundingRounds.length || 1))}%
            </span>
          </div>
          <p className="text-blue-200/60 text-sm">Avg Success</p>
        </div>
      </div>

      {/* Active Funding Rounds */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Funding Rounds</h2>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-400">
            <Plus className="w-4 h-4 mr-2" />
            Create Round
          </Button>
        </div>

        <div className="space-y-4">
          {fundingRounds.map((round) => {
            const company = companies.find(c => c.id === round.company_id);
            const progressPercentage = Math.round((round.amount_raised || 0) / (round.amount_requested || 1) * 100);
            
            return (
              <div key={round.id} className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {company?.name || 'Unknown Company'}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getRoundTypeColor(round.round_type)}>
                          {round.round_type?.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(round.status)}>
                          {round.status}
                        </Badge>
                        {round.ai_vc_criteria_met && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            AI VC Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Target Amount</span>
                      <span className="text-white font-semibold">
                        ${(round.amount_requested / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Amount Raised</span>
                      <span className="text-green-300 font-semibold">
                        ${(round.amount_raised || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Progress</span>
                      <span className="text-white font-semibold">{progressPercentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Pre-money Valuation</span>
                      <span className="text-white font-semibold">
                        ${(round.valuation_pre / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Post-money Valuation</span>
                      <span className="text-white font-semibold">
                        ${(round.valuation_post / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/60">Lead Investor</span>
                      <span className="text-white font-semibold">
                        {round.lead_investor || 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-200/60">Funding Progress</span>
                    <span className="text-white">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Investors */}
                {round.investors && round.investors.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Investors</h4>
                    <div className="flex flex-wrap gap-2">
                      {round.investors.map((investor, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-white/5">
                          <span className="text-white text-sm">{investor.name}</span>
                          <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">
                            ${(investor.amount / 1000).toFixed(0)}K
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-blue-200/70">
                            {investor.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Funding Purpose */}
                {round.funding_purpose && round.funding_purpose.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Use of Funds</h4>
                    <div className="flex flex-wrap gap-2">
                      {round.funding_purpose.map((purpose, index) => (
                        <Badge key={index} variant="outline" className="bg-white/10 border-white/20 text-white">
                          {purpose}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {fundingRounds.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Funding Rounds</h3>
            <p className="text-blue-200/60 mb-4">Create your first funding round to raise capital</p>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-400">
              <Plus className="w-4 h-4 mr-2" />
              Create First Round
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}