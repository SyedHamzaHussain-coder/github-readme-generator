import React from 'react';
import ReactMarkdown from 'react-markdown';

interface LivePreviewProps {
  markdown: string;
  className?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ 
  markdown, 
  className = '' 
}) => {
  return (
    <div className={`live-preview bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              return (
                <code 
                  className={`${className} bg-gray-100 px-2 py-1 rounded text-sm font-mono`} 
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                  {children}
                </pre>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-8 pb-1 border-b border-gray-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-medium text-gray-700 mb-3 mt-6">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-600 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="ml-4">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-secondary pl-4 py-2 bg-secondary/10 text-secondary-dark italic my-4">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-secondary hover:text-secondary-dark underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-lg shadow-md my-4"
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 bg-gray-100 border border-gray-300 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border border-gray-300">
                {children}
              </td>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

