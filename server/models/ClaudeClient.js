/**
 * Claude API Client
 * 提供 Anthropic Claude 模型的统一接口
 */

import axios from 'axios';
import Logger from '../middleware/logger.js';

export class ClaudeClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
    this.baseURL = options.baseURL || 'https://api.anthropic.com/v1';
    this.model = options.model || process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229';
    this.version = options.version || '2023-06-01';
    this.logger = Logger.child({ module: 'ClaudeClient' });
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': this.version
      }
    });
  }

  async chat(messages, options = {}) {
    try {
      this.logger.debug('Sending chat request to Claude', { 
        model: options.model || this.model,
        messageCount: messages.length 
      });

      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversation = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await this.client.post('/messages', {
        model: options.model || this.model,
        max_tokens: options.maxTokens || this.maxTokens || 2048,
        system: systemMessage,
        messages: conversation,
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 1,
        top_k: options.top_k,
        stop_sequences: options.stop_sequences,
        stream: false
      });

      return {
        success: true,
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: response.data.model,
        stopReason: response.data.stop_reason
      };
    } catch (error) {
      this.logger.error('Claude API error', {
        error: error.response?.data?.error || error.message,
        status: error.response?.status
      });

      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        statusCode: error.response?.status
      };
    }
  }

  async stream(messages, onChunk, options = {}) {
    try {
      this.logger.debug('Starting stream request', { model: options.model || this.model });

      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversation = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const response = await this.client.post('/messages', {
        model: options.model || this.model,
        max_tokens: options.maxTokens || 2048,
        system: systemMessage,
        messages: conversation,
        temperature: options.temperature ?? 0.7,
        stream: true
      }, {
        responseType: 'stream'
      });

      let buffer = '';
      
      for await (const chunk of response.data) {
        buffer += chunk.toString();
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            
            if (data.type === 'content_block_delta') {
              const text = data.delta?.text || '';
              if (text && typeof onChunk === 'function') {
                onChunk(text);
              }
            }
          } catch (e) {
            continue;
          }
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Claude stream error', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkModelAvailability(modelName) {
    try {
      await this.chat([{ role: 'user', content: 'ping' }], { model: modelName });
      return { available: true };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  getAvailableModels() {
    return [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '最强大的模型' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: '平衡模型' },
      { id: 'claude-3-haiku-20240229', name: 'Claude 3 Haiku', description: '最快的模型' },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', description: '最新模型' }
    ];
  }
}

export default ClaudeClient;
