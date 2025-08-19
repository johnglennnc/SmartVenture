import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Building, 
  Bot,
  Percent,
  BarChart3
} from "lucide-react";

export default function PortfolioStats({ totalValue, totalRevenue, totalCompanies, totalAgents }) {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      change: "+24.5%",
      icon: BarChart3,
      gradient: "from-green-500 to-emerald-400"
    },
    {
      title: "Total Revenue Generated",
      value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
      change: "+18.2%",
      icon: DollarSign,
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      title: "Active Companies",
      value: totalCompanies.toString(),
      change: "+12%",
      icon: Building,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "AI Agents Deployed",
      value: totalAgents.toString(),
      change: "+8.7%",
      icon: Bot,
      gradient: "from-orange-500 to-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="relative group">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-xl`}></div>
            
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} bg-opacity-20`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-300 font-medium">{stat.change}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-blue-200/60">
                {stat.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}