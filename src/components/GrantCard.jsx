import React, { useState } from 'react';
import { DollarSign, Calendar, Building2, ChevronDown, ChevronUp, CheckCircle2, Globe, Mail, Phone } from 'lucide-react';

function GrantCard({ grant, score, matchedKeywords, matchedFocus, matchedRequirements }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStrengthColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthLabel = () => {
    if (score >= 70) return 'Strong Match';
    if (score >= 40) return 'Moderate Match';
    return 'Weak Match';
  };

  const getStrengthTextColor = () => {
    if (score >= 70) return 'text-green-700';
    if (score >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{grant.funder}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{grant.amount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{grant.deadline}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Strength Meter */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
          <span className="text-sm font-bold text-gray-700">{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(score, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4 text-xs text-gray-600 mb-3">
        {matchedKeywords.length > 0 && (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {matchedKeywords.length} keyword{matchedKeywords.length !== 1 ? 's' : ''}
          </span>
        )}
        {matchedFocus.length > 0 && (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
            {matchedFocus.length} focus area{matchedFocus.length !== 1 ? 's' : ''}
          </span>
        )}
        {matchedRequirements.length > 0 && (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {matchedRequirements.length} requirement{matchedRequirements.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Focus Areas */}
          {grant.focus && grant.focus.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {grant.focus.map((area, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      matchedFocus.includes(area.toLowerCase())
                        ? 'bg-gray-200 text-gray-700 font-medium'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {area}
                    {matchedFocus.includes(area.toLowerCase()) && (
                      <CheckCircle2 className="w-3 h-3 inline ml-1" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Keywords */}
          {matchedKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {grant.requirements && grant.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements</h4>
              <ul className="space-y-1">
                {grant.requirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1">
                      {matchedRequirements.some(mr => req.toLowerCase().includes(mr)) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <span className="w-4 h-4 inline-block text-gray-400">•</span>
                      )}
                    </span>
                    <span
                      className={
                        matchedRequirements.some(mr => req.toLowerCase().includes(mr))
                          ? 'text-green-700 font-medium'
                          : ''
                      }
                    >
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {grant.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{grant.description}</p>
            </div>
          )}

          {/* More Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">More Info</h4>
            <div className="space-y-2">
              {grant.website && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <a
                    href={grant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 underline break-all"
                  >
                    {grant.website}
                  </a>
                </div>
              )}
              {grant.contact && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    {grant.contact.split(' | ').map((contactInfo, idx) => {
                      const isEmail = contactInfo.includes('@');
                      return (
                        <div key={idx} className="flex items-center gap-1">
                          {isEmail ? (
                            <Mail className="w-3 h-3 text-gray-400" />
                          ) : (
                            <Phone className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-gray-700">{contactInfo}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GrantCard;

