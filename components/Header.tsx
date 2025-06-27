import React from 'react';
import { Shield, Zap, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="relative">
              <Shield className="h-12 w-12" />
              <Zap className="h-6 w-6 absolute -top-1 -right-1 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold">AI Content Moderator</h1>
          </div>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Powered by AWS Lambda + Bedrock/Rekognition for real-time content moderation
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-blue-200" />
              <span>AWS Lambda Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-200" />
              <span>AI-Powered Detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-200" />
              <span>Real-time Results</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};