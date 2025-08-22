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
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {previewMode ? 'Markdown Source' : 'Edit README'}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="h-[calc(100vh-20rem)] overflow-auto">
          <textarea
            value={markdown}
            onChange={(e) => onEdit(e.target.value)}
            className="w-full h-full resize-none border-none outline-none font-mono text-sm p-6 bg-gray-900 text-green-400"
            placeholder="Edit your README here..."
            style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.5'
            }}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Live Preview</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                previewMode
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                !previewMode
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code2 className="w-4 h-4 mr-2" />
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </button>
          </div>
        </div>
        <div className="p-6 h-[calc(100vh-20rem)] overflow-auto prose prose-sm max-w-none dark:prose-invert">
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedContent }} />
        </div>
      </div>
    </div>
  );
};
