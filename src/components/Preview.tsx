import React, { useState, useEffect } from 'react';
import { Eye, Code2 } from 'lucide-react';
import { renderMarkdown } from '../utils/markdown';

interface PreviewProps {
  markdown: string;
  onEdit: (newValue: string) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
}

export const Preview: React.FC<PreviewProps> = ({
  markdown,
  onEdit,
  previewMode,
  setPreviewMode,
}) => {
  const [renderedContent, setRenderedContent] = useState('');

  useEffect(() => {
    renderMarkdown(markdown).then(setRenderedContent);
  }, [markdown]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
            {previewMode ? 'Markdown Source' : 'Edit README'}
          </h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent rounded-full"></div>
          </div>
        </div>
        <div className="h-60 sm:h-[calc(100vh-20rem)] overflow-auto">
          <textarea
            value={markdown}
            onChange={(e) => onEdit(e.target.value)}
            className="w-full h-full resize-none border-none outline-none font-mono text-xs sm:text-sm p-3 sm:p-6 bg-gray-900 text-accent"
            placeholder="Edit your README here..."
            style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.5'
            }}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-4 lg:mt-0">
        <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Live Preview</h3>
          <div className="flex flex-row sm:flex-row bg-gray-100 rounded-lg p-0.5 sm:p-1 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => setPreviewMode(true)}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                previewMode
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              Preview
            </button>
            <button
              onClick={() => setPreviewMode(false)}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                !previewMode
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code2 className="w-4 h-4 mr-1 sm:mr-2" />
              Markdown
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-6 h-60 sm:h-[calc(100vh-20rem)] overflow-auto prose prose-xs sm:prose-sm max-w-none dark:prose-invert">
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedContent }} />
        </div>
      </div>
    </div>
  );
};

