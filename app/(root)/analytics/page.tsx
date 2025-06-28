"use client"

import React, { useEffect, useState } from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useModeration } from '@/hooks/useModeration';
//import { viewAllItems } from '@/backend/aws-lambda';


const Page = () => {
      const [isActive, setIsActive] = useState(true)  
  const { getAnalytics } = useModeration();

  useEffect(() => {
        const CallData = async () => {
            const dataFirst = "";//await viewAllItems(process.env.DYNAMODB_TABLE!);
            
            return dataFirst;
        };
        if (isActive) {
            const dataone = CallData();
            console.log("dataone:" + dataone)
            setIsActive(false);
        }
    }, [isActive]);
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