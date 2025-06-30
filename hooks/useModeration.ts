/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useEffect } from 'react';
import { ModerationResult, AnalyticsData } from '../types';
import { gepImages, viewAllItems } from '@/amplify/addcontent';

// Simulate AWS Lambda + Bedrock/Rekognition processing
const mockModeration = async (content: string | File, type: 'text' | 'image' | 'video'): Promise<Omit<ModerationResult, 'id' | 'timestamp'>> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  const flags = [];
  let status: 'approved' | 'flagged' | 'rejected' = 'approved';
  let confidence = Math.random() * 100;
  
  // Simulate different moderation scenarios
  if (type === 'text' && typeof content === 'string') {    
    
    if (content.toLowerCase().includes('spam') || content.toLowerCase().includes('buy now')) {
      flags.push('spam');
      status = 'flagged';
      confidence = 85 + Math.random() * 15;
    }
    if (content.toLowerCase().includes('hate') || content.toLowerCase().includes('violence')) {
      flags.push('hate-speech');
      status = 'rejected';
      confidence = 90 + Math.random() * 10;
    }
    if (content.length > 5000) {
      flags.push('excessive-length');
      status = 'flagged';
      confidence = 70 + Math.random() * 20;
    }
  } else if (type === 'image') {
    const randomFlags = ['inappropriate-content', 'violence', 'adult-content', 'spam', 'copyright'];
    const shouldFlag = Math.random() > 0.7;
    
    if (shouldFlag) {
      flags.push(randomFlags[Math.floor(Math.random() * randomFlags.length)]);
      status = Math.random() > 0.5 ? 'flagged' : 'rejected';
      confidence = 75 + Math.random() * 25;
    }
  }
  
  return {
    content,
    type,
    status,
    confidence,
    flags,
    processingTime: 2000 + Math.random() * 3000
  };
};

export const useModeration = () => {
  const [results, setResults] = useState<ModerationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(true)  
  //const items = viewAllItems(process.env.DYNAMODB_TABLE!)
  useEffect(() => {
          const CallData = async () => {
              const dataFirst = await viewAllItems();  
              setResults(dataFirst as any[]);            
              return dataFirst;
          };
          if (isActive) {
              CallData();              
              //console.log("dataone:" + dataone)
              setIsActive(false);
          }
      }, [isActive]);
  //console.log("KQ: "+items);

  const moderateContent = useCallback(async (content: string | File, type: 'text' | 'image' | 'video') => {
    setIsProcessing(true);    
    
    try {      
      const result = await mockModeration(content, type);      
      //console.log("Result:",result)
      const newResult: ModerationResult = {
        ...result,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      
      setResults(prev => [newResult, ...prev]);
      
      //console.log("newResult:",newResult)
      return newResult;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getAnalytics = useCallback((): AnalyticsData => {
    const totalProcessed = results.length;
    //alert("totalProcessed : "+totalProcessed );
    const approved = results.filter(r => r.status === 'approved').length;
    const flagged = results.filter(r => r.status === 'flagged').length;
    const rejected = results.filter(r => r.status === 'rejected').length;
    const averageProcessingTime = results.reduce((acc, r) => acc + r.processingTime, 0) / totalProcessed || 0;
    
    const flagCounts = results.reduce((acc, r) => {
      r.flags.forEach(flag => {
        acc[flag] = (acc[flag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topFlags = Object.entries(flagCounts)
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProcessed,
      approved,
      flagged,
      rejected,
      averageProcessingTime,
      topFlags
    };
  }, [results]);

  return {
    results,
    isProcessing,
    moderateContent,
    getAnalytics
  };
};

