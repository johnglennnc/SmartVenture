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
import { HandCoins, Bot, Download, Send } from 'lucide-react';

export default function SAFEView({ safeAgreements, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      pending_signature: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      signed: 'bg-green-500/20 text-green-300 border-green-500/30',
      converted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getInvestorTypeColor = (type) => {
    const colors = {
      ai_vc: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      traditional_vc: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      angel: 'bg-green-500/20 text-green-300 border-green-500/30',
      strategic: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      individual: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <HandCoins className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-semibold text-white">SAFE Agreements</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Investor</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Investment Amount</TableHead>
              <TableHead className="text-white">Valuation Cap</TableHead>
              <TableHead className="text-white">Discount Rate</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">AI Generated</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeAgreements.map(safe => {
              const company = companies.find(c => c.id === safe.company_id);
              
              return (
                <TableRow key={safe.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{safe.investor_name}</TableCell>
                  <TableCell>
                    <Badge className={`${getInvestorTypeColor(safe.investor_type)} border-0`}>
                      {safe.investor_type?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-300 font-semibold">
                    ${safe.investment_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-blue-200/80">
                    ${safe.valuation_cap ? safe.valuation_cap.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-blue-200/80">
                    {safe.discount_rate ? `${safe.discount_rate}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(safe.status)}>
                      {safe.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {safe.ai_generated && (
                      <div className="flex items-center gap-1">
                        <Bot className="w-4 h-4 text-purple-400" />
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                          AI
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {safe.status === 'draft' && (
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {safeAgreements.length === 0 && (
        <div className="text-center py-12">
          <HandCoins className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No SAFE Agreements</h3>
          <p className="text-blue-200/60">AI will automatically generate SAFE agreements when investment opportunities arise</p>
        </div>
      )}
    </div>
  );
}