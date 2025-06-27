import React from 'react';
import { BarChart3, TrendingUp, Clock, Shield } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const approvalRate = analytics.totalProcessed > 0 
    ? ((analytics.approved / analytics.totalProcessed) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Processed</p>
              <p className="text-3xl font-bold">{analytics.totalProcessed}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">{analytics.approved}</p>
              <p className="text-green-200 text-xs">{approvalRate}% approval rate</p>
            </div>
            <Shield className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Flagged</p>
              <p className="text-3xl font-bold">{analytics.flagged}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Processing</p>
              <p className="text-3xl font-bold">{(analytics.averageProcessingTime / 1000).toFixed(1)}s</p>
            </div>
            <Clock className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {analytics.topFlags.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Flagged Categories</h3>
          <div className="space-y-3">
            {analytics.topFlags.map(({ flag, count }, index) => (
              <div key={flag} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-red-500' : 
                    index === 1 ? 'bg-orange-500' : 
                    index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">
                    {flag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(count / analytics.topFlags[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};