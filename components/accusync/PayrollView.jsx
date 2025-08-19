import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function PayrollView({ runs, companies }) {
  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <h2 className="text-xl font-semibold text-white mb-4">Payroll Runs</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Pay Period</TableHead>
              <TableHead className="text-white">Employees</TableHead>
              <TableHead className="text-white">Gross Pay</TableHead>
              <TableHead className="text-white">Taxes</TableHead>
              <TableHead className="text-white text-right">Net Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map(run => {
              const company = companies.find(c => c.id === run.company_id);
              const taxesPercentage = (run.total_taxes / run.total_gross_pay) * 100;
              return (
                <TableRow key={run.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">
                    {new Date(run.pay_period_start).toLocaleDateString()} - {new Date(run.pay_period_end).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-blue-200/80">{run.employee_count}</TableCell>
                  <TableCell className="text-blue-200/80">${(run.total_gross_pay).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-blue-200/80 w-20">${(run.total_taxes).toLocaleString()}</span>
                       <Progress value={taxesPercentage} className="w-24 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-300">
                    ${(run.total_net_pay).toLocaleString()}
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