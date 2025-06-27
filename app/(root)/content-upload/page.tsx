"use client";

import { ModerationResult } from '@/components/ModerationResult';
import { UploadZone } from '@/components/UploadZone'
import { useModeration } from '@/hooks/useModeration'
import { Settings } from 'lucide-react'
import React from 'react'

const Page = () => {
  const { results, isProcessing, moderateContent } = useModeration();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <UploadZone onUpload={moderateContent} isProcessing={isProcessing} />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>
                {results.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                      <Settings className="h-full w-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content processed yet</h3>
                    <p className="text-gray-500">Upload some content to see moderation results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.slice(0, 3).map((result) => (
                      <ModerationResult key={result.id} result={result} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
  )
}

export default Page