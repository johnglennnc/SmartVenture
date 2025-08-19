import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Code, Smartphone } from "lucide-react";

export default function PlatformPreviewsView({ platforms, companies }) {
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || "Unknown Company";
  };

  const getPlatformIcon = (type) => {
    switch (type) {
      case 'web_app': return Globe;
      case 'mobile_app': return Smartphone;
      case 'api': return Code;
      default: return Globe;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-500/20 text-green-300';
      case 'testing': return 'bg-yellow-500/20 text-yellow-300';
      case 'development': return 'bg-blue-500/20 text-blue-300';
      case 'maintenance': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = getPlatformIcon(platform.platform_type);
          
          return (
            <div key={platform.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 bg-opacity-20">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{platform.platform_name}</h3>
                    <p className="text-sm text-blue-200">{getCompanyName(platform.company_id)}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(platform.status)}>
                  {platform.status}
                </Badge>
              </div>

              <div className="mb-4">
                <p className="text-sm text-blue-200 mb-2">Tech Stack:</p>
                <div className="flex flex-wrap gap-1">
                  {platform.tech_stack?.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {platform.tech_stack?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{platform.tech_stack.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {platform.features && (
                <div className="mb-4">
                  <p className="text-sm text-blue-200 mb-2">Features:</p>
                  <div className="space-y-1">
                    {platform.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-white">{feature.name}</span>
                        <Badge className={
                          feature.status === 'active' ? 'bg-green-500/20 text-green-300' :
                          feature.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }>
                          {feature.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {platform.preview_url && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                )}
                {platform.deployment_url && (
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Globe className="w-3 h-3 mr-1" />
                    Live Site
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {platforms.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Platforms Found</h3>
          <p className="text-blue-200">Launch your first company to see AI-generated platforms here.</p>
        </div>
      )}
    </div>
  );
}