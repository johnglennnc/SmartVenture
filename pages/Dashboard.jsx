import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { Opportunity } from "@/api/entities";
import { AIAgent } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  TrendingUp, 
  Bot, 
  Target, 
  DollarSign, 
  BarChart3,
  Zap,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from "lucide-react";

import MetricCard from "../components/dashboard/MetricCard";
import QuickActions from "../components/dashboard/QuickActions";
import LiveFeed from "../components/dashboard/LiveFeed";
import PortfolioChart from "../components/dashboard/PortfolioChart";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    opportunities: 0,
    companies: 0,
    portfolioValue: 0,
    cashGenerated: 0,
    activeAgents: 0,
    projectedValue: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [opportunities, companies, agents] = await Promise.all([
        Opportunity.list(),
        Company.list(),
        AIAgent.list()
      ]);

      const portfolioValue = companies.reduce((sum, company) => sum + (company.current_valuation || 0), 0);
      const cashGenerated = companies.reduce((sum, company) => sum + (company.total_revenue || 0), 0);
      const activeAgents = agents.filter(agent => agent.status === 'active').length;

      setMetrics({
        opportunities: opportunities.length,
        companies: companies.length,
        portfolioValue,
        cashGenerated,
        activeAgents,
        projectedValue: portfolioValue * 1.8 // Simulated 12-month projection
      });

      // Generate recent activity
      const activity = [
        { type: 'launch', text: 'HealthSync AI launched successfully', time: '2m ago', icon: Rocket },
        { type: 'revenue', text: '$15,000 revenue milestone reached', time: '5m ago', icon: DollarSign },
        { type: 'opportunity', text: 'New fintech gap identified', time: '12m ago', icon: Target },
        { type: 'agent', text: '3 new AI agents deployed', time: '18m ago', icon: Bot }
      ];
      setRecentActivity(activity);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleAutoLaunch = async () => {
    try {
      setIsRefreshing(true);
      
      // Simulate AI analysis and company creation
      const result = await InvokeLLM({
        prompt: "Generate a realistic startup opportunity in the AI tools space with market analysis",
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            niche: { type: "string" },
            market_size: { type: "number" },
            projected_revenue: { type: "number" },
            confidence_score: { type: "number" }
          }
        }
      });

      // Create opportunity and company
      const opportunity = await Opportunity.create({
        ...result,
        niche: 'ai_tools',
        competition_level: 'medium',
        monetization_potential: 85,
        ai_feasibility: 92,
        status: 'launched'
      });

      await Company.create({
        name: result.title,
        opportunity_id: opportunity.id,
        niche: 'ai_tools',
        status: 'launched',
        current_valuation: Math.floor(Math.random() * 500000) + 100000,
        monthly_revenue: Math.floor(Math.random() * 10000) + 1000,
        equity_stake: 35,
        ai_agents_count: 5,
        business_model: 'saas',
        launch_date: new Date().toISOString().split('T')[0]
      });

      await loadDashboardData();
    } catch (error) {
      console.error('Error launching company:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Mission Control
            </h1>
            <p className="text-blue-200/60 mt-1">AI-powered startup empire at your fingertips</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleAutoLaunch}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto Launch
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <MetricCard
            title="Opportunities Identified"
            value={metrics.opportunities.toLocaleString()}
            icon={Target}
            trend="+12%"
            trendDirection="up"
            gradient="from-purple-500 to-pink-500"
          />
          
          <MetricCard
            title="Startups Launched"
            value={metrics.companies.toLocaleString()}
            icon={Rocket}
            trend="+8%"
            trendDirection="up"
            gradient="from-blue-500 to-cyan-400"
          />
          
          <MetricCard
            title="Portfolio Value"
            value={`$${(metrics.portfolioValue / 1000000).toFixed(1)}M`}
            icon={BarChart3}
            trend="+24%"
            trendDirection="up"
            gradient="from-green-500 to-emerald-400"
          />
          
          <MetricCard
            title="Cash Generated"
            value={`$${(metrics.cashGenerated / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            trend="+18%"
            trendDirection="up"
            gradient="from-yellow-500 to-orange-400"
          />
          
          <MetricCard
            title="AI Agents Active"
            value={metrics.activeAgents.toLocaleString()}
            icon={Bot}
            trend="+6%"
            trendDirection="up"
            gradient="from-indigo-500 to-purple-500"
          />
          
          <MetricCard
            title="12M Projection"
            value={`$${(metrics.projectedValue / 1000000).toFixed(1)}M`}
            icon={TrendingUp}
            trend="+85%"
            trendDirection="up"
            gradient="from-pink-500 to-rose-400"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PortfolioChart />
          
          <div className="space-y-6">
            <QuickActions onAutoLaunch={handleAutoLaunch} />
            <LiveFeed activities={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}