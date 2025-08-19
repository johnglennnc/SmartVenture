import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck } from 'lucide-react';

export default function SupplyChainView({ items, companies }) {
  const getStatusColor = (status) => ({
    in_stock: 'bg-green-500/20 text-green-300 border-green-500/30',
    low_stock: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    on_order: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    discontinued: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }[status] || 'bg-gray-500/20');

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-semibold text-white">Supply Chain & Inventory</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Item</TableHead>
              <TableHead className="text-white">Vendor</TableHead>
              <TableHead className="text-white">Quantity</TableHead>
              <TableHead className="text-white">Cost/Unit</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => {
              const company = companies.find(c => c.id === item.company_id);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-white">{company?.name}</TableCell>
                  <TableCell className="text-blue-200/80">{item.item_name}</TableCell>
                  <TableCell className="text-blue-200/80">{item.vendor}</TableCell>
                  <TableCell className="text-white">{item.quantity_on_hand}</TableCell>
                  <TableCell className="text-green-300">${item.cost_per_unit?.toFixed(2)}</TableCell>
                  <TableCell><Badge className={getStatusColor(item.status)}>{item.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-right">
                    {item.status === 'low_stock' && (
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Truck className="w-4 h-4 mr-2" />
                        Reorder
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