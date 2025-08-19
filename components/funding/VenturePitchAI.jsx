import React, { useState, useEffect } from "react";
import { VenturePitch } from "@/api/entities";
import { PlatformMetric } from "@/api/entities";
import { Company } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Presentation, 
  TrendingUp, 
  DollarSign, 
  Rocket,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Play,
  Users,
  Globe,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MetricCard = ({ title, value, change, icon: Icon, gradient = "from-blue-500 to-cyan-400" }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-20`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <Badge className={`${change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} text-xs`}>
          {change >= 0 ? '+' : ''}{change}%
        </Badge>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-blue-200/60 text-sm">{title}</p>
  </div>
);

const PitchSlide = ({ title, children, slideNumber }) => (
  <div className="min-h-[500px] p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-white/10">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <Badge variant="outline" className="text-blue-200 border-blue-200/30">
        Slide {slideNumber}
      </Badge>
    </div>
    {children}
  </div>
);

export default function VenturePitchAI() {
  const [pitch, setPitch] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    loadPitchData();
  }, []);

  const loadPitchData = async () => {
    try {
      const [pitchData, metricsData, companiesData] = await Promise.all([
        VenturePitch.list('-generated_date', 1),
        PlatformMetric.list('-measurement_date'),
        Company.list()
      ]);
      
      setPitch(pitchData[0] || null);
      setMetrics(metricsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading pitch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePitch = async () => {
    setGenerating(true);
    try {
      // Calculate real-time platform metrics
      const totalRevenue = companies.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
      const totalValuation = companies.reduce((sum, c) => sum + (c.current_valuation || 0), 0);
      const avgGrowthRate = companies.length > 0 
        ? companies.reduce((sum, c) => sum + (c.growth_rate || 0), 0) / companies.length 
        : 0;

      // Generate AI-powered pitch content
      const pitchContent = await InvokeLLM({
        prompt: `Generate a compelling VC pitch for SmartVenture, an AI-powered synthetic startup launcher platform. 
                Platform metrics: ${companies.length} companies launched, $${(totalRevenue/1000000).toFixed(1)}M total revenue, 
                $${(totalValuation/1000000).toFixed(1)}M portfolio valuation, ${avgGrowthRate.toFixed(1)}% avg growth.
                Include market size, competitive advantages, traction, and funding ask.`,
        response_json_schema: {
          type: "object",
          properties: {
            market_size: { type: "number" },
            funding_ask: { type: "number" },
            valuation: { type: "number" },
            competitive_advantages: {
              type: "array",
              items: { type: "string" }
            },
            market_trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  trend: { type: "string" },
                  impact: { type: "string" },
                  relevance_score: { type: "number" }
                }
              }
            },
            use_of_funds: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  amount: { type: "number" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Create new pitch record
      const newPitch = await VenturePitch.create({
        pitch_id: `VP-${Date.now()}`,
        title: "SmartVenture: The Future of Autonomous Startup Creation",
        version: "v1.0",
        generated_date: new Date().toISOString(),
        market_size: pitchContent.market_size || 3500,
        funding_ask: pitchContent.funding_ask || 25000000,
        valuation: pitchContent.valuation || 100000000,
        traction_metrics: {
          entities_launched: companies.length,
          total_revenue: totalRevenue,
          monthly_growth_rate: avgGrowthRate,
          active_investors: 12
        },
        market_trends: pitchContent.market_trends || [],
        competitive_advantages: pitchContent.competitive_advantages || [
          "Fully autonomous entity creation and management",
          "AI-powered market opportunity identification", 
          "Integrated legal, financial, and operational systems",
          "24/7 unsupervised scaling capabilities"
        ],
        use_of_funds: pitchContent.use_of_funds || [
          { category: "AI Development", amount: 10000000, description: "Enhance autonomous systems" },
          { category: "Market Expansion", amount: 8000000, description: "Global platform deployment" },
          { category: "Infrastructure", amount: 5000000, description: "Scale cloud operations" },
          { category: "Team & Operations", amount: 2000000, description: "Strategic hires and operations" }
        ],
        ai_confidence_score: 94
      });

      setPitch(newPitch);
      await loadPitchData();
    } catch (error) {
      console.error('Error generating pitch:', error);
    } finally {
      setGenerating(false);
    }
  };

  const slides = [
    {
      title: "The Opportunity",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
              ${pitch?.market_size || 3500}B Market
            </h3>
            <p className="text-lg text-blue-200/80">
              The global startup ecosystem is ripe for disruption. Traditional incubators and accelerators are limited by human capacity and bias.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-semibold text-white mb-2">Market Pain Points</h4>
              <ul className="text-blue-200/70 text-sm space-y-1">
                <li>• Manual opportunity identification</li>
                <li>• Slow company formation processes</li>
                <li>• Limited scaling capabilities</li>
                <li>• Human resource constraints</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-semibold text-white mb-2">SmartVenture Solution</h4>
              <ul className="text-green-300 text-sm space-y-1">
                <li>• AI-powered market scanning</li>
                <li>• Autonomous entity creation</li>
                <li>• 24/7 unsupervised operations</li>
                <li>• Infinite scalability</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Platform Traction",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Companies Launched"
              value={pitch?.traction_metrics?.entities_launched || companies.length}
              change={25}
              icon={Rocket}
              gradient="from-purple-500 to-pink-500"
            />
            <MetricCard
              title="Total Revenue"
              value={`$${((pitch?.traction_metrics?.total_revenue || 0) / 1000000).toFixed(1)}M`}
              change={45}
              icon={DollarSign}
              gradient="from-green-500 to-emerald-400"
            />
            <MetricCard
              title="Portfolio Valuation"
              value={`$${((companies.reduce((sum, c) => sum + (c.current_valuation || 0), 0)) / 1000000).toFixed(1)}M`}
              change={67}
              icon={TrendingUp}
              gradient="from-blue-500 to-cyan-400"
            />
            <MetricCard
              title="Active AI Agents"
              value="456"
              change={32}
              icon={Users}
              gradient="from-indigo-500 to-purple-500"
            />
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-2">Key Achievements</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white">• Average time to launch: <span className="text-green-300 font-bold">2.3 hours</span></p>
                <p className="text-white">• Success rate: <span className="text-green-300 font-bold">89%</span></p>
              </div>
              <div>
                <p className="text-white">• Monthly growth: <span className="text-green-300 font-bold">{pitch?.traction_metrics?.monthly_growth_rate || 28}%</span></p>
                <p className="text-white">• Investor satisfaction: <span className="text-green-300 font-bold">94%</span></p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Competitive Advantage",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {(pitch?.competitive_advantages || [
              "Fully autonomous entity creation and management",
              "AI-powered market opportunity identification", 
              "Integrated legal, financial, and operational systems",
              "24/7 unsupervised scaling capabilities"
            ]).map((advantage, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 bg-opacity-20">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-white font-medium">{advantage}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <h4 className="font-bold text-blue-300 text-lg mb-3">The SmartVenture Ecosystem</h4>
            <p className="text-blue-200/80 mb-4">
              Unlike traditional incubators, SmartVenture creates a self-sustaining ecosystem where AI entities 
              continuously identify opportunities, launch companies, and optimize operations without human intervention.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                100% Autonomous
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Real-time Adaptation
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Infinite Scale
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Investment Ask & Use of Funds",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300 mb-2">
              ${((pitch?.funding_ask || 25000000) / 1000000).toFixed(0)}M Series A
            </h3>
            <p className="text-lg text-blue-200/80">
              To accelerate global expansion and enhance AI capabilities
            </p>
            <Badge className="mt-3 bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
              ${((pitch?.valuation || 100000000) / 1000000).toFixed(0)}M Pre-Money Valuation
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {(pitch?.use_of_funds || []).map((fund, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{fund.category}</h4>
                  <span className="text-green-300 font-bold">
                    ${(fund.amount / 1000000).toFixed(0)}M
                  </span>
                </div>
                <p className="text-blue-200/70 text-sm">{fund.description}</p>
                <div className="mt-2 h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                    style={{ width: `${(fund.amount / (pitch?.funding_ask || 25000000)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-2">12-Month Projections</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-white font-bold text-lg">500+</p>
                <p className="text-purple-200/70">Companies Launched</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">$100M</p>
                <p className="text-purple-200/70">Portfolio Valuation</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">15%</p>
                <p className="text-purple-200/70">Market Share</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="p-8 text-white">Loading pitch data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Presentation className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">VenturePitch AI</h2>
            <p className="text-blue-200/60 text-sm">Dynamic VC pitch generation</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={generatePitch}
            disabled={generating}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {generating ? 'Generating...' : 'Refresh Pitch'}
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-400">
            <Download className="w-4 h-4 mr-2" />
            Export Deck
          </Button>
        </div>
      </div>

      {/* Pitch Status */}
      {pitch && (
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{pitch.title}</h3>
              <p className="text-blue-200/60 text-sm">
                Version {pitch.version} • Generated {new Date(pitch.generated_date).toLocaleDateString()} • 
                AI Confidence: {pitch.ai_confidence_score}%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Ready for VCs
              </Badge>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400">
                <Play className="w-4 h-4 mr-2" />
                Present
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Deck */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Interactive Pitch Deck</h3>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeSlide === index 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <PitchSlide 
          title={slides[activeSlide].title} 
          slideNumber={activeSlide + 1}
        >
          {slides[activeSlide].content}
        </PitchSlide>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Previous
          </Button>
          <Button
            onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
            disabled={activeSlide === slides.length - 1}
            className="bg-gradient-to-r from-blue-500 to-cyan-400"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}