import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Check, TrendingUp } from 'lucide-react';

export default function StrategicPlanningView({ plans, companies }) {
  const getStatusColor = (status) => ({
    draft: 'bg-gray-500/20',
    active: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    archived: 'bg-gray-600/20'
  }[status] || 'bg-gray-500/20');

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-red-400" />
        <h2 className="text-xl font-semibold text-white">Strategic Planning</h2>
      </div>
      <div className="space-y-4">
        {plans.map(plan => {
          const company = companies.find(c => c.id === plan.company_id);
          return (
            <div key={plan.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{plan.plan_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                    <Badge variant="outline" className="text-white border-white/20">{company?.name}</Badge>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-purple-300 font-bold">{plan.ai_confidence_score}%</p>
                    <p className="text-xs text-blue-200/60">AI Confidence</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Key Objectives:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-200/80">
                  {plan.key_objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-white mb-2">KPIs:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {plan.kpis.map((kpi, i) => (
                        <div key={i} className="p-2 bg-white/5 rounded">
                            <p className="text-sm text-blue-200/70">{kpi.name}</p>
                            <p className="font-semibold text-white">{kpi.current} / <span className="text-green-400">{kpi.target}</span></p>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}