"use client";
import { useModeration } from "@/hooks/useModeration";
import { ModerationResult } from "@/components/ModerationResult";
import { Cloud } from "lucide-react";
import React from "react";

import { S3UploadSimulator } from "@/components/S3UploadSimulator";

const  Home = () => {
  const { results, isProcessing, moderateContent } = useModeration();    
    
  return (
    <>
    <section >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">S3 Trigger Demonstration</h2>
                <p className="text-gray-600">See how S3 file uploads automatically trigger Lambda functions</p>
              </div>
              <S3UploadSimulator onUpload={moderateContent} isProcessing={isProcessing} />
            </div>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Results</h2>
                <p className="text-gray-600">Real-time moderation results from Lambda processing</p>
              </div>
              {results.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <Cloud className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No S3 uploads yet</h3>
                  <p className="text-gray-500">Upload a file to see the Lambda trigger in action</p>
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
      </section>      
    </>
  );
}

export default Home;