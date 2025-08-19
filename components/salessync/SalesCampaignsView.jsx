import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SalesCampaignsView({ campaigns, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      planning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      paused: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-500/20';
  };

  const chartData = companies.map(company => {
    const companyCampaigns = campaigns.filter(c => c.company_id === company.id);
    return {
      name: company.name,
      revenue: companyCampaigns.reduce((sum, camp) => sum + (camp.revenue_generated || 0), 0)
    };
  }).filter(d => d.revenue > 0);

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Sales Campaigns Performance</h2>
      
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={(value) => `$${(value/1000)}k`} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
            <Bar dataKey="revenue" fill="#00D4FF" name="Revenue Generated" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Campaign Details</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Campaign</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Conversion</TableHead>
              <TableHead className="text-white text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map(campaign => {
              const company = companies.find(c => c.id === campaign.company_id);
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium text-white">{campaign.name}</TableCell>
                  <TableCell className="text-blue-200/80">{company?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">{campaign.conversion_rate || 0}%</TableCell>
                  <TableCell className="text-right text-green-300 font-semibold">${(campaign.revenue_generated || 0).toLocaleString()}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}