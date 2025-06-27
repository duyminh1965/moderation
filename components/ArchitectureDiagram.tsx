import React from 'react';
import { Database, Zap, Cloud, Shield, BarChart3, ArrowDown } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AWS Lambda Architecture</h2>
        <p className="text-gray-600">Complete serverless content moderation pipeline using AWS services</p>
      </div>
      <div className="space-y-8">
        {/* User Upload Layer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-blue-900">User Upload</p>
              <p className="text-sm text-blue-700">Content → S3 Bucket</p>
            </div>
          </div>
          <ArrowDown className="mx-auto mt-4 h-6 w-6 text-gray-400" />
        </div>

        {/* S3 Event Trigger */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-purple-900">S3 Event Trigger</p>
              <p className="text-sm text-purple-700">PutObject → Lambda Invocation</p>
            </div>
          </div>
          <ArrowDown className="mx-auto mt-4 h-6 w-6 text-gray-400" />
        </div>

        {/* Lambda Processing Layer */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-orange-900">Lambda Function</p>
                <p className="text-sm text-orange-700">Content Moderation Logic</p>
              </div>
            </div>
          </div>

          {/* AI Services Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Amazon Bedrock</p>
                  <p className="text-xs text-gray-600">Text Content Analysis</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Sentiment Analysis</li>
                <li>• Toxicity Detection</li>
                <li>• Spam Classification</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Amazon Rekognition</p>
                  <p className="text-xs text-gray-600">Image Content Analysis</p>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Inappropriate Content</li>
                <li>• Violence Detection</li>
                <li>• Adult Content Filter</li>
              </ul>
            </div>
          </div>
        </div>

        <ArrowDown className="mx-auto h-6 w-6 text-gray-400" />

        {/* Storage Layer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-green-900">DynamoDB</p>
              <p className="text-sm text-green-700">Results Storage & Analytics</p>
            </div>
          </div>
        </div>

        <ArrowDown className="mx-auto h-6 w-6 text-gray-400" />

        {/* Dashboard Layer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-indigo-900">Real-time Dashboard</p>
              <p className="text-sm text-indigo-700">Analytics & Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Automatic scaling with Lambda</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Pay-per-execution pricing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Real-time processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Serverless architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};