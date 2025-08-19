import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Briefcase } from 'lucide-react';

export default function HRView({ records, companies }) {
    const getStatusColor = (status) => ({
        active: 'bg-green-500/20 text-green-300 border-green-500/30',
        on_leave: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        training: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        terminated: 'bg-red-500/20 text-red-300 border-red-500/30'
    }[status] || 'bg-gray-500/20');

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Human Resources & Workforce</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Employee/Agent</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Hire Date</TableHead>
              <TableHead className="text-white">Performance</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map(record => {
              const company = companies.find(c => c.id === record.company_id);
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-white">{company?.name}</TableCell>
                  <TableCell className="text-blue-200/80 flex items-center gap-2">
                    {record.is_ai_agent ? <Bot className="w-4 h-4 text-purple-400"/> : <Users className="w-4 h-4"/>}
                    {record.employee_name}
                  </TableCell>
                  <TableCell className="text-blue-200/80">{record.role}</TableCell>
                  <TableCell className="text-blue-200/80">{new Date(record.hire_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white">{record.performance_score}%</TableCell>
                  <TableCell><Badge className={getStatusColor(record.status)}>{record.status.replace('_', ' ')}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}