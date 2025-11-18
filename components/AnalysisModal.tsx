
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Customer } from '../types';
import { XIcon, BrainIcon } from './icons';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, customers }) => {
  const [query, setQuery] = useState('Analyze the current queue performance and suggest improvements.');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!query) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const prompt = `
        You are an expert operations analyst for a retail service center. 
        Your task is to analyze queue data and provide actionable insights.
        The current time is ${new Date().toISOString()}.

        Here is the current queue data in JSON format:
        ${JSON.stringify(customers, null, 2)}

        And here is the user's request:
        "${query}"

        Please provide a concise analysis and suggestions based on the data and the request. 
        Format your response in clear, easy-to-read markdown.
        Focus on identifying bottlenecks, predicting wait times, and suggesting staffing adjustments if applicable.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
        }
      });
      
      setResult(response.text);

    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing the queue. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [query, customers]);


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast" role="dialog" aria-modal="true" aria-labelledby="analysis-modal-title">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 id="analysis-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
            <BrainIcon />
            Smart Insights
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <XIcon />
          </button>
        </div>
        
        <div className="p-6 space-y-4 flex-grow overflow-y-auto">
            <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-300">
                    คำถามหรือหัวข้อการวิเคราะห์ (Analysis Prompt)
                </label>
                <textarea
                    id="query"
                    rows={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Predict potential bottlenecks for the next hour."
                />
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
                    <p className="mt-4 text-indigo-300">กำลังคิดวิเคราะห์... (Analyzing...)</p>
                    <p className="text-sm text-gray-400">This may take a moment for complex queries.</p>
                </div>
            )}

            {error && (
                 <div className="p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-md">
                    <h3 className="text-lg font-semibold text-indigo-400 mb-2">ผลการวิเคราะห์ (Analysis Result)</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
        
        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end flex-shrink-0">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังวิเคราะห์...' : 'เริ่มการวิเคราะห์'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
