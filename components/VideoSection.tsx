import React from 'react';
import { Play, Video, Zap, Cloud, Database, Shield } from 'lucide-react';

export const VideoSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Video className="h-8 w-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">See AWS Lambda in Action</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how our serverless content moderation system processes uploads in real-time using AWS Lambda triggers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Player */}
          <div className="relative">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {/* Placeholder for actual video */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-blue-700 transition-colors cursor-pointer">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <p className="text-white text-lg font-medium">Demo Video</p>
                  <p className="text-gray-400 text-sm">AWS Lambda Content Moderation</p>
                </div>
                
                {/* Video overlay with tech stack */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span>Live AWS Lambda Demo</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video description */}
            <div className="mt-6 bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm rounded-lg p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-3">What You&apos;ll See</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>S3 file upload triggering Lambda function automatically</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Real-time AI analysis using Bedrock and Rekognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Instant results stored in DynamoDB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Live analytics dashboard updates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">AWS Lambda Architecture</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our serverless content moderation system demonstrates the power of AWS Lambda 
                with event-driven architecture, automatic scaling, and AI-powered analysis.
              </p>
            </div>

            {/* Architecture Flow */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm rounded-lg shadow-xl">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">S3 Event Trigger</h4>
                  <p className="text-gray-300 text-sm">File uploads automatically invoke Lambda functions with zero configuration</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm rounded-lg shadow-xl">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Lambda Processing</h4>
                  <p className="text-gray-300 text-sm">Serverless functions scale automatically and process content using AWS AI services</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm rounded-lg shadow-xl">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">AI Analysis</h4>
                  <p className="text-gray-300 text-sm">Bedrock and Rekognition provide intelligent content analysis and moderation decisions</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-900 to-blue-800 backdrop-blur-sm rounded-lg shadow-xl">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Real-time Storage</h4>
                  <p className="text-gray-300 text-sm">DynamoDB stores results for instant retrieval and comprehensive analytics</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 shadow-xl">
              <h4 className="text-white font-semibold mb-4">Performance Highlights</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">~2s</div>
                  <div className="text-blue-200 text-sm">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-blue-200 text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Auto</div>
                  <div className="text-blue-200 text-sm">Scaling</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$0.00</div>
                  <div className="text-blue-200 text-sm">Idle Cost</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto shadow-xl bg-gradient-to-br from-blue-800 via-blue-700 to-purple-950 py-16">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Try It?</h3>
            <p className="text-gray-300 mb-6">
              Experience the power of AWS Lambda with our interactive demo above. 
              Upload content and see real-time moderation in action.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Start Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};