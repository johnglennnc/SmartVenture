import React from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OptimizationView({ optimizations, companies }) {
  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">AI-Identified Financial Optimizations</h2>
      </div>
      
      <div className="space-y-4">
        {optimizations.map((opp) => {
          const company = companies.find(c => c.id === opp.company_id);
          return (
            <div key={opp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{opp.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">{opp.category.replace(/_/g, ' ')}</Badge>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">{company?.name || 'All Companies'}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-300 font-bold">${opp.potential_savings.toLocaleString()}</p>
                  <p className="text-xs text-blue-200/60">Potential Savings</p>
                </div>
              </div>
              <p className="text-blue-200/70 text-sm mb-4">{opp.description}</p>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400" disabled={opp.status !== 'identified'}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {opp.status === 'identified' ? 'Auto-Implement' : `Status: ${opp.status}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}