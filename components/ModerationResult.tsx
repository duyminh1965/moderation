import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, FileText, Image } from 'lucide-react';
import { ModerationResult as ModerationResultType } from '../types';

interface ModerationResultProps {
  result: ModerationResultType;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'flagged':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400 animate-spin" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'flagged':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ModerationResult: React.FC<ModerationResultProps> = ({ result }) => {
  const formatContent = (content: string | File) => {
    if (typeof content === 'string') {
      return content.length > 100 ? `${content.substring(0, 100)}...` : content;
    }
    return content.name;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {result.type === 'text' ? (
            <FileText className="h-6 w-6 text-blue-500" />
          ) : (
            <Image className="h-6 w-6 text-purple-500" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {result.type === 'text' ? 'Text Content' : 'Image Upload'}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(result.status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              result.status
            )}`}
          >
            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Content:</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {formatContent(result.content)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Confidence:</span>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{result.confidence.toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Processed in {(result.processingTime / 1000).toFixed(1)}s
            </p>
          </div>
        </div>

        {result.flags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Flags:</p>
            <div className="flex flex-wrap gap-2">
              {result.flags.map((flag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full border border-orange-200"
                >
                  {flag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};