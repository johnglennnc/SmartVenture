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

export default function TaxView({ filings, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      filed: 'bg-green-500/20 text-green-300',
      paid: 'bg-blue-500/20 text-blue-300',
      pending: 'bg-yellow-500/20 text-yellow-300',
      auditing: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Tax Filing Status</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Period</TableHead>
              <TableHead className="text-white">Tax Type</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Due Date</TableHead>
              <TableHead className="text-white text-right">Amount Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filings.map(filing => {
              const company = companies.find(c => c.id === filing.company_id);
              return (
                <TableRow key={filing.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{filing.filing_period}</TableCell>
                  <TableCell className="text-blue-200/80 capitalize">{filing.tax_type}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(filing.status)} border-0`}>{filing.status}</Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80">{new Date(filing.due_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-semibold text-red-300">
                    ${(filing.amount_due).toLocaleString()}
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