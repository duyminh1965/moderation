"use client"

import React from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useModeration } from '@/hooks/useModeration';



const Page = () => {
      
  const { getAnalytics } = useModeration();
 
  const analytics = getAnalytics();
  return (
    <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Real-time insights from your content moderation system</p>
            </div>
            <AnalyticsDashboard analytics={analytics} />            
          </div>
  )
}

export default Page