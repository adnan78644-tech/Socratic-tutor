
import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  text: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).renderMathInElement) {
        // Fallback or custom logic if needed, but we'll use a simpler regex replacement for basic KaTeX
    }
  }, [text]);

  // A very simple markdown-ish + math renderer
  const renderContent = (content: string) => {
    // This is a naive implementation; in a production app, we'd use react-markdown + remark-math.
    // For this single-file requirement, we'll do some basic formatting.
    
    // Split by block math $$...$$
    const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        try {
          const html = (window as any).katex.renderToString(math, { displayMode: true, throwOnError: false });
          return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2" />;
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          const html = (window as any).katex.renderToString(math, { displayMode: false, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div ref={containerRef} className="prose prose-slate max-w-none">
      {renderContent(text)}
    </div>
  );
};

export default MathRenderer;
