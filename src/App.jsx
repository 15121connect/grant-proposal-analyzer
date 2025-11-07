import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import { analyzeProposal } from './utils/matchingAlgorithm';
import { enhanceProposalWithLLM } from './utils/llmService';
import grantsDatabase from './data/grantsDatabase';
import logo from './assets/analyzer-logo.png';

function App() {
  const [proposalText, setProposalText] = useState('');
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [files, setFiles] = useState([]);
  const [shareLink, setShareLink] = useState(null);

  // Load shared state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('share');
    
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        setProposalText(decoded.proposalText || '');
        setResults(decoded.results || []);
        // Note: Files cannot be restored from URL, only metadata
      } catch (error) {
        console.error('Error loading shared data:', error);
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!proposalText.trim()) {
      alert('Please enter a project description to analyze.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Enhance proposal with LLM if files are uploaded or if enabled
      let enhancedText = proposalText;
      if (files.length > 0) {
        enhancedText = await enhanceProposalWithLLM(proposalText, files);
      }
      
      // Analyze the enhanced proposal
      const analysisResults = analyzeProposal(enhancedText, grantsDatabase);
      setResults(analysisResults);
      
      // Clear share link when new analysis is performed
      setShareLink(null);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setProposalText('');
    setResults([]);
    setFiles([]);
    setShareLink(null);
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleShare = () => {
    const shareData = {
      proposalText,
      results,
      timestamp: new Date().toISOString()
    };
    
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    
    setShareLink(shareUrl);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      // Fallback if clipboard API fails
      prompt('Copy this link:', shareUrl);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Grant Proposal Analyzer Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">
              Grant Proposal Analyzer
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Match your innovation projects with the perfect funding opportunities
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Input Panel */}
          <InputPanel
            proposalText={proposalText}
            setProposalText={setProposalText}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
            files={files}
            setFiles={setFiles}
          />

          {/* Results Panel */}
          <ResultsPanel
            results={results}
            isAnalyzing={isAnalyzing}
            onShare={handleShare}
            shareLink={shareLink}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Grant Proposal Analyzer. Built for mission-led innovation teams.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

