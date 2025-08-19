import React, { useState, useEffect } from "react";
import { Opportunity } from "@/api/entities";
import { Company } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Rocket, 
  TrendingUp, 
  DollarSign,
  Target,
  Zap,
  RefreshCw,
  Eye,
  ArrowRight
} from "lucide-react";

import OpportunityCard from "../components/opportunities/OpportunityCard";
import OpportunityFilters from "../components/opportunities/OpportunityFilters";
import LaunchModal from "../components/opportunities/LaunchModal";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [filters, setFilters] = useState({
    niche: "all",
    competition: "all",
    minRevenue: 0
  });

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchQuery, filters]);

  const loadOpportunities = async () => {
    try {
      const data = await Opportunity.list('-confidence_score');
      setOpportunities(data);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.niche.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Niche filter
    if (filters.niche !== "all") {
      filtered = filtered.filter(opp => opp.niche === filters.niche);
    }

    // Competition filter
    if (filters.competition !== "all") {
      filtered = filtered.filter(opp => opp.competition_level === filters.competition);
    }

    // Revenue filter
    if (filters.minRevenue > 0) {
      filtered = filtered.filter(opp => (opp.projected_revenue || 0) >= filters.minRevenue);
    }

    setFilteredOpportunities(filtered);
  };

  const handleScanMarket = async () => {
    setScanning(true);
    try {
      const result = await InvokeLLM({
        prompt: `Generate 3 new startup opportunities in emerging tech markets. Focus on AI-feasible solutions with high monetization potential. Include detailed market analysis, competition assessment, and revenue projections.`,
        response_json_schema: {
          type: "object",
          properties: {
            opportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  niche: { type: "string" },
                  market_size: { type: "number" },
                  competition_level: { type: "string" },
                  projected_revenue: { type: "number" },
                  confidence_score: { type: "number" },
                  monetization_potential: { type: "number" },
                  ai_feasibility: { type: "number" },
                  tech_requirements: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      // Create opportunities
      for (const opp of result.opportunities) {
        await Opportunity.create({
          ...opp,
          niche: ['fintech', 'healthtech', 'edtech', 'ai_tools', 'saas'][Math.floor(Math.random() * 5)],
          competition_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: 'identified'
        });
      }

      await loadOpportunities();
    } catch (error) {
      console.error('Error scanning market:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleLaunchOpportunity = async (opportunity) => {
    try {
      // Create company from opportunity
      const company = await Company.create({
        name: opportunity.title,
        opportunity_id: opportunity.id,
        niche: opportunity.niche,
        status: 'building',
        current_valuation: Math.floor(Math.random() * 1000000) + 500000,
        monthly_revenue: 0,
        total_revenue: 0,
        equity_stake: 40,
        ai_agents_count: 3,
        business_model: ['subscription', 'saas', 'marketplace'][Math.floor(Math.random() * 3)],
        launch_date: new Date().toISOString().split('T')[0],
        tech_stack: opportunity.tech_requirements || ['React', 'Node.js', 'AI/ML']
      });

      // Update opportunity status
      await Opportunity.update(opportunity.id, { status: 'launched' });
      
      setShowLaunchModal(false);
      setSelectedOpportunity(null);
      await loadOpportunities();
    } catch (error) {
      console.error('Error launching opportunity:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Market Opportunities
            </h1>
            <p className="text-blue-200/60 mt-1">AI-powered market intelligence and gap analysis</p>
          </div>
          
          <Button
            onClick={handleScanMarket}
            disabled={scanning}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {scanning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {scanning ? 'Scanning...' : 'Scan Market'}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 w-5 h-5" />
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50"
            />
          </div>
          <OpportunityFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">{filteredOpportunities.length}</span>
            </div>
            <p className="text-blue-200/60 text-sm mt-1">Total Opportunities</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">
                ${(filteredOpportunities.reduce((sum, opp) => sum + (opp.projected_revenue || 0), 0) / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-blue-200/60 text-sm mt-1">Total Potential</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">
                {filteredOpportunities.filter(opp => opp.status === 'ready_to_launch').length}
              </span>
            </div>
            <p className="text-blue-200/60 text-sm mt-1">Ready to Launch</p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold">
                {Math.round(filteredOpportunities.reduce((sum, opp) => sum + (opp.confidence_score || 0), 0) / (filteredOpportunities.length || 1))}%
              </span>
            </div>
            <p className="text-blue-200/60 text-sm mt-1">Avg Confidence</p>
          </div>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onView={() => setSelectedOpportunity(opportunity)}
                onLaunch={() => {
                  setSelectedOpportunity(opportunity);
                  setShowLaunchModal(true);
                }}
              />
            ))}
          </div>
        )}

        {filteredOpportunities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Opportunities Found</h3>
            <p className="text-blue-200/60 mb-4">Try adjusting your filters or scan for new market gaps</p>
            <Button onClick={handleScanMarket} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Search className="w-4 h-4 mr-2" />
              Scan Market
            </Button>
          </div>
        )}

        {/* Launch Modal */}
        {showLaunchModal && selectedOpportunity && (
          <LaunchModal
            opportunity={selectedOpportunity}
            onLaunch={handleLaunchOpportunity}
            onClose={() => {
              setShowLaunchModal(false);
              setSelectedOpportunity(null);
            }}
          />
        )}
      </div>
    </div>
  );
}