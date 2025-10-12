import React from 'react';
import { Download, Copy, Upload, Eye, Edit3 } from 'lucide-react';
import { Preview } from './Preview';

interface PreviewStepProps {
  readmeType: 'repository' | 'profile';
  editedReadme: string;
  setEditedReadme: (value: string) => void;
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  readmeType,
  editedReadme,
  setEditedReadme,
  previewMode,
  setPreviewMode,
  onCopy,
  onDownload,
  onUpload
}) => {

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-0">
          Your {readmeType === 'repository' ? 'Repository' : 'Profile'} README is Ready!
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onCopy}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center text-sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </button>
          <button
            onClick={onDownload}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-all duration-200 flex items-center justify-center text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={onUpload}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload to GitHub
          </button>
        </div>
      </div>

      <Preview 
        markdown={editedReadme}
        onEdit={setEditedReadme}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
      />
    </div>
  );
};
