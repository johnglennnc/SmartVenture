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
import { Download } from 'lucide-react';

export default function ReportingView({ reports, companies }) {
  const getScoreColor = (score) => {
    if (score > 85) return 'bg-green-500/20 text-green-300';
    if (score > 60) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-red-500/20 text-red-300';
  };
  
  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Generated Financial Reports</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Report Type</TableHead>
              <TableHead className="text-white">Period</TableHead>
              <TableHead className="text-white">Audit Readiness</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => {
              const company = companies.find(c => c.id === report.company_id);
              return (
                <TableRow key={report.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80 capitalize">{report.report_type.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-blue-200/80">{report.period}</TableCell>
                  <TableCell>
                    <Badge className={`${getScoreColor(report.audit_readiness_score)} border-0`}>
                      {report.audit_readiness_score}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download
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