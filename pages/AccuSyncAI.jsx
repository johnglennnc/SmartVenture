import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { FinancialRecord } from "@/api/entities";
import { TaxFiling } from "@/api/entities";
import { PayrollRun } from "@/api/entities";
import { FinancialReport } from "@/api/entities";
import { FinancialOptimization } from "@/api/entities";

import { Library, DollarSign, FileText, Users, TrendingUp, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AccountingView from "@/components/accusync/AccountingView";
import TaxView from "@/components/accusync/TaxView";
import PayrollView from "@/components/accusync/PayrollView";
import ReportingView from "@/components/accusync/ReportingView";
import OptimizationView from "@/components/accusync/OptimizationView";

const MetricCard = ({ title, value, icon: Icon, change }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-green-500/20">
        <Icon className="w-5 h-5 text-green-300" />
      </div>
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className="text-sm text-green-300 mt-1">{change}</p>}
  </div>
);

export default function AccuSyncAI() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    companies: [],
    financialRecords: [],
    taxFilings: [],
    payrollRuns: [],
    financialReports: [],
    optimizations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          companies,
          financialRecords,
          taxFilings,
          payrollRuns,
          financialReports,
          optimizations
        ] = await Promise.all([
          Company.list(),
          FinancialRecord.list(),
          TaxFiling.list(),
          PayrollRun.list(),
          FinancialReport.list(),
          FinancialOptimization.list()
        ]);
        setData({ companies, financialRecords, taxFilings, payrollRuns, financialReports, optimizations });
      } catch (error) {
        console.error("Failed to load AccuSync data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Macro metrics calculations
  const totalRevenue = data.financialRecords.filter(r => r.type === 'revenue').reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = data.financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const taxComplianceRate = data.taxFilings.length > 0 
    ? (data.taxFilings.filter(f => f.status === 'filed' || f.status === 'paid').length / data.taxFilings.length * 100).toFixed(0)
    : 100;
  const totalPayrollCost = data.payrollRuns.reduce((sum, p) => sum + p.total_gross_pay, 0);

  if (loading) {
    return <div className="p-8 text-white">Loading financial data...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Library className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AccuSync AI
            </h1>
            <p className="text-blue-200/60 mt-1">Autonomous Accounting, Tax, Payroll, and Reporting</p>
          </div>
        </div>

        {/* Macro Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000000).toFixed(2)}M`}
            icon={DollarSign}
            change={`Net Income: $${(netIncome/1000).toFixed(1)}K`}
          />
          <MetricCard
            title="Tax Compliance"
            value={`${taxComplianceRate}%`}
            icon={FileText}
            change={`${data.taxFilings.filter(f => f.status === 'pending').length} pending`}
          />
          <MetricCard
            title="Total Payroll"
            value={`$${(totalPayrollCost / 1000).toFixed(1)}K`}
            icon={Users}
            change={`Across ${data.companies.length} companies`}
          />
          <MetricCard
            title="Profit Margin"
            value={`${(netIncome / totalRevenue * 100).toFixed(1)}%`}
            icon={TrendingUp}
            change="Avg. across portfolio"
          />
        </div>

        <Tabs defaultValue="accounting" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/5">
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="optimizations">Opportunities</TabsTrigger>
          </TabsList>
          <TabsContent value="accounting">
            <AccountingView records={data.financialRecords} companies={data.companies} />
          </TabsContent>
          <TabsContent value="tax">
            <TaxView filings={data.taxFilings} companies={data.companies} />
          </TabsContent>
          <TabsContent value="payroll">
            <PayrollView runs={data.payrollRuns} companies={data.companies} />
          </TabsContent>
           <TabsContent value="reporting">
            <ReportingView reports={data.financialReports} companies={data.companies} />
          </TabsContent>
           <TabsContent value="optimizations">
            <OptimizationView optimizations={data.optimizations} companies={data.companies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}