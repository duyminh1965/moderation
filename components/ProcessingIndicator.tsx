import React from 'react';
import { Loader2, Cpu, Shield } from 'lucide-react';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Content
        </h3>
        <p className="text-gray-600 mb-4">
          AWS Lambda is analyzing your content using AI
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Cpu className="h-4 w-4" />
            <span>Lambda function triggered</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>AI analysis in progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};