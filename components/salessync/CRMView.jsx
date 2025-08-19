import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock } from 'lucide-react';

export default function CRMView({ interactions, accounts, companies }) {
  const getOutcomeColor = (outcome) => {
    const colors = {
      positive: 'bg-green-500/20 text-green-300 border-green-500/30',
      neutral: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      negative: 'bg-red-500/20 text-red-300 border-red-500/30',
      resolved: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[outcome] || 'bg-gray-500/20';
  };

  const chartData = [
    { name: 'Jan', interactions: 120 },
    { name: 'Feb', interactions: 180 },
    { name: 'Mar', interactions: 160 },
    { name: 'Apr', interactions: 250 },
    { name: 'May', interactions: 220 },
    { name: 'Jun', interactions: 310 },
  ];

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">CRM & Retention</h2>
      
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
            <Line type="monotone" dataKey="interactions" stroke="#8B5CF6" name="Customer Interactions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Recent Interactions</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Customer</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Outcome</TableHead>
              <TableHead className="text-white">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.slice(0, 10).map(interaction => {
              const account = accounts.find(a => a.id === interaction.account_id);
              const company = companies.find(c => c.id === interaction.company_id);
              return (
                <TableRow key={interaction.id}>
                  <TableCell className="font-medium text-white">{account?.customer_name || 'N/A'}</TableCell>
                  <TableCell className="text-blue-200/80">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80 capitalize">{interaction.type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge className={getOutcomeColor(interaction.outcome)}>{interaction.outcome}</Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80 text-xs">
                    {new Date(interaction.interaction_date).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}