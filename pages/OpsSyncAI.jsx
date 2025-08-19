import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { SupplyChainItem } from "@/api/entities";
import { HRRecord } from "@/api/entities";
import { ITAsset } from "@/api/entities";
import { SupportTicket } from "@/api/entities";
import { StrategicPlan } from "@/api/entities";
import { OperationalOptimization } from "@/api/entities";

import { ClipboardList, Package, Users, Server, MessageSquare, Target, Lightbulb, PieChart, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SupplyChainView from "@/components/opssync/SupplyChainView";
import HRView from "@/components/opssync/HRView";
import ITInfrastructureView from "@/components/opssync/ITInfrastructureView";
import CustomerSupportView from "@/components/opssync/CustomerSupportView";
import StrategicPlanningView from "@/components/opssync/StrategicPlanningView";
import OptimizationView from "@/components/opssync/OptimizationView";

const MetricCard = ({ title, value, icon: Icon, change, changeColor }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-purple-500/20">
        <Icon className="w-5 h-5 text-purple-300" />
      </div>
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className={`text-sm ${changeColor || 'text-green-300'} mt-1`}>{change}</p>}
  </div>
);

export default function OpsSyncAI() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    companies: [],
    supplyChainItems: [],
    hrRecords: [],
    itAssets: [],
    supportTickets: [],
    strategicPlans: [],
    optimizations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          companies,
          supplyChainItems,
          hrRecords,
          itAssets,
          supportTickets,
          strategicPlans,
          optimizations
        ] = await Promise.all([
          Company.list(),
          SupplyChainItem.list(),
          HRRecord.list(),
          ITAsset.list(),
          SupportTicket.list(),
          StrategicPlan.list(),
          OperationalOptimization.list()
        ]);
        setData({ companies, supplyChainItems, hrRecords, itAssets, supportTickets, strategicPlans, optimizations });
      } catch (error) {
        console.error("Failed to load OpsSync data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Macro metrics calculations
  const avgUptime = data.itAssets.length > 0
    ? (data.itAssets.reduce((sum, asset) => sum + (asset.uptime_percentage || 0), 0) / data.itAssets.length).toFixed(2)
    : 100;
  
  const avgCsat = data.supportTickets.length > 0
    ? (data.supportTickets.reduce((sum, ticket) => sum + (ticket.customer_satisfaction_score || 0), 0) / data.supportTickets.filter(t => t.customer_satisfaction_score).length).toFixed(1)
    : 5;
    
  const totalEmployees = data.hrRecords.filter(r => r.status === 'active').length;
  const completedOptimizations = data.optimizations.filter(o => o.status === 'completed').length;

  if (loading) {
    return <div className="p-8 text-white">Loading operational data...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <ClipboardList className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              OpsSync AI
            </h1>
            <p className="text-blue-200/60 mt-1">Autonomous Operations for the Entire Company Lifecycle</p>
          </div>
        </div>

        {/* Macro Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Avg. IT Uptime"
            value={`${avgUptime}%`}
            icon={Server}
            change={`${data.itAssets.filter(a => a.status !== 'online').length} assets with issues`}
            changeColor={data.itAssets.filter(a => a.status !== 'online').length > 0 ? 'text-yellow-300' : 'text-green-300'}
          />
          <MetricCard
            title="Avg. Customer Satisfaction"
            value={`${avgCsat} / 5.0`}
            icon={MessageSquare}
            change={`${data.supportTickets.filter(t => t.status === 'open').length} open tickets`}
          />
          <MetricCard
            title="Total Workforce"
            value={totalEmployees}
            icon={Users}
            change={`${data.hrRecords.filter(r => r.is_ai_agent).length} AI Agents`}
          />
          <MetricCard
            title="Optimizations Implemented"
            value={completedOptimizations}
            icon={CheckCircle}
            change={`${data.optimizations.filter(o => o.status === 'identified').length} new opportunities`}
          />
        </div>

        <Tabs defaultValue="supply_chain" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/5">
            <TabsTrigger value="supply_chain">Supply Chain</TabsTrigger>
            <TabsTrigger value="hr">Human Resources</TabsTrigger>
            <TabsTrigger value="it">IT Infrastructure</TabsTrigger>
            <TabsTrigger value="support">Customer Support</TabsTrigger>
            <TabsTrigger value="strategy">Strategic Planning</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          </TabsList>
          <TabsContent value="supply_chain">
            <SupplyChainView items={data.supplyChainItems} companies={data.companies} />
          </TabsContent>
          <TabsContent value="hr">
            <HRView records={data.hrRecords} companies={data.companies} />
          </TabsContent>
          <TabsContent value="it">
            <ITInfrastructureView assets={data.itAssets} companies={data.companies} />
          </TabsContent>
           <TabsContent value="support">
            <CustomerSupportView tickets={data.supportTickets} companies={data.companies} />
          </TabsContent>
           <TabsContent value="strategy">
            <StrategicPlanningView plans={data.strategicPlans} companies={data.companies} />
          </TabsContent>
          <TabsContent value="optimizations">
            <OptimizationView optimizations={data.optimizations} companies={data.companies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}