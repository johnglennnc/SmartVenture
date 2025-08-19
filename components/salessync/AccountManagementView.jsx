import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function AccountManagementView({ accounts, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      trial: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      past_due: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      churned: 'bg-red-500/20 text-red-300 border-red-500/30',
      lead: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[status] || 'bg-gray-500/20';
  };
  
  const statusCounts = accounts.reduce((acc, account) => {
    acc[account.status] = (acc[account.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = {
    active: '#10B981',
    trial: '#3B82F6',
    past_due: '#F59E0B',
    churned: '#EF4444',
    lead: '#8B5CF6'
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Account Overview</h2>
      
      <div className="h-48 mb-8 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Customer</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Health Score</TableHead>
              <TableHead className="text-white text-right">MRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map(account => {
              const company = companies.find(c => c.id === account.company_id);
              return (
                <TableRow key={account.id}>
                  <TableCell className="font-medium text-white">{account.customer_name}</TableCell>
                  <TableCell className="text-blue-200/80">{company?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={account.health_score} className="w-24 h-2" />
                      <span className="text-blue-200/80">{account.health_score}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-green-300 font-semibold">${(account.mrr || 0).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}