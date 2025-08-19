import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PortfolioChart() {
  // Mock data for portfolio growth
  const data = [
    { month: 'Jan', value: 2.4, companies: 15 },
    { month: 'Feb', value: 3.2, companies: 18 },
    { month: 'Mar', value: 4.8, companies: 24 },
    { month: 'Apr', value: 6.1, companies: 31 },
    { month: 'May', value: 8.9, companies: 38 },
    { month: 'Jun', value: 12.3, companies: 45 },
    { month: 'Jul', value: 15.2, companies: 52 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-lg bg-black/80 border border-white/20 rounded-lg p-3">
          <p className="text-white font-medium">{label}</p>
          <p className="text-cyan-400">
            Value: ${payload[0].value}M
          </p>
          <p className="text-blue-300">
            Companies: {payload[0].payload.companies}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Portfolio Growth</h2>
        <div className="ml-auto text-sm text-green-300 font-medium">+85% YTD</div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              tickFormatter={(value) => `$${value}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}