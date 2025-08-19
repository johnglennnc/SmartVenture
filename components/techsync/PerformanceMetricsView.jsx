import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Users, AlertTriangle } from "lucide-react";

export default function PerformanceMetricsView({ platformMetrics, platforms, companies }) {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || "Unknown Company";
  };

  const getPlatformName = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.platform_name || "Unknown Platform";
  };

  const getPerformanceColor = (value, type) => {
    switch (type) {
      case 'uptime':
        if (value >= 99.5) return 'text-green-300';
        if (value >= 98) return 'text-yellow-300';
        return 'text-red-300';
      case 'load_time':
        if (value <= 1000) return 'text-green-300';
        if (value <= 3000) return 'text-yellow-300';
        return 'text-red-300';
      case 'error_rate':
        if (value <= 0.1) return 'text-green-300';
        if (value <= 1) return 'text-yellow-300';
        return 'text-red-300';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {platformMetrics.map((metrics) => (
          <div key={metrics.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{getPlatformName(metrics.platform_id)}</h3>
                <p className="text-sm text-blue-200">{getCompanyName(metrics.company_id)}</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300">
                {new Date(metrics.measurement_date).toLocaleDateString()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-blue-200">Uptime</p>
                  <p className={`font-semibold ${getPerformanceColor(metrics.uptime_percentage, 'uptime')}`}>
                    {metrics.uptime_percentage?.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-blue-200">Load Time</p>
                  <p className={`font-semibold ${getPerformanceColor(metrics.avg_load_time, 'load_time')}`}>
                    {metrics.avg_load_time?.toFixed(0)}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-200">Daily Users</p>
                  <p className="font-semibold text-white">
                    {metrics.daily_active_users?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-blue-200">Error Rate</p>
                  <p className={`font-semibold ${getPerformanceColor(metrics.error_rate, 'error_rate')}`}>
                    {metrics.error_rate?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {metrics.session_duration && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Avg. Session:</span>
                    <span className="text-white ml-2">{metrics.session_duration?.toFixed(1)} min</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Bounce Rate:</span>
                    <span className="text-white ml-2">{metrics.bounce_rate?.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Conversion:</span>
                    <span className="text-white ml-2">{metrics.conversion_rate?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {platformMetrics.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Performance Data</h3>
          <p className="text-blue-200">Performance metrics will appear here once platforms are deployed.</p>
        </div>
      )}
    </div>
  );
}