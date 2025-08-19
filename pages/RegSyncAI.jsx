import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { EntityRegistration } from "@/api/entities";
import { BusinessLicense } from "@/api/entities";
import { CorporateDocument } from "@/api/entities";
import { SAFEAgreement } from "@/api/entities";
import { ComplianceRequirement } from "@/api/entities";

import { FileText, Building, Award, FileCheck, HandCoins, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RegistrationView from "@/components/regsync/RegistrationView";
import LicensingView from "@/components/regsync/LicensingView";
import DocumentsView from "@/components/regsync/DocumentsView";
import SAFEView from "@/components/regsync/SAFEView";
import ComplianceView from "@/components/regsync/ComplianceView";
import OptimizationView from "@/components/regsync/OptimizationView";

const MetricCard = ({ title, value, icon: Icon, change, status }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${status === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
        <Icon className={`w-5 h-5 ${status === 'warning' ? 'text-yellow-300' : 'text-blue-300'}`} />
      </div>
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {change && <p className="text-sm text-green-300 mt-1">{change}</p>}
  </div>
);

export default function RegSyncAI() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    companies: [],
    registrations: [],
    licenses: [],
    documents: [],
    safeAgreements: [],
    complianceRequirements: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          companies,
          registrations,
          licenses,
          documents,
          safeAgreements,
          complianceRequirements
        ] = await Promise.all([
          Company.list(),
          EntityRegistration.list(),
          BusinessLicense.list(),
          CorporateDocument.list(),
          SAFEAgreement.list(),
          ComplianceRequirement.list()
        ]);
        setData({ companies, registrations, licenses, documents, safeAgreements, complianceRequirements });
      } catch (error) {
        console.error("Failed to load RegSync data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Macro metrics calculations
  const totalEntities = data.registrations.length;
  const activeEntities = data.registrations.filter(r => r.status === 'active').length;
  const totalLicenses = data.licenses.length;
  const activeLicenses = data.licenses.filter(l => l.status === 'active').length;
  const totalSAFEs = data.safeAgreements.length;
  const signedSAFEs = data.safeAgreements.filter(s => s.status === 'signed').length;
  const totalSAFEValue = data.safeAgreements.reduce((sum, s) => sum + s.investment_amount, 0);
  const overdueCompliance = data.complianceRequirements.filter(c => c.status === 'overdue').length;
  const upcomingCompliance = data.complianceRequirements.filter(c => c.status === 'upcoming').length;

  if (loading) {
    return <div className="p-8 text-white">Loading legal and compliance data...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <FileText className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              RegSync AI
            </h1>
            <p className="text-blue-200/60 mt-1">Autonomous Legal, Compliance & Investment Documentation</p>
          </div>
        </div>

        {/* Macro Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Entities Registered"
            value={`${activeEntities}/${totalEntities}`}
            icon={Building}
            change={`${Math.round(activeEntities/totalEntities*100)}% active`}
          />
          <MetricCard
            title="Licenses Active"
            value={`${activeLicenses}/${totalLicenses}`}
            icon={Award}
            change={`${Math.round(activeLicenses/totalLicenses*100)}% compliance`}
          />
          <MetricCard
            title="SAFE Agreements"
            value={`${signedSAFEs}/${totalSAFEs}`}
            icon={HandCoins}
            change={`$${(totalSAFEValue/1000000).toFixed(1)}M raised`}
          />
          <MetricCard
            title="Compliance Status"
            value={upcomingCompliance}
            icon={AlertTriangle}
            change={`${overdueCompliance} overdue items`}
            status={overdueCompliance > 0 ? 'warning' : 'normal'}
          />
        </div>

        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/5">
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="licensing">Licensing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="safe">SAFE Agreements</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="optimization">Opportunities</TabsTrigger>
          </TabsList>
          <TabsContent value="registration">
            <RegistrationView registrations={data.registrations} companies={data.companies} />
          </TabsContent>
          <TabsContent value="licensing">
            <LicensingView licenses={data.licenses} companies={data.companies} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsView documents={data.documents} companies={data.companies} />
          </TabsContent>
          <TabsContent value="safe">
            <SAFEView safeAgreements={data.safeAgreements} companies={data.companies} />
          </TabsContent>
          <TabsContent value="compliance">
            <ComplianceView requirements={data.complianceRequirements} companies={data.companies} />
          </TabsContent>
          <TabsContent value="optimization">
            <OptimizationView 
              registrations={data.registrations} 
              licenses={data.licenses}
              companies={data.companies} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}