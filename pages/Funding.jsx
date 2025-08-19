
import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { FundingRound } from "@/api/entities";
import { BankAccount } from "@/api/entities";
import { AIVCFirm } from "@/api/entities";
import { SAFEAgreement } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  Building2,
  Bot,
  Zap,
  RefreshCw,
  Plus,
  ArrowRight,
  Wallet,
  Presentation // New icon for VenturePitch
} from "lucide-react";

import FundingOverview from "../components/funding/FundingOverview";
import BankingDashboard from "../components/funding/BankingDashboard";
import AIVCConnections from "../components/funding/AIVCConnections";
import FundingRounds from "../components/funding/FundingRounds";
import CapitalDeployment from "../components/funding/CapitalDeployment";
import VenturePitchAI from "../components/funding/VenturePitchAI"; // New component

export default function Funding() {
  const [fundingRounds, setFundingRounds] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [aiVCFirms, setAIVCFirms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [syncingBanks, setSyncingBanks] = useState(false);

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    try {
      const [roundsData, accountsData, vcData, companiesData] = await Promise.all([
        FundingRound.list('-created_date'),
        BankAccount.list(),
        AIVCFirm.list(),
        Company.list()
      ]);
      
      setFundingRounds(roundsData);
      setBankAccounts(accountsData);
      setAIVCFirms(vcData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading funding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncBanks = async () => {
    setSyncingBanks(true);
    try {
      // Simulate bank synchronization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update account balances (simulated)
      for (const account of bankAccounts) {
        const randomChange = (Math.random() - 0.5) * 10000;
        await BankAccount.update(account.id, {
          current_balance: Math.max(0, (account.current_balance || 0) + randomChange),
          last_sync: new Date().toISOString()
        });
      }
      
      await loadFundingData();
    } catch (error) {
      console.error('Error syncing banks:', error);
    } finally {
      setSyncingBanks(false);
    }
  };

  const handleAutoFunding = async () => {
    try {
      // Find companies that need funding
      const eligibleCompanies = companies.filter(company => 
        (company.status === 'launched' || company.status === 'scaling') &&
        !fundingRounds.some(round => round.company_id === company.id && round.status === 'active')
      );

      if (eligibleCompanies.length === 0) {
          alert("No companies eligible for automated funding at this time.");
          return;
      }

      const company = eligibleCompanies[0];
      const allAIVCs = await AIVCFirm.list();
      const smartVentureVC = allAIVCs.find(vc => vc.name === 'SmartVenture VC');
      const forumVC = allAIVCs.find(vc => vc.name === 'ForumVC AI VC');

      let fundingPartner = null;
      let roundDetails = null;
      
      // Prioritize SmartVenture VC
      if (smartVentureVC) {
          const analysisPrompt = `Analyze funding opportunity for ${company.name} (${company.niche}) based on SmartVenture VC's criteria. Current valuation: $${company.current_valuation}, Monthly revenue: $${company.monthly_revenue}. Recommend funding amount and valuation.`;
          const analysis = await InvokeLLM({ prompt: analysisPrompt, response_json_schema: { type: "object", properties: { funding_amount: { type: "number" }, pre_money_valuation: { type: "number" } } } });
          if (analysis.funding_amount > 0) {
              fundingPartner = smartVentureVC;
              roundDetails = analysis;
          }
      }

      // If SmartVenture VC passes, try ForumVC AI VC
      if (!fundingPartner && forumVC) {
          const analysisPrompt = `Analyze funding opportunity for ${company.name} (${company.niche}) based on ForumVC AI VC's criteria. Current valuation: $${company.current_valuation}, Monthly revenue: $${company.monthly_revenue}. Recommend funding amount and valuation.`;
          const analysis = await InvokeLLM({ prompt: analysisPrompt, response_json_schema: { type: "object", properties: { funding_amount: { type: "number" }, pre_money_valuation: { type: "number" } } } });
          if (analysis.funding_amount > 0) {
              fundingPartner = forumVC;
              roundDetails = analysis;
          }
      }
      
      if (fundingPartner && roundDetails) {
        // Create FundingRound
        const newRound = await FundingRound.create({
          company_id: company.id,
          round_type: 'seed',
          amount_requested: roundDetails.funding_amount,
          amount_raised: 0,
          valuation_pre: roundDetails.pre_money_valuation || company.current_valuation,
          valuation_post: (roundDetails.pre_money_valuation || company.current_valuation) + roundDetails.funding_amount,
          status: 'active',
          lead_investor: fundingPartner.name,
          ai_vc_criteria_met: true,
          funding_purpose: ['Product Development', 'Market Expansion']
        });

        // Create SAFE Agreement
        await SAFEAgreement.create({
            company_id: company.id,
            investor_name: fundingPartner.name,
            investment_amount: roundDetails.funding_amount,
            valuation_cap: (roundDetails.pre_money_valuation || company.current_valuation) * 1.5,
            discount_rate: 20,
            safe_type: 'post_money',
            status: 'pending_signature',
            ai_generated: true,
            investor_type: 'ai_vc'
        });

        alert(`Funding round initiated for ${company.name} with ${fundingPartner.name}!`);
        await loadFundingData();
      } else {
        alert(`Could not find a suitable AI VC partner for ${company.name} at this time.`);
      }

    } catch (error) {
      console.error('Error creating auto funding:', error);
      alert('An error occurred during the auto-funding process.');
    }
  };

  const totalCapitalRaised = fundingRounds.reduce((sum, round) => sum + (round.amount_raised || 0), 0);
  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + (account.current_balance || 0), 0);
  const activeRounds = fundingRounds.filter(round => round.status === 'active').length;
  const connectedBanks = bankAccounts.filter(account => account.integration_status === 'connected').length;

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "banking", label: "Banking", icon: CreditCard },
    { id: "ai-vc", label: "AI VC Network", icon: Bot },
    { id: "rounds", label: "Funding Rounds", icon: DollarSign },
    { id: "deployment", label: "Capital Deployment", icon: Zap },
    { id: "venturepitch", label: "VenturePitch AI", icon: Presentation } // New tab
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Funding Management
            </h1>
            <p className="text-blue-200/60 mt-1">AI-powered capital raising and deployment platform</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSyncBanks}
              disabled={syncingBanks}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {syncingBanks ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Sync Banks
            </Button>
            <Button
              onClick={handleAutoFunding}
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto Fund
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">
                ${(totalCapitalRaised / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-blue-200/60 text-sm">Capital Raised</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">
                ${(totalBankBalance / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-blue-200/60 text-sm">Bank Balance</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">{activeRounds}</span>
            </div>
            <p className="text-blue-200/60 text-sm">Active Rounds</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">{aiVCFirms.length}</span>
            </div>
            <p className="text-blue-200/60 text-sm">AI VC Partners</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto">
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <FundingOverview
              fundingRounds={fundingRounds}
              bankAccounts={bankAccounts}
              companies={companies}
              aiVCFirms={aiVCFirms}
            />
          )}
          
          {activeTab === "banking" && (
            <BankingDashboard
              bankAccounts={bankAccounts}
              companies={companies}
              onSync={handleSyncBanks}
              syncingBanks={syncingBanks}
            />
          )}
          
          {activeTab === "ai-vc" && (
            <AIVCConnections
              aiVCFirms={aiVCFirms}
              fundingRounds={fundingRounds}
              companies={companies}
            />
          )}
          
          {activeTab === "rounds" && (
            <FundingRounds
              fundingRounds={fundingRounds}
              companies={companies}
              aiVCFirms={aiVCFirms}
            />
          )}
          
          {activeTab === "deployment" && (
            <CapitalDeployment
              bankAccounts={bankAccounts}
              companies={companies}
              fundingRounds={fundingRounds}
            />
          )}
          
          {activeTab === "venturepitch" && (
            <VenturePitchAI />
          )}
        </div>
      </div>
    </div>
  );
}
