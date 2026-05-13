import { X } from 'lucide-react';
import { Button } from '../design-system/Button';
import svgPathsUpload from '../../../imports/svg-cqqadqx4y2';
import { getFileType } from './helpers';
import type { UploadedFile } from './types';

interface DocumentPreviewModalProps {
  file: UploadedFile;
  onClose: () => void;
  onDownload: (file: UploadedFile) => void;
}

/**
 * Full-screen file preview overlay shown when a user clicks a file row.
 * Renders mock-PDF / mock-image / generic content depending on the
 * extension; the real preview pipeline isn't wired up yet. Was an
 * inline component inside MultiFileUploadPanel; pulled out so the
 * panel body doesn't carry ~120 lines of static mock JSX.
 */
export function DocumentPreviewModal({ file, onClose, onDownload }: DocumentPreviewModalProps) {
  const fileType = getFileType(file.name);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh] max-w-[1200px] bg-white rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e4e7]">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-[#09090b] truncate">{file.name}</h3>
            <p className="text-sm text-[#71717a]">
              {file.category} • {(file.size / 1000000).toFixed(1)}MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onDownload(file)}>Download</Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f4f4f5] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#18181b]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#f9fafb]">
          <div className="h-full flex items-center justify-center">
            {fileType === 'pdf' ? (
              <div className="w-full max-w-[800px] bg-white rounded-lg shadow-lg p-8 overflow-auto">
                {/* Mock PDF Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center border-b border-[#e4e4e7] pb-4">
                    <h1 className="text-2xl font-bold text-[#09090b] mb-2">Document Preview</h1>
                    <p className="text-sm text-[#71717a]">{file.name}</p>
                  </div>

                  {/* Mock Image */}
                  <div className="w-full h-48 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="mx-auto size-16 text-[#9ca3af]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-[#9ca3af] mt-2">Sample Image</p>
                    </div>
                  </div>

                  {/* Mock Text Content */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 1: Introduction</h2>
                    <p className="text-[15px] text-[#404040] leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-[15px] text-[#404040] leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 2: Details</h2>
                    <ul className="list-disc list-inside space-y-2 text-[15px] text-[#404040]">
                      <li>First important point about the document</li>
                      <li>Second key consideration for review</li>
                      <li>Third critical element to address</li>
                      <li>Fourth requirement for compliance</li>
                    </ul>
                  </div>

                  {/* Another Mock Image */}
                  <div className="w-full h-40 bg-gradient-to-br from-[#e8f4f8] to-[#d0e8f0] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="mx-auto size-12 text-[#0891b2]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <p className="text-sm text-[#0891b2] mt-2">Chart or Graph</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 3: Summary</h2>
                    <p className="text-[15px] text-[#404040] leading-relaxed">
                      In conclusion, this document provides comprehensive information regarding the subject matter. All relevant details have been included for review and approval. Please ensure all sections are carefully examined before proceeding.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-center border-t border-[#e4e4e7] pt-4 mt-8">
                    <p className="text-xs text-[#9ca3af]">
                      Page 1 of 1 • {file.category} • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : fileType === 'image' ? (
              <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto size-24 text-[#9ca3af]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-[#09090b] mt-4">{file.name}</p>
                  <p className="text-sm text-[#71717a] mt-2">Sample Image Preview</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto size-16" fill="none" viewBox="0 0 32 32">
                    <path
                      d={svgPathsUpload.p284b0000}
                      stroke="#71717a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={svgPathsUpload.p50e1c00}
                      stroke="#71717a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={svgPathsUpload.pb8d9980}
                      stroke="#71717a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-[#09090b] mb-2">{file.name}</p>
                <p className="text-sm text-[#71717a] mb-4">Preview not available for this file type</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
