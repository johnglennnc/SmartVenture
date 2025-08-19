import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvokeLLM } from "@/api/integrations";
import { 
  Settings as SettingsIcon,
  Bot,
  Zap,
  Shield,
  Bell,
  User,
  Save,
  RefreshCw,
  Plug,
  Power,
  PowerOff,
  Search,
  Loader2
} from "lucide-react";

const initialIntegrations = [
  // SalesSync AI
  { id: 'hubspot', name: 'HubSpot', category: 'SalesSync AI', description: 'Sync contacts, deals, and sales activities.', status: 'connected' },
  { id: 'salesforce', name: 'Salesforce', category: 'SalesSync AI', description: 'Integrate with the leading CRM platform.', status: 'disconnected' },
  { id: 'apollo', name: 'Apollo.io', category: 'SalesSync AI', description: 'Connect your engagement and intelligence platform.', status: 'disconnected' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'SalesSync AI', description: 'Visual sales pipeline management.', status: 'disconnected' },
  
  // AccuSync AI
  { id: 'quickbooks', name: 'QuickBooks', category: 'AccuSync AI', description: 'Automate bookkeeping and financial reporting.', status: 'connected' },
  { id: 'xero', name: 'Xero', category: 'AccuSync AI', description: 'Sync invoices, bills, and expenses.', status: 'disconnected' },
  { id: 'brex', name: 'Brex', category: 'AccuSync AI', description: 'Connect your all-in-one finance solution.', status: 'connected' },
  { id: 'wave', name: 'Wave Accounting', category: 'AccuSync AI', description: 'Free accounting software integration.', status: 'disconnected' },
  
  // RegSync AI
  { id: 'stripe_atlas', name: 'Stripe Atlas', category: 'RegSync AI', description: 'Automate company formation and compliance.', status: 'connected' },
  { id: 'de_corp', name: 'Delaware Div of Corps', category: 'RegSync AI', description: 'Direct filing for DE entities.', status: 'disconnected' },
  { id: 'legalzoom', name: 'LegalZoom', category: 'RegSync AI', description: 'Business formation and legal services.', status: 'disconnected' },
  
  // OpsSync AI
  { id: 'monday', name: 'Monday.com', category: 'OpsSync AI', description: 'Work operating system for team collaboration.', status: 'connected' },
  { id: 'asana', name: 'Asana', category: 'OpsSync AI', description: 'Team project and task management.', status: 'disconnected' },
  { id: 'trello', name: 'Trello', category: 'OpsSync AI', description: 'Visual project management boards.', status: 'disconnected' },
  { id: 'notion', name: 'Notion', category: 'OpsSync AI', description: 'All-in-one workspace for notes and tasks.', status: 'disconnected' },
  
  // TechSync AI
  { id: 'github', name: 'GitHub', category: 'TechSync AI', description: 'Code repository and version control.', status: 'connected' },
  { id: 'aws', name: 'AWS', category: 'TechSync AI', description: 'Cloud computing and infrastructure services.', status: 'connected' },
  { id: 'docker', name: 'Docker', category: 'TechSync AI', description: 'Container platform for application deployment.', status: 'disconnected' },
  { id: 'vercel', name: 'Vercel', category: 'TechSync AI', description: 'Frontend deployment and hosting platform.', status: 'disconnected' },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    autoLaunch: true,
    maxCompaniesPerDay: 5,
    minConfidenceScore: 75,
    notificationsEnabled: true,
    agentAutonomy: 85,
    riskTolerance: 'medium'
  });
  
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [discoveredIntegrations, setDiscoveredIntegrations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleIntegration = (id) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === id
          ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' }
          : int
      )
    );
  };

  const handleConnectDiscoveredIntegration = (integration) => {
    // Add to main integrations list
    setIntegrations(prev => [...prev, { ...integration, status: 'connected' }]);
    
    // Remove from discovered list
    setDiscoveredIntegrations(prev => 
      prev.filter(int => int.id !== integration.id)
    );
  };

  const handleFindIntegrations = async () => {
    setIsSearching(true);
    try {
      const result = await InvokeLLM({
        prompt: "Generate 6-8 realistic API integrations for a business platform, covering different categories like sales tools, accounting software, operations platforms, and tech services. Include name, category (one of: SalesSync AI, AccuSync AI, RegSync AI, OpsSync AI, TechSync AI), and description.",
        response_json_schema: {
          type: "object",
          properties: {
            integrations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  category: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Filter out integrations that are already in the main list
      const newIntegrations = result.integrations.filter(discovered => 
        !integrations.some(existing => existing.id === discovered.id)
      );

      setDiscoveredIntegrations(newIntegrations);
    } catch (error) {
      console.error('Error finding integrations:', error);
      // Set some fallback discovered integrations
      setDiscoveredIntegrations([
        { id: 'zapier', name: 'Zapier', category: 'OpsSync AI', description: 'Automate workflows between apps.' },
        { id: 'slack', name: 'Slack', category: 'OpsSync AI', description: 'Team communication and collaboration.' },
        { id: 'jira', name: 'Jira', category: 'TechSync AI', description: 'Issue tracking and project management.' }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const getIntegrationsByCategory = (category) => {
    return integrations.filter(int => int.category === category);
  };

  const getDiscoveredIntegrationsByCategory = (category) => {
    return discoveredIntegrations.filter(int => int.category === category);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
    console.log("Saving settings:", settings);
    console.log("Saving integrations:", integrations);
    setSaving(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Platform Settings
            </h1>
            <p className="text-blue-200/60 mt-1">Configure your AI startup launcher</p>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Automation Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Auto-Launch Companies</h3>
                <p className="text-blue-200/60 text-sm">Automatically launch companies when high-confidence opportunities are found</p>
              </div>
              <Switch
                checked={settings.autoLaunch}
                onCheckedChange={(value) => updateSetting('autoLaunch', value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium">Max Companies Per Day</label>
              <Input
                type="number"
                value={settings.maxCompaniesPerDay}
                onChange={(e) => updateSetting('maxCompaniesPerDay', parseInt(e.target.value))}
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="20"
              />
              <p className="text-blue-200/60 text-sm">Limit daily company launches to prevent resource overload</p>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium">Minimum Confidence Score (%)</label>
              <Input
                type="number"
                value={settings.minConfidenceScore}
                onChange={(e) => updateSetting('minConfidenceScore', parseInt(e.target.value))}
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="100"
              />
              <p className="text-blue-200/60 text-sm">Only launch opportunities above this confidence threshold</p>
            </div>
          </div>
        </div>

        {/* AI Agent Settings */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">AI Agent Configuration</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium">Agent Autonomy Level (%)</label>
              <Input
                type="range"
                value={settings.agentAutonomy}
                onChange={(e) => updateSetting('agentAutonomy', parseInt(e.target.value))}
                className="bg-white/10 border-white/20"
                min="0"
                max="100"
              />
              <div className="flex justify-between text-sm text-blue-200/60">
                <span>Manual Control</span>
                <span className="text-white font-medium">{settings.agentAutonomy}%</span>
                <span>Full Autonomy</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium">Risk Tolerance</label>
              <select
                value={settings.riskTolerance}
                onChange={(e) => updateSetting('riskTolerance', e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2"
              >
                <option value="conservative">Conservative - Low risk, stable returns</option>
                <option value="medium">Balanced - Medium risk, balanced approach</option>
                <option value="aggressive">Aggressive - High risk, high reward</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* API Cannon */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Plug className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">API Cannon</h2>
          </div>
          <p className="text-blue-200/60 text-sm mb-6">Manage your API integrations to streamline operations across all SmartVenture modules.</p>

          {/* Find Integrations Button */}
          <div className="mb-6">
            <Button
              onClick={handleFindIntegrations}
              disabled={isSearching}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              aria-label="Search for available integrations"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isSearching ? 'Searching...' : 'Find Integrations'}
            </Button>
          </div>

          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/5 mb-6">
              <TabsTrigger value="sales">SalesSync AI</TabsTrigger>
              <TabsTrigger value="accounting">AccuSync AI</TabsTrigger>
              <TabsTrigger value="legal">RegSync AI</TabsTrigger>
              <TabsTrigger value="operations">OpsSync AI</TabsTrigger>
              <TabsTrigger value="tech">TechSync AI</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              {getIntegrationsByCategory('SalesSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{integration.name}</p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={integration.status === 'connected' ? 'text-green-300 border-green-500/50' : 'text-gray-400 border-gray-500/50'}>
                      {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={integration.status === 'connected' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={integration.status === 'connected' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300' : 'bg-green-500/20 hover:bg-green-500/40 text-green-300'}
                    >
                      {integration.status === 'connected' ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Discovered Integrations for SalesSync AI */}
              {getDiscoveredIntegrationsByCategory('SalesSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div>
                    <p className="text-white font-medium">{integration.name} <Badge className="ml-2 bg-blue-500/20 text-blue-300">New</Badge></p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnectDiscoveredIntegration(integration)}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="accounting" className="space-y-4">
               {getIntegrationsByCategory('AccuSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{integration.name}</p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={integration.status === 'connected' ? 'text-green-300 border-green-500/50' : 'text-gray-400 border-gray-500/50'}>
                      {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={integration.status === 'connected' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={integration.status === 'connected' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300' : 'bg-green-500/20 hover:bg-green-500/40 text-green-300'}
                    >
                      {integration.status === 'connected' ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Discovered Integrations for AccuSync AI */}
              {getDiscoveredIntegrationsByCategory('AccuSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div>
                    <p className="text-white font-medium">{integration.name} <Badge className="ml-2 bg-blue-500/20 text-blue-300">New</Badge></p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnectDiscoveredIntegration(integration)}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="legal" className="space-y-4">
               {getIntegrationsByCategory('RegSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{integration.name}</p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={integration.status === 'connected' ? 'text-green-300 border-green-500/50' : 'text-gray-400 border-gray-500/50'}>
                      {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={integration.status === 'connected' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={integration.status === 'connected' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300' : 'bg-green-500/20 hover:bg-green-500/40 text-green-300'}
                    >
                      {integration.status === 'connected' ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Discovered Integrations for RegSync AI */}
              {getDiscoveredIntegrationsByCategory('RegSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div>
                    <p className="text-white font-medium">{integration.name} <Badge className="ml-2 bg-blue-500/20 text-blue-300">New</Badge></p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnectDiscoveredIntegration(integration)}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="operations" className="space-y-4">
               {getIntegrationsByCategory('OpsSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{integration.name}</p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={integration.status === 'connected' ? 'text-green-300 border-green-500/50' : 'text-gray-400 border-gray-500/50'}>
                      {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={integration.status === 'connected' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={integration.status === 'connected' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300' : 'bg-green-500/20 hover:bg-green-500/40 text-green-300'}
                    >
                      {integration.status === 'connected' ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Discovered Integrations for OpsSync AI */}
              {getDiscoveredIntegrationsByCategory('OpsSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div>
                    <p className="text-white font-medium">{integration.name} <Badge className="ml-2 bg-blue-500/20 text-blue-300">New</Badge></p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnectDiscoveredIntegration(integration)}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
               {getIntegrationsByCategory('TechSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{integration.name}</p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={integration.status === 'connected' ? 'text-green-300 border-green-500/50' : 'text-gray-400 border-gray-500/50'}>
                      {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={integration.status === 'connected' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                      className={integration.status === 'connected' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300' : 'bg-green-500/20 hover:bg-green-500/40 text-green-300'}
                    >
                      {integration.status === 'connected' ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Discovered Integrations for TechSync AI */}
              {getDiscoveredIntegrationsByCategory('TechSync AI').map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div>
                    <p className="text-white font-medium">{integration.name} <Badge className="ml-2 bg-blue-500/20 text-blue-300">New</Badge></p>
                    <p className="text-blue-200/60 text-sm">{integration.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnectDiscoveredIntegration(integration)}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Notifications */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Push Notifications</h3>
                <p className="text-blue-200/60 text-sm">Get notified about launches, milestones, and alerts</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(value) => updateSetting('notificationsEnabled', value)}
              />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">Subscription Status</p>
                <p className="text-blue-200/60 text-sm">Pro Plan - Unlimited launches</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">API Usage</p>
                <p className="text-blue-200/60 text-sm">12,450 requests this month</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Normal
              </Badge>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 px-8"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}