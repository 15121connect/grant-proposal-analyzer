import React from 'react';
import { Search, TrendingUp, Share2 } from 'lucide-react';
import GrantCard from './GrantCard';

function ResultsPanel({ results, isAnalyzing, onShare, shareLink }) {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Matching Results</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your proposal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Matching Results</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No results yet</p>
            <p className="text-sm">Enter your project description and click "Analyze" to find matching grants</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Matching Results</h2>
        <span className="ml-auto text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {results.length} {results.length === 1 ? 'match' : 'matches'} found
        </span>
        {results.length > 0 && (
          <button
            onClick={onShare}
            className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share results"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {results.map((result) => (
          <GrantCard
            key={result.grant.id}
            grant={result.grant}
            score={result.score}
            matchedKeywords={result.matchedKeywords}
            matchedFocus={result.matchedFocus}
            matchedRequirements={result.matchedRequirements}
          />
        ))}
      </div>
    </div>
  );
}

export default ResultsPanel;

