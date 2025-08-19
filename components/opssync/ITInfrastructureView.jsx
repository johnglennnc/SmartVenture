import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Code, WifiOff, CircleDot } from 'lucide-react';

export default function ITInfrastructureView({ assets, companies }) {
    const getStatusColor = (status) => ({
        online: 'bg-green-500/20 text-green-300 border-green-500/30',
        offline: 'bg-red-500/20 text-red-300 border-red-500/30',
        maintenance: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        warning: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        degraded: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }[status] || 'bg-gray-500/20');
    
    const getAssetIcon = (type) => {
        const icons = {
            server: <Server className="w-4 h-4 text-blue-400"/>,
            database: <Database className="w-4 h-4 text-green-400"/>,
            software_license: <Code className="w-4 h-4 text-purple-400"/>,
            api_endpoint: <CircleDot className="w-4 h-4 text-cyan-400" />
        };
        return icons[type] || <Server className="w-4 h-4"/>;
    }

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-semibold text-white">IT Infrastructure & Assets</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Asset</TableHead>
              <TableHead className="text-white">Provider</TableHead>
              <TableHead className="text-white">Uptime</TableHead>
              <TableHead className="text-white">Monthly Cost</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map(asset => {
              const company = companies.find(c => c.id === asset.company_id);
              return (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium text-white">{company?.name}</TableCell>
                  <TableCell className="text-blue-200/80 flex items-center gap-2">
                    {getAssetIcon(asset.asset_type)}
                    {asset.asset_name}
                  </TableCell>
                  <TableCell className="text-blue-200/80">{asset.provider}</TableCell>
                  <TableCell className="text-white">{asset.uptime_percentage}%</TableCell>
                  <TableCell className="text-green-300">${asset.monthly_cost?.toFixed(2)}</TableCell>
                  <TableCell><Badge className={getStatusColor(asset.status)}>{asset.status}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}