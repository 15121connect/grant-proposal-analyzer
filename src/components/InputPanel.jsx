import React, { useRef } from 'react';
import { FileText, Sparkles, X, Plus, File, Trash2 } from 'lucide-react';

function InputPanel({ proposalText, setProposalText, onAnalyze, onClear, isAnalyzing, files = [], setFiles }) {
  const characterCount = proposalText.length;
  const fileInputRef = useRef(null);
  const MAX_FILES = 3;
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files || [];
    
    // Check file count limit
    if (currentFiles.length + selectedFiles.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }

    // Check total size
    const currentTotalSize = currentFiles.reduce((sum, file) => sum + file.size, 0);
    const newFilesSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE) {
      alert('Total file size exceeds 5MB. Please select smaller files.');
      return;
    }

    // Add files with preview
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFiles([...currentFiles, ...newFiles]);
    e.target.value = ''; // Reset input
  };

  const handleRemoveFile = (fileId) => {
    const currentFiles = files || [];
    const fileToRemove = currentFiles.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(currentFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const currentFiles = files || [];
  const totalSize = currentFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Project Description</h2>
      </div>

      <div className="flex-1 flex flex-col">
        <textarea
          value={proposalText}
          onChange={(e) => setProposalText(e.target.value)}
          placeholder="Enter your project proposal here...&#10;&#10;Include key information such as:&#10;• Project goals and objectives&#10;• Methodology and approach&#10;• Target community or beneficiaries&#10;• Expected outcomes and impact&#10;• Technologies or innovations involved&#10;• Partnerships and collaborations"
          className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          disabled={isAnalyzing}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {characterCount} {characterCount === 1 ? 'character' : 'characters'}
            {characterCount > 0 && (
              <span className="ml-2 text-xs">
                ({characterCount < 200 ? 'Add more detail for better matching' : 'Good detail level'})
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              style={{ display: 'none' }}
              accept="*/*"
              id="file-upload-input"
              disabled={isAnalyzing || currentFiles.length >= MAX_FILES}
            />
            <label
              htmlFor="file-upload-input"
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer ${
                isAnalyzing || currentFiles.length >= MAX_FILES
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : ''
              }`}
              title={currentFiles.length >= MAX_FILES ? `Maximum ${MAX_FILES} files allowed` : 'Upload files'}
            >
              <Plus className="w-4 h-4" />
            </label>
            {proposalText && (
              <button
                onClick={onClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                disabled={isAnalyzing}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}

            <button
              onClick={onAnalyze}
              disabled={!proposalText.trim() || isAnalyzing}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>

      {/* File Thumbnails */}
      {currentFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-500">
            {currentFiles.length} file{currentFiles.length !== 1 ? 's' : ''} ({formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)})
          </div>
          <div className="flex flex-wrap gap-2">
            {currentFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="relative group bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2 max-w-full"
              >
                {fileObj.preview ? (
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <File className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{fileObj.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(fileObj.size)}</p>
                </div>
                <button
                  onClick={() => handleRemoveFile(fileObj.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  disabled={isAnalyzing}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-700">
          <strong>Tip:</strong> More detailed descriptions with specific keywords, technologies, and outcomes will yield better matching results.
        </p>
      </div>
    </div>
  );
}

export default InputPanel;

