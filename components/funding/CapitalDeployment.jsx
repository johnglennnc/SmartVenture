import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingDown, 
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function CapitalDeployment({ bankAccounts, companies, fundingRounds }) {
  // Mock deployment data
  const deploymentData = [
    { month: 'Jan', development: 120, marketing: 80, operations: 45, legal: 25 },
    { month: 'Feb', development: 135, marketing: 95, operations: 52, legal: 30 },
    { month: 'Mar', development: 98, marketing: 110, operations: 48, legal: 22 },
    { month: 'Apr', development: 156, marketing: 88, operations: 65, legal: 35 },
    { month: 'May', development: 142, marketing: 125, operations: 58, legal: 28 },
    { month: 'Jun', development: 168, marketing: 95, operations: 72, legal: 42 }
  ];

  const categoryData = [
    { name: 'Development', value: 40, color: '#8B5CF6' },
    { name: 'Marketing', value: 25, color: '#06B6D4' },
    { name: 'Operations', value: 20, color: '#10B981' },
    { name: 'Legal & Compliance', value: 10, color: '#F59E0B' },
    { name: 'Infrastructure', value: 5, color: '#EF4444' }
  ];

  const totalDeployed = bankAccounts.reduce((sum, account) => {
    if (account.spending_categories) {
      return sum + Object.values(account.spending_categories).reduce((a, b) => a + b, 0);
    }
    return sum + (account.monthly_spend || 0);
  }, 0);

  const averageBurnRate = totalDeployed / (companies.length || 1);

  return (
    <div className="space-y-6">
      {/* Deployment Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <ArrowDownRight className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Total Deployed</h3>
              <p className="text-2xl font-bold text-orange-300">
                ${(totalDeployed / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">This month across all companies</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Avg Burn Rate</h3>
              <p className="text-2xl font-bold text-red-300">
                ${(averageBurnRate / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">Per company monthly</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Runway</h3>
              <p className="text-2xl font-bold text-blue-300">
                {Math.round((bankAccounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0)) / (totalDeployed || 1))} mo
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">At current burn rate</p>
        </div>
      </div>

      {/* Deployment Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Deployment Trends */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Monthly Deployment by Category</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deploymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" tickFormatter={(value) => `$${value}K`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="development" fill="#8B5CF6" name="Development" />
                <Bar dataKey="marketing" fill="#06B6D4" name="Marketing" />
                <Bar dataKey="operations" fill="#10B981" name="Operations" />
                <Bar dataKey="legal" fill="#F59E0B" name="Legal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Categories */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Spending Distribution</h3>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {categoryData.map((item, index) => (
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
      </div>

      {/* Company-wise Deployment */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Company-wise Capital Deployment</h2>
        
        <div className="space-y-4">
          {companies.map((company) => {
            const companyAccounts = bankAccounts.filter(acc => acc.company_id === company.id);
            const companySpend = companyAccounts.reduce((sum, acc) => sum + (acc.monthly_spend || 0), 0);
            const efficiency = companySpend > 0 ? (company.monthly_revenue || 0) / companySpend : 0;
            
            return (
              <div key={company.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-semibold">{company.name}</h3>
                      <p className="text-blue-200/60 text-sm capitalize">{company.niche}</p>
                    </div>
                  </div>
                  <Badge className={`${
                    efficiency > 2 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : efficiency > 1 
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {efficiency.toFixed(1)}x ROI
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-blue-200/60 text-sm">Monthly Spend</p>
                    <p className="text-white font-semibold">${companySpend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/60 text-sm">Monthly Revenue</p>
                    <p className="text-white font-semibold">${(company.monthly_revenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/60 text-sm">Bank Balance</p>
                    <p className="text-white font-semibold">
                      ${companyAccounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200/60 text-sm">Runway</p>
                    <p className="text-white font-semibold">
                      {companySpend > 0 
                        ? Math.round(companyAccounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0) / companySpend)
                        : '∞'
                      } mo
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Companies Found</h3>
            <p className="text-blue-200/60">Launch some companies to see deployment analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}