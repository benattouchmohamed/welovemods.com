
import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SecurityVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl: string;
  countdown?: number;
}

const SecurityVerification = ({
  isOpen,
  onClose,
  redirectUrl,
  countdown = 5,
}: SecurityVerificationProps) => {
  const [timer, setTimer] = useState(countdown);

  useEffect(() => {
    if (!isOpen) {
      setTimer(countdown);
      return;
    }

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Redirect when timer reaches 0
      window.location.href = redirectUrl;
    }
  }, [isOpen, timer, redirectUrl, countdown]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">Security Verification</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 flex flex-col items-center">
          <DialogDescription className="text-center mb-6 text-base">
            Verifying your request to ensure a safe download experience
          </DialogDescription>
          
          <div className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
            <div 
              className="bg-app-purple h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((countdown - timer) / countdown) * 100}%` }}
            />
          </div>
          
          <div className="text-center text-base font-medium mb-4">
            Redirecting in <span className="text-app-purple font-bold">{timer}</span> seconds...
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Download URL: {redirectUrl}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityVerification;
