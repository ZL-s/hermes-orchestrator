/**
 * OpenAI 客户端封装
 * 提供统一的接口调用 OpenAI API
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.baseURL = options.baseURL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.model = options.model || process.env.OPENAI_MODEL || 'gpt-4o';
    
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
    });
    
    this.conversations = new Map();
  }

  async chat(messages, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
        ...options,
      });

      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async stream(messages, onChunk, options = {}) {
    try {
      const stream = await this.client.chat.completions.create({
        model: options.model || this.model,
        messages: messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getEmbeddings(text) {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return {
        success: true,
        embedding: response.data[0].embedding,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default OpenAIClient;
