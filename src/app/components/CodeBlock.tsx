/**
 * CodeBlock Component
 * Displays code with syntax highlighting and copy functionality
 * Also supports CSS view mode to show extracted Tailwind classes
 */

import { useState } from 'react';
import { Check, Copy, Code2, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCssToggle?: boolean;
}

// Extract Tailwind classes from code
function extractTailwindClasses(code: string): {
  layout: string[];
  spacing: string[];
  colors: string[];
  typography: string[];
  borders: string[];
  effects: string[];
  sizing: string[];
  other: string[];
} {
  const classNameMatches = code.match(/className="([^"]+)"/g) || [];
  const allClasses = classNameMatches
    .map(match => match.replace(/className="|"/g, ''))
    .join(' ')
    .split(/\s+/)
    .filter(cls => cls.length > 0);

  const uniqueClasses = Array.from(new Set(allClasses));

  const categorized = {
    layout: [] as string[],
    spacing: [] as string[],
    colors: [] as string[],
    typography: [] as string[],
    borders: [] as string[],
    effects: [] as string[],
    sizing: [] as string[],
    other: [] as string[]
  };

  uniqueClasses.forEach(cls => {
    if (cls.match(/^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky)/)) {
      categorized.layout.push(cls);
    } else if (cls.match(/^(p-|px-|py-|pt-|pb-|pl-|pr-|m-|mx-|my-|mt-|mb-|ml-|mr-|gap-|space-)/)) {
      categorized.spacing.push(cls);
    } else if (cls.match(/^(bg-|text-|border-.*\[#)/)) {
      categorized.colors.push(cls);
    } else if (cls.match(/^(text-|font-|leading-|tracking-|uppercase|lowercase|capitalize)/)) {
      categorized.typography.push(cls);
    } else if (cls.match(/^(border|rounded)/)) {
      categorized.borders.push(cls);
    } else if (cls.match(/^(shadow|opacity-|transition|hover:|focus:|active:|group)/)) {
      categorized.effects.push(cls);
    } else if (cls.match(/^(w-|h-|min-w-|min-h-|max-w-|max-h-|size-)/)) {
      categorized.sizing.push(cls);
    } else {
      categorized.other.push(cls);
    }
  });

  return categorized;
}

// Convert Tailwind values to CSS-like descriptions
function describeTailwindClass(cls: string): string {
  // Custom color values
  if (cls.includes('[#')) {
    const color = cls.match(/\[#[a-fA-F0-9]+\]/)?.[0];
    return `${cls} → ${color}`;
  }
  
  // Common spacing
  const spacingMap: Record<string, string> = {
    '0': '0px', '0.5': '2px', '1': '4px', '1.5': '6px', '2': '8px', '3': '12px', 
    '4': '16px', '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px'
  };
  
  // Size classes
  const sizeMatch = cls.match(/-([\d.]+)$/);
  if (sizeMatch && spacingMap[sizeMatch[1]]) {
    return `${cls} → ${spacingMap[sizeMatch[1]]}`;
  }
  
  return cls;
}

export function CodeBlock({ code, language = 'tsx', title, showCssToggle = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'css'>('code');

  const handleCopy = () => {
    const contentToCopy = viewMode === 'code' ? code : getCssContent();
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contentToCopy)
        .then(() => {
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((clipboardError) => {
          console.log('Clipboard API blocked, using fallback:', clipboardError);
          fallbackCopy(contentToCopy);
        });
    } else {
      fallbackCopy(contentToCopy);
    }

    function fallbackCopy(text: string) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          toast.error('Failed to copy. Please copy manually.');
        }
      } catch (err) {
        console.error('Fallback copy failed:', err);
        toast.error('Failed to copy. Please copy manually.');
      }
    }
  };

  const getCssContent = () => {
    const classes = extractTailwindClasses(code);
    let content = '/* Tailwind Classes by Category */\n\n';
    
    if (classes.layout.length > 0) {
      content += '/* Layout */\n';
      classes.layout.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.sizing.length > 0) {
      content += '/* Sizing */\n';
      classes.sizing.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.spacing.length > 0) {
      content += '/* Spacing */\n';
      classes.spacing.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.colors.length > 0) {
      content += '/* Colors */\n';
      classes.colors.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.typography.length > 0) {
      content += '/* Typography */\n';
      classes.typography.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.borders.length > 0) {
      content += '/* Borders & Radius */\n';
      classes.borders.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.effects.length > 0) {
      content += '/* Effects & States */\n';
      classes.effects.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
      content += '\n';
    }
    
    if (classes.other.length > 0) {
      content += '/* Other */\n';
      classes.other.forEach(cls => content += `${describeTailwindClass(cls)}\n`);
    }
    
    return content;
  };

  const cssClasses = viewMode === 'css' ? extractTailwindClasses(code) : null;

  return (
    <div className="my-4 rounded-lg border border-[#e4e4e7] bg-[#f9fafb] overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-[#18181b] text-white text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-[#a1a1aa]">{language}</span>
        </div>
      )}
      <div className="relative">
        {showCssToggle && (
          <div className="absolute top-2 left-2 flex gap-1 bg-white border border-[#e4e4e7] rounded-md p-0.5 z-10">
            <button
              onClick={() => setViewMode('code')}
              className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                viewMode === 'code' 
                  ? 'bg-[#fc6] text-[#18181b] font-medium' 
                  : 'text-[#71717a] hover:text-[#18181b]'
              }`}
              title="View code"
            >
              <Code2 className="w-3 h-3" />
              Code
            </button>
            <button
              onClick={() => setViewMode('css')}
              className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                viewMode === 'css' 
                  ? 'bg-[#fc6] text-[#18181b] font-medium' 
                  : 'text-[#71717a] hover:text-[#18181b]'
              }`}
              title="View CSS/Tailwind classes"
            >
              <Palette className="w-3 h-3" />
              CSS
            </button>
          </div>
        )}
        
        {viewMode === 'code' ? (
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-[#18181b]">{code}</code>
          </pre>
        ) : (
          <div className="p-4 overflow-x-auto text-sm">
            <div className="space-y-4">
              {cssClasses && cssClasses.layout.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Layout</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.layout.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.sizing.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Sizing</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.sizing.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
                        {describeTailwindClass(cls)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.spacing.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Spacing</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.spacing.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                        {describeTailwindClass(cls)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.colors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Colors</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.colors.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
                        {describeTailwindClass(cls)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.typography.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Typography</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.typography.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-pink-50 text-pink-700 text-xs rounded border border-pink-200">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.borders.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Borders & Radius</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.borders.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded border border-cyan-200">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.effects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Effects & States</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.effects.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-200">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cssClasses && cssClasses.other.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#18181b] mb-2">Other</h4>
                  <div className="flex flex-wrap gap-1">
                    {cssClasses.other.map((cls, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-[#71717a]" />
          )}
        </button>
      </div>
    </div>
  );
}
