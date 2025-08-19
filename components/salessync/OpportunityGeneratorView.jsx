import React from 'react';
import { Target, TrendingUp, Lightbulb } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OpportunityGeneratorView({ accounts, campaigns, companies }) {
  const opportunities = [
    {
      title: "Target 'Early-Stage SaaS' Segment for ContentCraft Pro",
      description: "Analysis of campaign data shows high engagement from SaaS startups. A tailored campaign could yield a 15% higher conversion rate.",
      potential_impact: "+$25K MRR",
      type: "New Segment",
      company_id: companies[1]?.id,
    },
    {
      title: "Introduce 'Compliance Module' Upsell for FinanceBot AI",
      description: "CRM interactions indicate a strong need for automated compliance checks among existing customers.",
      potential_impact: "+10% MRR from existing base",
      type: "Upsell",
      company_id: companies[0]?.id,
    },
    {
      title: "Optimize Ad Spend for 'Telemedicine' Niche in HealthInsights",
      description: "Competitive analysis reveals a gap in performance marketing for specialized telemedicine providers.",
      potential_impact: "+$12K MRR",
      type: "Channel Optimization",
      company_id: companies[2]?.id,
    },
  ];

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">AI-Generated Opportunities</h2>
      </div>
      
      <div className="space-y-4">
        {opportunities.map((opp, index) => {
          const company = companies.find(c => c.id === opp.company_id);
          return (
            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{opp.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">{opp.type}</Badge>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">{company?.name || 'All Companies'}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-300 font-bold">{opp.potential_impact}</p>
                  <p className="text-xs text-blue-200/60">Potential Impact</p>
                </div>
              </div>
              <p className="text-blue-200/70 text-sm mb-4">{opp.description}</p>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400">
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore & Execute
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}