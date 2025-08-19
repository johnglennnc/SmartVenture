import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AccountingView({ records, companies }) {
  const getCategoryColor = (category) => {
    const colors = {
      sales: 'bg-green-500/20 text-green-300',
      marketing: 'bg-blue-500/20 text-blue-300',
      payroll: 'bg-yellow-500/20 text-yellow-300',
      opex: 'bg-purple-500/20 text-purple-300',
      rd: 'bg-indigo-500/20 text-indigo-300',
      cogs: 'bg-orange-500/20 text-orange-300',
      infrastructure: 'bg-pink-500/20 text-pink-300',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };
  
  const companyFinancials = companies.map(company => {
    const companyRecords = records.filter(r => r.company_id === company.id);
    const revenue = companyRecords.filter(r => r.type === 'revenue').reduce((sum, r) => sum + r.amount, 0);
    const expenses = companyRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    return { name: company.name, revenue, expenses };
  });

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Company Financials Overview</h2>
      
      <div className="h-72 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={companyFinancials}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={(value) => `$${(value/1000)}k`} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
            <Legend wrapperStyle={{ color: 'white' }}/>
            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.slice(0, 10).map(record => {
              const company = companies.find(c => c.id === record.company_id);
              return (
                <TableRow key={record.id}>
                  <TableCell className="text-blue-200/80">{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryColor(record.category)} border-0`}>{record.category}</Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">{record.description}</TableCell>
                  <TableCell className={`text-right font-semibold ${record.type === 'revenue' ? 'text-green-300' : 'text-red-300'}`}>
                    {record.type === 'revenue' ? '+' : '-'}${(record.amount).toLocaleString()}
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