"use client";

import { ModerationResult } from '@/components/ModerationResult';
import { useModeration } from '@/hooks/useModeration';
import React from 'react';
import { History } from 'lucide-react';

const Page = () => {
  const { results } = useModeration();
  return (
     <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Moderation History</h2>
              <p className="text-gray-600">Complete history of all Lambda-processed content</p>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No history available</h3>
                <p className="text-gray-500">Start processing content to build your history</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.map((result) => (
                  <ModerationResult key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
  )
}

export default Page