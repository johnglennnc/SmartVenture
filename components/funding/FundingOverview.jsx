import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function FundingOverview({ fundingRounds, bankAccounts, companies, aiVCFirms }) {
  // Mock data for charts
  const capitalFlowData = [
    { month: 'Jan', raised: 2.1, deployed: 1.8 },
    { month: 'Feb', raised: 3.4, deployed: 2.9 },
    { month: 'Mar', raised: 2.8, deployed: 3.2 },
    { month: 'Apr', raised: 4.2, deployed: 3.1 },
    { month: 'May', raised: 5.1, deployed: 4.6 },
    { month: 'Jun', raised: 6.8, deployed: 5.2 }
  ];

  const investorTypeData = [
    { name: 'AI VC Firms', value: 45, color: '#8B5CF6' },
    { name: 'Traditional VC', value: 30, color: '#06B6D4' },
    { name: 'Angel Investors', value: 15, color: '#10B981' },
    { name: 'Strategic', value: 10, color: '#F59E0B' }
  ];

  const totalRaised = fundingRounds.reduce((sum, round) => sum + (round.amount_raised || 0), 0);
  const totalDeployed = bankAccounts.reduce((sum, account) => sum + (account.monthly_spend || 0), 0) * 6;
  const burnRate = totalDeployed / 6; // Monthly burn rate

  return (
    <div className="space-y-6">
      {/* Capital Flow Chart */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Capital Flow Trends</h2>
        </div>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={capitalFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(value) => `$${value}M`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="raised" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Capital Raised"
              />
              <Line 
                type="monotone" 
                dataKey="deployed" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Capital Deployed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <ArrowUpRight className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-green-300 font-semibold">${(totalRaised / 1000000).toFixed(1)}M</p>
            <p className="text-green-200/60 text-sm">Total Raised</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <ArrowDownRight className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-orange-300 font-semibold">${(totalDeployed / 1000000).toFixed(1)}M</p>
            <p className="text-orange-200/60 text-sm">Total Deployed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <DollarSign className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-blue-300 font-semibold">${(burnRate / 1000).toFixed(0)}K</p>
            <p className="text-blue-200/60 text-sm">Monthly Burn</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Investor Distribution */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Investor Distribution</h3>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investorTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {investorTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {investorTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-white text-sm">{item.name}</span>
                </div>
                <span className="text-blue-200/70 text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Funding Activity</h3>
          
          <div className="space-y-4">
            {fundingRounds.slice(0, 5).map((round, index) => {
              const company = companies.find(c => c.id === round.company_id);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{company?.name || 'Unknown Company'}</p>
                      <p className="text-blue-200/60 text-sm capitalize">{round.round_type} Round</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ${((round.amount_raised || 0) / 1000000).toFixed(1)}M
                    </p>
                    <Badge className={`text-xs ${
                      round.status === 'closed' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : round.status === 'active'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {round.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}