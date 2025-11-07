// LLM API Service
// Handles integration with LLM API for enhanced proposal analysis

/**
 * Extracts text content from uploaded files
 * @param {File[]} files - Array of file objects
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromFiles(files) {
  let extractedText = '';
  
  for (const fileObj of files) {
    const file = fileObj.file;
    
    if (file.type === 'text/plain' || file.type === 'application/pdf' || file.name.endsWith('.txt')) {
      try {
        const text = await file.text();
        extractedText += `\n\n[Content from ${file.name}]:\n${text}`;
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    } else if (file.type.startsWith('image/')) {
      // For images, we would typically use OCR or image-to-text API
      // For now, we'll just note the image
      extractedText += `\n\n[Image file: ${file.name} - content would be extracted via OCR]`;
    }
  }
  
  return extractedText;
}

/**
 * Calls LLM API to enhance proposal analysis
 * @param {string} proposalText - Original proposal text
 * @param {File[]} files - Uploaded files
 * @returns {Promise<string>} - Enhanced proposal text
 */
export async function enhanceProposalWithLLM(proposalText, files = []) {
  // Extract text from files
  let fullText = proposalText;
  
  if (files.length > 0) {
    const fileText = await extractTextFromFiles(files);
    fullText += fileText;
  }

  // LLM API integration
  // Replace with your actual LLM API endpoint
  const LLM_API_URL = process.env.REACT_APP_LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const LLM_API_KEY = process.env.REACT_APP_LLM_API_KEY;

  // If no API key is configured, return the original text with file content
  if (!LLM_API_KEY) {
    console.warn('LLM API key not configured. Using basic text matching.');
    return fullText;
  }

  try {
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a grant proposal analyzer. Extract and enhance key information from the proposal including: project goals, methodology, target community, expected outcomes, technologies, and partnerships. Return a comprehensive summary that highlights all relevant details for grant matching.'
          },
          {
            role: 'user',
            content: `Analyze this grant proposal and extract key information:\n\n${fullText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    const enhancedText = data.choices[0]?.message?.content || fullText;
    
    // Combine original text with enhanced analysis
    return `${proposalText}\n\n[Enhanced Analysis]:\n${enhancedText}`;
  } catch (error) {
    console.error('LLM API error:', error);
    // Fallback to original text with file content
    return fullText;
  }
}

export default enhanceProposalWithLLM;

