import React from "react";
import { Badge } from "@/components/ui/badge";
import { Code, Bug, Clock, Zap, Shield, TrendingUp } from "lucide-react";

export default function DevelopmentMetricsView({ developmentMetrics, platforms, companies }) {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || "Unknown Company";
  };

  const getPlatformName = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.platform_name || "Unknown Platform";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-300';
    if (score >= 60) return 'text-yellow-300';
    return 'text-red-300';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {developmentMetrics.map((metrics) => (
          <div key={metrics.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{getPlatformName(metrics.platform_id)}</h3>
                <p className="text-sm text-blue-200">{getCompanyName(metrics.company_id)}</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300">
                {metrics.measurement_period}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-200">Features Deployed</p>
                  <p className="font-semibold text-white">{metrics.features_deployed}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-blue-200">Bugs Fixed</p>
                  <p className="font-semibold text-white">{metrics.bugs_fixed}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-blue-200">Avg Dev Time</p>
                  <p className="font-semibold text-white">{metrics.avg_development_time}h</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-blue-200">Deployments</p>
                  <p className="font-semibold text-white">{metrics.deployment_frequency}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-200">Code Quality</span>
                </div>
                <span className={`font-semibold ${getScoreColor(metrics.code_quality_score)}`}>
                  {metrics.code_quality_score}/100
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-200">Security Score</span>
                </div>
                <span className={`font-semibold ${getScoreColor(metrics.security_score)}`}>
                  {metrics.security_score}/100
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-blue-200">Performance</span>
                </div>
                <span className={`font-semibold ${getScoreColor(metrics.performance_score)}`}>
                  {metrics.performance_score}/100
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-200">AI Automation</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" 
                      style={{ width: `${metrics.ai_automation_percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold">{metrics.ai_automation_percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {developmentMetrics.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Development Data</h3>
          <p className="text-blue-200">Development metrics will appear here as platforms are built.</p>
        </div>
      )}
    </div>
  );
}