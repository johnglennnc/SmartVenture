import React from 'react';
import { Lightbulb, CheckCircle, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OptimizationView({ optimizations, companies }) {
    const getStatusColor = (status) => ({
        identified: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        implementing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        completed: 'bg-green-500/20 text-green-300 border-green-500/30',
        failed: 'bg-red-500/20 text-red-300 border-red-500/30'
    }[status] || 'bg-gray-500/20');
    
    const getCategoryColor = (category) => ({
        supply_chain: 'bg-orange-500/20 text-orange-300',
        hr: 'bg-cyan-500/20 text-cyan-300',
        it: 'bg-green-500/20 text-green-300',
        customer_support: 'bg-blue-500/20 text-blue-300',
        strategy: 'bg-red-500/20 text-red-300',
        cost_reduction: 'bg-purple-500/20 text-purple-300'
    }[category] || 'bg-gray-500/20');


  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">AI-Identified Operational Optimizations</h2>
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
                    <Badge className={`${getCategoryColor(opp.category)} capitalize border-0`}>{opp.category.replace('_', ' ')}</Badge>
                    <Badge variant="outline" className="text-white border-white/20">{company?.name}</Badge>
                    <Badge className={getStatusColor(opp.status)}>{opp.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-300 font-bold">{opp.potential_impact}</p>
                  <p className="text-xs text-blue-200/60">Potential Impact</p>
                </div>
              </div>
              <p className="text-blue-200/70 text-sm mb-4">{opp.description}</p>
              {opp.status === 'identified' && (
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Implement
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}