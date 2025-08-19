import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { TechPlatform } from "@/api/entities";
import { PlatformMetrics } from "@/api/entities";
import { DevelopmentMetric } from "@/api/entities";
import { TechOptimization } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Monitor, 
  BarChart3, 
  Zap, 
  Globe,
  Activity,
  Users,
  Clock,
  RefreshCw,
  ExternalLink,
  Lightbulb,
  Shield,
  TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PlatformPreviewsView from "../components/techsync/PlatformPreviewsView";
import PerformanceMetricsView from "../components/techsync/PerformanceMetricsView";
import DevelopmentMetricsView from "../components/techsync/DevelopmentMetricsView";
import TechOptimizationView from "../components/techsync/TechOptimizationView";

const MetricCard = ({ title, value, icon: Icon, change, gradient = "from-blue-500 to-cyan-400" }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-20`}>
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className="text-sm text-green-300 mt-1">{change}</p>}
  </div>
);

export default function TechSyncAI() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [platformMetrics, setPlatformMetrics] = useState([]);
  const [developmentMetrics, setDevelopmentMetrics] = useState([]);
  const [optimizations, setOptimizations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          companyData, 
          platformData, 
          metricsData, 
          devMetricsData, 
          optimizationData
        ] = await Promise.all([
          Company.list(),
          TechPlatform.list(),
          PlatformMetrics.list(),
          DevelopmentMetric.list(),
          TechOptimization.list()
        ]);
        
        setCompanies(companyData);
        setPlatforms(platformData);
        setPlatformMetrics(metricsData);
        setDevelopmentMetrics(devMetricsData);
        setOptimizations(optimizationData);
      } catch (error) {
        console.error("Error fetching TechSync data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPlatforms = platforms.length;
  const livePlatforms = platforms.filter(p => p.status === 'live').length;
  const avgUptime = platformMetrics.reduce((acc, m) => acc + (m.uptime_percentage || 0), 0) / platformMetrics.length || 0;
  const totalUsers = platformMetrics.reduce((acc, m) => acc + (m.monthly_active_users || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading TechSync AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">TechSync AI</h1>
            <p className="text-blue-200">Autonomous Technology Management & Development</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Platforms
          </Button>
        </div>

        {/* Macro Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Platforms"
            value={totalPlatforms.toLocaleString()}
            icon={Code}
            change="+12% this month"
            gradient="from-purple-500 to-pink-400"
          />
          <MetricCard
            title="Live Platforms"
            value={livePlatforms.toLocaleString()}
            icon={Globe}
            change="+8% this month"
            gradient="from-green-500 to-teal-400"
          />
          <MetricCard
            title="Average Uptime"
            value={`${avgUptime.toFixed(1)}%`}
            icon={Activity}
            change="+0.3% this month"
            gradient="from-blue-500 to-cyan-400"
          />
          <MetricCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={Users}
            change="+25% this month"
            gradient="from-orange-500 to-red-400"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList className="bg-black/20 backdrop-blur-lg border border-white/10">
            <TabsTrigger value="platforms" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Monitor className="w-4 h-4 mr-2" />
              Platform Previews
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Code className="w-4 h-4 mr-2" />
              Development
            </TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Zap className="w-4 h-4 mr-2" />
              AI Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <PlatformPreviewsView platforms={platforms} companies={companies} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetricsView platformMetrics={platformMetrics} platforms={platforms} companies={companies} />
          </TabsContent>

          <TabsContent value="development">
            <DevelopmentMetricsView developmentMetrics={developmentMetrics} platforms={platforms} companies={companies} />
          </TabsContent>

          <TabsContent value="optimization">
            <TechOptimizationView optimizations={optimizations} platforms={platforms} companies={companies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}