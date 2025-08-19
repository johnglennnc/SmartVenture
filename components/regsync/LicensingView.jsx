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
import { Award, Calendar, RefreshCw } from 'lucide-react';

export default function LicensingView({ licenses, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      pending: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      approved: 'bg-green-500/20 text-green-300 border-green-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      expired: 'bg-red-500/20 text-red-300 border-red-500/30',
      suspended: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getLicenseTypeColor = (type) => {
    const colors = {
      general_business: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      professional: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      trade: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      health: 'bg-red-500/20 text-red-300 border-red-500/30',
      food_service: 'bg-green-500/20 text-green-300 border-green-500/30',
      financial: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      technology: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Business Licenses & Permits</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">License Name</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Issuing Authority</TableHead>
              <TableHead className="text-white">Issue Date</TableHead>
              <TableHead className="text-white">Expiration</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map(license => {
              const company = companies.find(c => c.id === license.company_id);
              const expiringSoon = isExpiringSoon(license.expiration_date);
              
              return (
                <TableRow key={license.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{license.license_name}</TableCell>
                  <TableCell>
                    <Badge className={`${getLicenseTypeColor(license.license_type)} border-0`}>
                      {license.license_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">{license.issuing_authority}</TableCell>
                  <TableCell className="text-blue-200/80">
                    {license.issue_date ? new Date(license.issue_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className={`text-blue-200/80 ${expiringSoon ? 'text-yellow-300' : ''}`}>
                    {license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : 'N/A'}
                    {expiringSoon && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Expires Soon</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(license.status)}>
                      {license.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {license.renewal_required && (
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renew
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