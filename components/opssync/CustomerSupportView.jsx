import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star } from 'lucide-react';

export default function CustomerSupportView({ tickets, companies }) {
    const getStatusColor = (status) => ({
        open: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
        closed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        escalated: 'bg-red-500/20 text-red-300 border-red-500/30'
    }[status] || 'bg-gray-500/20');
    
    const getPriorityColor = (priority) => ({
        low: 'bg-gray-500/20',
        medium: 'bg-blue-500/20',
        high: 'bg-yellow-500/20',
        critical: 'bg-red-500/20'
    }[priority] || 'bg-gray-500/20');

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Customer Support</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Customer</TableHead>
              <TableHead className="text-white">Issue</TableHead>
              <TableHead className="text-white">Priority</TableHead>
              <TableHead className="text-white">CSAT</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map(ticket => {
              const company = companies.find(c => c.id === ticket.company_id);
              return (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-white">{company?.name}</TableCell>
                  <TableCell className="text-blue-200/80">{ticket.customer_name}</TableCell>
                  <TableCell className="text-blue-200/80 truncate max-w-xs">{ticket.issue_summary}</TableCell>
                  <TableCell><Badge className={`${getPriorityColor(ticket.priority)} capitalize`}>{ticket.priority}</Badge></TableCell>
                  <TableCell className="text-yellow-300 flex items-center gap-1">
                    {ticket.customer_satisfaction_score} <Star className="w-4 h-4"/>
                  </TableCell>
                  <TableCell><Badge className={`${getStatusColor(ticket.status)} capitalize`}>{ticket.status.replace('_', ' ')}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}