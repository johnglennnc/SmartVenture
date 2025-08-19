import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";

export default function OpportunityFilters({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    onFiltersChange({
      niche: "all",
      competition: "all",
      minRevenue: 0
    });
  };

  const hasActiveFilters = filters.niche !== "all" || filters.competition !== "all" || filters.minRevenue > 0;

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.niche} onValueChange={(value) => updateFilter('niche', value)}>
        <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="All Niches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Niches</SelectItem>
          <SelectItem value="fintech">FinTech</SelectItem>
          <SelectItem value="healthtech">HealthTech</SelectItem>
          <SelectItem value="edtech">EdTech</SelectItem>
          <SelectItem value="ai_tools">AI Tools</SelectItem>
          <SelectItem value="saas">SaaS</SelectItem>
          <SelectItem value="ecommerce">E-commerce</SelectItem>
          <SelectItem value="climate">Climate</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.competition} onValueChange={(value) => updateFilter('competition', value)}>
        <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="All Competition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Competition</SelectItem>
          <SelectItem value="low">Low Competition</SelectItem>
          <SelectItem value="medium">Medium Competition</SelectItem>
          <SelectItem value="high">High Competition</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Min Revenue (K)"
        value={filters.minRevenue || ''}
        onChange={(e) => updateFilter('minRevenue', parseInt(e.target.value) || 0)}
        className="w-32 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50"
      />

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}