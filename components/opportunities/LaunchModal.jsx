import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  Brain, 
  Code, 
  Globe, 
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";

export default function LaunchModal({ opportunity, onLaunch, onClose }) {
  const [launching, setLaunching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const launchSteps = [
    { icon: Brain, title: "Analyzing Market", description: "AI analyzing market conditions" },
    { icon: Code, title: "Building MVP", description: "Generating initial product" },
    { icon: Globe, title: "Setting up Infrastructure", description: "Deploying to cloud" },
    { icon: Users, title: "Recruiting AI Team", description: "Assigning AI agents" },
    { icon: Rocket, title: "Going Live", description: "Launching company" }
  ];

  const handleLaunch = async () => {
    setLaunching(true);
    
    for (let i = 0; i < launchSteps.length; i++) {
      setCurrentStep(i);
      setProgress((i / launchSteps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await onLaunch(opportunity);
    setLaunching(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <Rocket className="w-6 h-6 text-cyan-400" />
            Launch Startup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opportunity Overview */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{opportunity.title}</h3>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {opportunity.niche?.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-blue-200/70 text-sm mb-4">{opportunity.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-white font-semibold">${(opportunity.market_size || 0).toFixed(1)}M</p>
                <p className="text-blue-200/60 text-xs">Market Size</p>
              </div>
              <div className="text-center">
                <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-white font-semibold">{opportunity.ai_feasibility || 0}%</p>
                <p className="text-blue-200/60 text-xs">AI Feasible</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-white font-semibold">2-3 hrs</p>
                <p className="text-blue-200/60 text-xs">Launch Time</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-white font-semibold">40%</p>
                <p className="text-blue-200/60 text-xs">Equity Stake</p>
              </div>
            </div>
          </div>

          {/* Launch Progress */}
          {launching && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Launch Progress</span>
                <span className="text-cyan-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-3">
                {launchSteps.map((step, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index < currentStep 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : index === currentStep 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-white/5 border border-white/10'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      index < currentStep 
                        ? 'bg-green-500/20' 
                        : index === currentStep 
                          ? 'bg-blue-500/20' 
                          : 'bg-gray-500/20'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : index === currentStep ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      ) : (
                        <step.icon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        index <= currentStep ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-sm ${
                        index <= currentStep ? 'text-blue-200/70' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!launching && (
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLaunch}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Launch Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}