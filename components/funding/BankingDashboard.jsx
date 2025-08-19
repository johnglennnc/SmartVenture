import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Building2, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Plus,
  AlertCircle
} from "lucide-react";

export default function BankingDashboard({ bankAccounts, companies, onSync, syncingBanks }) {
  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'mercury':
        return '🚀';
      case 'brex':
        return '💳';
      default:
        return '🏦';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      connected: 'bg-green-500/20 text-green-300 border-green-500/30',
      disconnected: 'bg-red-500/20 text-red-300 border-red-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const totalBalance = bankAccounts.reduce((sum, account) => sum + (account.current_balance || 0), 0);
  const totalMonthlySpend = bankAccounts.reduce((sum, account) => sum + (account.monthly_spend || 0), 0);
  const connectedAccounts = bankAccounts.filter(account => account.integration_status === 'connected');

  return (
    <div className="space-y-6">
      {/* Banking Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Total Balance</h3>
              <p className="text-2xl font-bold text-green-300">
                ${(totalBalance / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">Across {bankAccounts.length} accounts</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Spend</h3>
              <p className="text-2xl font-bold text-orange-300">
                ${(totalMonthlySpend / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">Burn rate tracking</p>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Connected</h3>
              <p className="text-2xl font-bold text-blue-300">
                {connectedAccounts.length}/{bankAccounts.length}
              </p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm">Bank integrations</p>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Bank Accounts</h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSync}
              disabled={syncingBanks}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {syncingBanks ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sync All
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {bankAccounts.map((account) => {
            const company = companies.find(c => c.id === account.company_id);
            return (
              <div key={account.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getProviderIcon(account.bank_provider)}</div>
                    <div>
                      <h3 className="text-white font-semibold">{account.account_name}</h3>
                      <p className="text-blue-200/60 text-sm">
                        {company?.name || 'Master Account'} • {account.account_type}
                      </p>
                      <p className="text-blue-200/60 text-xs">
                        ****{account.account_number?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(account.integration_status)}>
                      {account.integration_status}
                    </Badge>
                    {account.integration_status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-400 mt-1" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-blue-200/60 text-sm">Current Balance</p>
                    <p className="text-white font-semibold">
                      ${(account.current_balance || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200/60 text-sm">Monthly Spend</p>
                    <p className="text-white font-semibold">
                      ${(account.monthly_spend || 0).toLocaleString()}
                    </p>
                  </div>
                  {account.available_credit && (
                    <div>
                      <p className="text-blue-200/60 text-sm">Available Credit</p>
                      <p className="text-white font-semibold">
                        ${account.available_credit.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-blue-200/60 text-sm">Last Sync</p>
                    <p className="text-white font-semibold text-xs">
                      {account.last_sync 
                        ? new Date(account.last_sync).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>

                {/* Spending Categories */}
                {account.spending_categories && (
                  <div className="space-y-2">
                    <p className="text-blue-200/60 text-sm">Monthly Spending Breakdown</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      {Object.entries(account.spending_categories).map(([category, amount]) => (
                        <div key={category} className="text-center p-2 rounded bg-white/5">
                          <p className="text-blue-200/60 capitalize">{category}</p>
                          <p className="text-white font-medium">${(amount || 0).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {bankAccounts.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Bank Accounts Connected</h3>
            <p className="text-blue-200/60 mb-4">Connect your Mercury and Brex accounts to get started</p>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
              <Plus className="w-4 h-4 mr-2" />
              Connect Bank Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}