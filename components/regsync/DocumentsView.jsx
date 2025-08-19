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
import { FileCheck, Download, Users, Edit } from 'lucide-react';

export default function DocumentsView({ documents, companies }) {
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      signed: 'bg-green-500/20 text-green-300 border-green-500/30',
      filed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      archived: 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      articles_of_incorporation: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bylaws: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      operating_agreement: 'bg-green-500/20 text-green-300 border-green-500/30',
      shareholder_agreement: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      board_resolution: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      employment_agreement: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      nda: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <FileCheck className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Corporate Documents</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Document Name</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Version</TableHead>
              <TableHead className="text-white">Created Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Signatures</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map(document => {
              const company = companies.find(c => c.id === document.company_id);
              const signedCount = document.signers ? document.signers.filter(s => s.signed).length : 0;
              const totalSigners = document.signers ? document.signers.length : 0;
              
              return (
                <TableRow key={document.id}>
                  <TableCell className="font-medium text-white">{company?.name || "N/A"}</TableCell>
                  <TableCell className="text-blue-200/80">{document.document_name}</TableCell>
                  <TableCell>
                    <Badge className={`${getDocumentTypeColor(document.document_type)} border-0`}>
                      {document.document_type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-200/80 font-mono">{document.version}</TableCell>
                  <TableCell className="text-blue-200/80">
                    {document.created_date ? new Date(document.created_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {totalSigners > 0 ? (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{signedCount}/{totalSigners}</span>
                        {signedCount === totalSigners && totalSigners > 0 && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            Complete
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-blue-200/60">No signatures required</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {document.status === 'draft' && (
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
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