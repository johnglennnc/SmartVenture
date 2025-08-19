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
import { Building, ExternalLink } from 'lucide-react';

export default function RegistrationView({ registrations, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
      dissolved: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getEntityTypeColor = (type) => {
    const colors = {
      llc: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      c_corp: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      s_corp: 'bg-green-500/20 text-green-300 border-green-500/30',
      b_corp: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Entity Registration Status</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Entity Name</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Jurisdiction</TableHead>
              <TableHead className="text-white">Registration Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">EIN</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map(registration => {
              const company = companies.find(c => c.id === registration.company_id);
              return (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{registration.entity_name}</TableCell>
                  <TableCell>
                    <Badge className={`${getEntityTypeColor(registration.entity_type)} border-0`}>
                      {registration.entity_type.replace('_', '-').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">{registration.jurisdiction}</TableCell>
                  <TableCell className="text-blue-200/80">
                    {registration.registration_date ? new Date(registration.registration_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(registration.status)}>
                      {registration.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80 font-mono">
                    {registration.ein || 'Pending'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
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