import React, { useState } from 'react';
import { SchemaBuilder } from './components/SchemaBuilder';
import { ApiService } from './services/api';
import { ExtractRequest } from '@data-slick/types';

interface AppState {
  schema: Record<string, any>;
  prompt: string;
  webhookUrl: string;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error' | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    schema: {},
    prompt: '',
    webhookUrl: '',
    isLoading: false,
    message: '',
    messageType: null
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setMessage = (message: string, type: 'success' | 'error') => {
    updateState({ message, messageType: type });
    setTimeout(() => {
      updateState({ message: '', messageType: null });
    }, 5000);
  };

  const validateForm = (): string | null => {
    if (Object.keys(state.schema).length === 0) {
      return 'Please add at least one field to your schema';
    }
    
    if (!state.prompt.trim()) {
      return 'Please enter an extraction prompt';
    }
    
    if (!state.webhookUrl.trim()) {
      return 'Please enter a webhook URL';
    }
    
    if (!ApiService.validateUrl(state.webhookUrl)) {
      return 'Please enter a valid webhook URL';
    }
    
    return null;
  };

  const handleExtractData = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError, 'error');
      return;
    }

    updateState({ isLoading: true, message: 'Processing...', messageType: null });
    
    try {
      const pageUrl = await ApiService.getCurrentTabUrl();
      
      const request: ExtractRequest = {
        pageUrl,
        webhookUrl: state.webhookUrl,
        schema: state.schema,
        prompt: state.prompt
      };

      const response = await ApiService.extractData(request);
      setMessage(`Extraction started! Job ID: ${response.jobId}`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage(`Error: ${errorMessage}`, 'error');
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <div className="w-[400px] h-[600px] p-4">
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Visual Data Extractor</h1>
        
        {/* Status Messages */}
        {state.message && (
          <div className={`p-3 rounded-md text-sm ${
            state.messageType === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : state.messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {state.message}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Data Schema
          </label>
          <div className="border border-gray-300 rounded-md p-2 min-h-[100px]">
            <SchemaBuilder 
              schema={state.schema}
              onChange={(schema) => updateState({ schema })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Extraction Prompt
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            placeholder="Describe what data to extract..."
            value={state.prompt}
            onChange={(e) => updateState({ prompt: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Webhook URL
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="https://your-webhook.com/endpoint"
            value={state.webhookUrl}
            onChange={(e) => updateState({ webhookUrl: e.target.value })}
          />
        </div>

        <button 
          onClick={handleExtractData}
          disabled={state.isLoading}
          className={`w-full font-medium py-2 px-4 rounded-md transition-colors ${
            state.isLoading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {state.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Extract Data'
          )}
        </button>
      </div>
    </div>
  )
}

export default App