import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { AIAgent } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  Settings,
  Rocket,
  Bot,
  BarChart3
} from "lucide-react";

import CompanyCard from "../components/portfolio/CompanyCard";
import PortfolioStats from "../components/portfolio/PortfolioStats";
import CompanyDetails from "../components/portfolio/CompanyDetails";

export default function Portfolio() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sortBy, setSortBy] = useState("valuation");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    filterAndSortCompanies();
  }, [companies, searchQuery, sortBy, filterStatus]);

  const loadPortfolioData = async () => {
    try {
      const [companiesData, agentsData] = await Promise.all([
        Company.list('-current_valuation'),
        AIAgent.list('-last_activity')
      ]);
      
      setCompanies(companiesData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCompanies = () => {
    let filtered = companies;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.niche.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(company => company.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'valuation':
          return (b.current_valuation || 0) - (a.current_valuation || 0);
        case 'revenue':
          return (b.total_revenue || 0) - (a.total_revenue || 0);
        case 'growth':
          return (b.growth_rate || 0) - (a.growth_rate || 0);
        case 'agents':
          return (b.ai_agents_count || 0) - (a.ai_agents_count || 0);
        default:
          return 0;
      }
    });

    setFilteredCompanies(filtered);
  };

  const totalPortfolioValue = companies.reduce((sum, company) => sum + (company.current_valuation || 0), 0);
  const totalRevenue = companies.reduce((sum, company) => sum + (company.total_revenue || 0), 0);
  const totalAgents = agents.length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Portfolio Management
            </h1>
            <p className="text-blue-200/60 mt-1">Monitor and manage your AI-powered startup empire</p>
          </div>
        </div>

        {/* Portfolio Stats */}
        <PortfolioStats 
          totalValue={totalPortfolioValue}
          totalRevenue={totalRevenue}
          totalCompanies={companies.length}
          totalAgents={totalAgents}
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300/50 w-5 h-5" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="building">Building</option>
              <option value="testing">Testing</option>
              <option value="launched">Launched</option>
              <option value="scaling">Scaling</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2"
            >
              <option value="valuation">Sort by Valuation</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="growth">Sort by Growth</option>
              <option value="agents">Sort by Agents</option>
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                agents={agents.filter(agent => agent.company_id === company.id)}
                onView={() => setSelectedCompany(company)}
              />
            ))}
          </div>
        )}

        {filteredCompanies.length === 0 && !loading && (
          <div className="text-center py-12">
            <Rocket className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Companies Found</h3>
            <p className="text-blue-200/60 mb-4">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Company Details Modal */}
        {selectedCompany && (
          <CompanyDetails
            company={selectedCompany}
            agents={agents.filter(agent => agent.company_id === selectedCompany.id)}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </div>
    </div>
  );
}