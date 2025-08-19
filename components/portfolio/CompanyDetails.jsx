import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink,
  Users,
  DollarSign,
  TrendingUp,
  Bot,
  Settings,
  Activity,
  Code,
  BarChart3
} from "lucide-react";

export default function CompanyDetails({ company, agents, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const getAgentStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      idle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      training: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      error: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getRoleIcon = (role) => {
    const icons = {
      ceo: Users,
      cto: Code,
      marketing: TrendingUp,
      sales: DollarSign,
      operations: Settings,
      product: Bot,
      finance: BarChart3
    };
    return icons[role] || Bot;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <span className="text-2xl font-bold">{company.name}</span>
            {company.mvp_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(company.mvp_url, '_blank')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-white/20">
              AI Agents ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Company Status & Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Company Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Status</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {company.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Niche</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {company.niche?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Business Model</span>
                    <span className="text-white">{company.business_model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Launch Date</span>
                    <span className="text-white">
                      {company.launch_date ? new Date(company.launch_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Financial Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Current Valuation</span>
                    <span className="text-white font-semibold">
                      ${((company.current_valuation || 0) / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Monthly Revenue</span>
                    <span className="text-white font-semibold">
                      ${(company.monthly_revenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Total Revenue</span>
                    <span className="text-white font-semibold">
                      ${(company.total_revenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Our Equity</span>
                    <span className="text-white font-semibold">{company.equity_stake || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">Growth Rate</span>
                    <span className={`font-semibold ${
                      (company.growth_rate || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {(company.growth_rate || 0) >= 0 ? '+' : ''}{(company.growth_rate || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            {company.tech_stack && company.tech_stack.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {company.tech_stack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-white/10 border-white/20 text-white">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid gap-4">
              {agents.map((agent) => {
                const RoleIcon = getRoleIcon(agent.role);
                return (
                  <div key={agent.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <RoleIcon className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{agent.name}</h4>
                          <p className="text-sm text-blue-200/70 capitalize">{agent.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge className={getAgentStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-200/70">Performance</span>
                        <p className="text-white font-medium">{agent.performance_score || 0}%</p>
                      </div>
                      <div>
                        <span className="text-blue-200/70">Tasks Completed</span>
                        <p className="text-white font-medium">{agent.tasks_completed || 0}</p>
                      </div>
                      <div>
                        <span className="text-blue-200/70">Revenue Generated</span>
                        <p className="text-white font-medium">${(agent.revenue_generated || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {agent.capabilities && agent.capabilities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-blue-200/70 text-sm mb-2">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((capability, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-white/5 border-white/20 text-white">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {agents.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-blue-300/50 mx-auto mb-3" />
                <p className="text-blue-200/70">No AI agents assigned to this company yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-blue-200/60">Advanced analytics and insights coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}