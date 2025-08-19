import React from 'react';
import { Lightbulb, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OptimizationView({ registrations, licenses, companies }) {
  // AI-generated optimization opportunities
  const optimizations = [
    {
      id: 1,
      title: "Delaware C-Corp Migration",
      description: "AI analysis suggests migrating 3 LLCs to Delaware C-Corp structure for better VC fundraising potential and tax advantages.",
      category: "entity_optimization",
      affected_companies: 3,
      potential_benefit: "25% faster fundraising, $50K tax savings annually",
      priority: "high",
      status: "identified",
      auto_implementable: true
    },
    {
      id: 2,
      title: "Multi-State License Consolidation",
      description: "Identified redundant licensing requirements across jurisdictions. Consolidation can reduce compliance overhead by 40%.",
      category: "license_optimization",
      affected_companies: 5,
      potential_benefit: "$15K annual savings, 60% less paperwork",
      priority: "medium",
      status: "identified",
      auto_implementable: true
    },
    {
      id: 3,
      title: "Automated Compliance Calendar",
      description: "Deploy AI-driven compliance calendar to prevent missed filings and automate 85% of routine compliance tasks.",
      category: "compliance_automation",
      affected_companies: companies.length,
      potential_benefit: "Zero missed deadlines, 90% time reduction",
      priority: "high",
      status: "implementing",
      auto_implementable: true
    },
    {
      id: 4,
      title: "SAFE Template Optimization",
      description: "Update SAFE agreement templates based on recent market trends and successful funding rounds data.",
      category: "investment_optimization",
      affected_companies: 8,
      potential_benefit: "15% higher valuation caps, faster closings",
      priority: "medium",
      status: "identified",
      auto_implementable: true
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500/20 text-red-300 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCategoryColor = (category) => {
    const colors = {
      entity_optimization: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      license_optimization: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      compliance_automation: 'bg-green-500/20 text-green-300 border-green-500/30',
      investment_optimization: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getStatusColor = (status) => {
    const colors = {
      identified: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      implementing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">AI-Identified Legal & Compliance Optimizations</h2>
      </div>
      
      <div className="space-y-4">
        {optimizations.map((opp) => (
          <div key={opp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{opp.title}</h3>
                  <Badge className={getPriorityColor(opp.priority)}>
                    {opp.priority} priority
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(opp.category)}>
                    {opp.category.replace(/_/g, ' ')}
                  </Badge>
                  <Badge className={getStatusColor(opp.status)}>
                    {opp.status}
                  </Badge>
                  {opp.auto_implementable && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Implementable
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{opp.affected_companies} Companies</p>
                <p className="text-xs text-blue-200/60">Affected</p>
              </div>
            </div>
            
            <p className="text-blue-200/70 text-sm mb-4">{opp.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-green-300 font-semibold">{opp.potential_benefit}</p>
                  <p className="text-xs text-blue-200/60">Potential Benefit</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {opp.status === 'identified' && (
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Implement
                  </Button>
                )}
                {opp.status === 'implementing' && (
                  <Button size="sm" variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300" disabled>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    In Progress
                  </Button>
                )}
                {opp.status === 'completed' && (
                  <Button size="sm" variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}