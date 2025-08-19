import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

export default function ComplianceView({ requirements, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      overdue: 'bg-red-500/20 text-red-300 border-red-500/30',
      waived: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getRequirementTypeColor = (type) => {
    const colors = {
      annual_filing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      tax_filing: 'bg-green-500/20 text-green-300 border-green-500/30',
      license_renewal: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      regulatory_report: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      board_meeting: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      audit: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue > 0;
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Compliance Requirements</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Requirement</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Due Date</TableHead>
              <TableHead className="text-white">Frequency</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Responsible Party</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map(requirement => {
              const company = companies.find(c => c.id === requirement.company_id);
              const dueSoon = isDueSoon(requirement.due_date);
              
              return (
                <TableRow key={requirement.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{requirement.requirement_name}</TableCell>
                  <TableCell>
                    <Badge className={`${getRequirementTypeColor(requirement.requirement_type)} border-0`}>
                      {requirement.requirement_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-blue-200/80 ${dueSoon ? 'text-yellow-300' : ''}`}>
                    {requirement.due_date ? new Date(requirement.due_date).toLocaleDateString() : 'N/A'}
                    {dueSoon && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Due Soon</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-blue-200/80 capitalize">
                    {requirement.frequency.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(requirement.status)}>
                      {requirement.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">
                    {requirement.automated ? (
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span>AI Automated</span>
                      </div>
                    ) : (
                      requirement.responsible_party || 'Manual'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {requirement.status === 'upcoming' && (
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
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