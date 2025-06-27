import { BarChart3, Cloud, Shield, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">AWS Lambda-Powered Content Moderation</h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              This application demonstrates how AWS Lambda can automatically process and moderate content 
              at scale using serverless architecture with S3 triggers, AI services, and real-time analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Cloud className="h-8 w-8 text-blue-300" />
                <h4 className="font-semibold">S3 Event Trigger</h4>
              </div>
              <p className="text-sm text-gray-300">
                File uploads to S3 bucket automatically invoke Lambda function with zero configuration
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="h-8 w-8 text-purple-300" />
                <h4 className="font-semibold">Lambda Processing</h4>
              </div>
              <p className="text-sm text-gray-300">
                Serverless function scales automatically and processes content using AWS AI services
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-8 w-8 text-green-300" />
                <h4 className="font-semibold">AI Analysis</h4>
              </div>
              <p className="text-sm text-gray-300">
                Bedrock and Rekognition provide intelligent content analysis and moderation decisions
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-8 w-8 text-orange-300" />
                <h4 className="font-semibold">Real-time Results</h4>
              </div>
              <p className="text-sm text-gray-300">
                DynamoDB stores results for instant retrieval and comprehensive analytics dashboard
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Built for AWS Lambda Hackathon • Demonstrating serverless content moderation at scale
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer