import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { SalesCampaign } from "@/api/entities";
import { Account } from "@/api/entities";
import { CRMInteraction } from "@/api/entities";

import { Handshake, Zap, BarChart, Users, LineChart, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SalesCampaignsView from "@/components/salessync/SalesCampaignsView";
import AccountManagementView from "@/components/salessync/AccountManagementView";
import CRMView from "@/components/salessync/CRMView";
import OpportunityGeneratorView from "@/components/salessync/OpportunityGeneratorView";

const MetricCard = ({ title, value, icon: Icon, change }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-blue-500/20">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className="text-sm text-green-300 mt-1">{change}</p>}
  </div>
);

export default function SalesSyncAI() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [companyData, campaignData, accountData, interactionData] = await Promise.all([
          Company.list(),
          SalesCampaign.list(),
          Account.list(),
          CRMInteraction.list(),
        ]);
        setCompanies(companyData);
        setCampaigns(campaignData);
        setAccounts(accountData);
        setInteractions(interactionData);
      } catch (error) {
        console.error("Failed to load SalesSync data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Macro metrics calculations
  const totalRevenue = campaigns.reduce((sum, camp) => sum + (camp.revenue_generated || 0), 0);
  const totalMRR = accounts.reduce((sum, acc) => sum + (acc.mrr || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalAccounts = accounts.length;
  const avgHealthScore = accounts.length > 0
    ? Math.round(accounts.reduce((sum, acc) => sum + (acc.health_score || 0), 0) / accounts.length)
    : 0;

  if (loading) {
    return (
      <div className="p-8 text-white">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-700 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-24 bg-gray-800 rounded-xl"></div>
            <div className="h-24 bg-gray-800 rounded-xl"></div>
            <div className="h-24 bg-gray-800 rounded-xl"></div>
            <div className="h-24 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Handshake className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              SalesSync AI
            </h1>
            <p className="text-blue-200/60 mt-1">Autonomous Sales, Account Management, and CRM</p>
          </div>
        </div>

        {/* Macro Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue Generated"
            value={`$${(totalRevenue / 1000000).toFixed(2)}M`}
            icon={BarChart}
            change="+12.5% this month"
          />
          <MetricCard
            title="Total MRR"
            value={`$${(totalMRR / 1000).toFixed(1)}K`}
            icon={LineChart}
            change="+8.2% this month"
          />
          <MetricCard
            title="Active Campaigns"
            value={activeCampaigns.toString()}
            icon={Zap}
            change={`${campaigns.length} total campaigns`}
          />
          <MetricCard
            title="Avg. Account Health"
            value={`${avgHealthScore}%`}
            icon={Users}
            change={`${totalAccounts} total accounts`}
          />
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="campaigns">Sales Campaigns</TabsTrigger>
            <TabsTrigger value="accounts">Account Management</TabsTrigger>
            <TabsTrigger value="crm">CRM & Retention</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunity Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns">
            <SalesCampaignsView campaigns={campaigns} companies={companies} />
          </TabsContent>
          <TabsContent value="accounts">
            <AccountManagementView accounts={accounts} companies={companies} />
          </TabsContent>
          <TabsContent value="crm">
            <CRMView interactions={interactions} accounts={accounts} companies={companies} />
          </TabsContent>
          <TabsContent value="opportunities">
            <OpportunityGeneratorView accounts={accounts} campaigns={campaigns} companies={companies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}