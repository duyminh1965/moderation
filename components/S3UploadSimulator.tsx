/* eslint-disable jsx-a11y/alt-text */
import { useState, useCallback, FC } from 'react';
import { Upload, Database, Zap, ArrowRight, Cloud, FileText, Video, Image } from 'lucide-react';
import { addURL } from '@/amplify/addcontent';
//import { addContent } from '@/backend/addcontent';

interface S3UploadSimulatorProps {
  onUpload: (content: string | File, type: 'text' | 'image' | 'video') => void;
  isProcessing: boolean;
}

export const S3UploadSimulator:FC<S3UploadSimulatorProps> = ({ onUpload, isProcessing }) => {
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'triggering' | 'processing' | 'complete'>('idle');
  const [dragActive, setDragActive] = useState(false);
  console.log(""+isProcessing);
  const simulateS3Upload = useCallback(async (content: string | File, type: 'text' | 'image' | 'video') => {
    // Stage 1: Upload to S3
    setUploadStage('uploading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Stage 2: S3 Event triggers Lambda
    setUploadStage('triggering');
    await new Promise(resolve => setTimeout(resolve, 800));    
    
    // Stage 3: Lambda processes content
    setUploadStage('processing');
    onUpload(content, type);
    
    // Reset after processing completes
    setTimeout(() => {
      setUploadStage('idle');
    }, 5000);
  }, [onUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];      
        simulateS3Upload(file, 'image');      
    }
  }, [simulateS3Upload]);

  const handleFileChange = useCallback( async(e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0] as File;      
        simulateS3Upload(file, 'image');
        const filename = file.name;
        const contentType = file.type;
        const url = await addURL( filename, contentType) as string;   
      
        await fetch(url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });                
      
    }
  }, [simulateS3Upload]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'uploading': return 'text-blue-600 bg-blue-100';
      case 'triggering': return 'text-purple-600 bg-purple-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'complete': return 'text-green-600 bg-green-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const isActive = (stage: string) => {
    const stages = ['uploading', 'triggering', 'processing'];
    const currentIndex = stages.indexOf(uploadStage);
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= currentIndex;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      {/* Architecture Flow Visualization */}
      <div className="mb-8 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isActive('uploading') ? 'text-blue-600 bg-blue-100 ring-2 ring-blue-300' : 'text-gray-400 bg-gray-100'
            }`}>
              <Cloud className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">S3 Bucket</p>
              <p className="text-xs text-gray-500">File Upload</p>
            </div>
          </div>

          <ArrowRight className={`h-5 w-5 transition-colors ${
            isActive('triggering') ? 'text-purple-600' : 'text-gray-300'
          }`} />

          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isActive('triggering') ? 'text-purple-600 bg-purple-100 ring-2 ring-purple-300' : 'text-gray-400 bg-gray-100'
            }`}>
              <Zap className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">Lambda Trigger</p>
              <p className="text-xs text-gray-500">Auto Invoked</p>
            </div>
          </div>

          <ArrowRight className={`h-5 w-5 transition-colors ${
            isActive('processing') ? 'text-orange-600' : 'text-gray-300'
          }`} />

          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isActive('processing') ? 'text-orange-600 bg-orange-100 ring-2 ring-orange-300' : 'text-gray-400 bg-gray-100'
            }`}>
              <Database className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">AI Processing</p>
              <p className="text-xs text-gray-500">Bedrock/Rekognition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Stage Indicator */}
      {uploadStage !== 'idle' && (
        <div className="mb-6 p-3 rounded-lg border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${getStageColor(uploadStage).split(' ')[1]}`}></div>
            <p className="text-sm font-medium text-gray-900">
              {uploadStage === 'uploading' && 'Uploading to S3 bucket...'}
              {uploadStage === 'triggering' && 'S3 event triggering Lambda function...'}
              {uploadStage === 'processing' && 'Lambda processing with AI services...'}
            </p>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploadStage !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="relative">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
          {uploadStage === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-900">
            Drop files to simulate S3 upload
          </p>
          <p className="text-sm text-gray-500">
            Files will automatically trigger Lambda function
          </p>
        </div>
        
        <input
          type="file"
          accept="image/*,video/*,.doc,.pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="s3-file-upload"
          disabled={uploadStage !== 'idle'}
        />
        <label
          htmlFor="s3-file-upload"
          className="mt-4 inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors"
        >
          Browse
        </label>
        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-1">
        <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg">
          <Image className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-gray-900">Images</p>
            <p className="text-sm text-gray-600">JPG, PNG, GIF, WEBP</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg">
          <Video className="h-6 w-6 text-purple-600" />
          <div>
            <p className="font-medium text-gray-900">Videos</p>
            <p className="text-sm text-gray-600">MP4, MOV, AVI</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Documents</p>
            <p className="text-sm text-gray-600">PDF, DOC, TXT</p>
          </div>
        </div>
      </div>
      
      </div>

      {/* Architecture Details */}
      <div className="mt-6 p-2 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">AWS Architecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">S3 PutObject Event</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Lambda Auto-Trigger</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">DynamoDB Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
