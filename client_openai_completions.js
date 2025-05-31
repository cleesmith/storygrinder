// client_openai.js
const path = require('path');
const { OpenAI } = require('openai');
const tiktoken = require('tiktoken-node');
const fs = require('fs/promises');

/**
 * OpenAI API Service (Completions version)
 * Handles interactions with OpenAI API services using openai-node SDK
 */
class OpenAiApiService {
  constructor(config = {}) {
    this.config = {
      model_name: 'gpt-4.1-2025-04-14',
      ...config,
    };

    const apiKeyFromEnv = process.env.OPENAI_API_KEY;
    if (!apiKeyFromEnv) {
      console.error('OPENAI_API_KEY environment variable not found');
      this.apiKeyMissing = true;
      return;
    }

    this.client = new OpenAI({ apiKey: apiKeyFromEnv });

    try {
      this._localEncoder =
        tiktoken.encodingForModel(this.config.model_name) ||
        tiktoken.getEncoding('cl100k_base');
    } catch (err) {
      this._localEncoder = tiktoken.getEncoding('cl100k_base');
    }

    this.prompt = null;
  }

  /**
   * Verifies the OpenAI API key and model access.
   * @returns {Promise<boolean>}
   */
  async verifyAiAPI() {
    if (this.apiKeyMissing || !this.client) return false;
    try {
      const models = await this.client.models.list();
      const match = models.data && models.data.find((m) => m.id === this.config.model_name);
      if (match) {
        console.log(`OpenAI model accessible: ${this.config.model_name}`);
        return true;
      }
      console.error('Model not found:', this.config.model_name);
      return false;
    } catch (err) {
      console.error('OpenAI API verify error:', err.message);
      return false;
    }
  }

  /**
   * Reads a manuscript file and sets this.prompt to its content.
   * @param {string} manuscriptFile - Path to the manuscript file
   * @returns {Promise<Object>} { messages, errors }
   */
  async prepareFileAndCache(manuscriptFile) {
    const messages = [];
    const errors = [];
    try {
      const fileContent = await fs.readFile(manuscriptFile, 'utf-8');
      this.prompt = fileContent;
      messages.push('Manuscript file loaded successfully.');
    } catch (fileErr) {
      errors.push(`File read error: ${fileErr.message}`);
      this.prompt = null;
    }
    return { messages, errors };
  }

  /**
   * Streams a response using OpenAI Completions API
   * @param {string} prompt - The user prompt to send (will prepend manuscript)
   * @param {Function} onText - Callback to receive the response as it arrives
   * @param {object} options - (optional) {includeMetaData}
   */
  async streamWithThinking(prompt, onText, options = {}) {
    if (!this.client || this.apiKeyMissing) {
      throw new Error('OpenAI client not initialized - missing API key');
    }
    if (!this.prompt) {
      throw new Error('No manuscript prompt loaded. Call prepareFileAndCache() first.');
    }
    const fullPrompt = `=== MANUSCRIPT ===\n${this.prompt}\n=== MANUSCRIPT ===\n${prompt}`;
    try {
      const completion = await this.client.completions.create({
        model: this.config.model_name,
        prompt: fullPrompt,
        max_tokens: options.max_tokens || 4096,
        temperature: options.temperature || 0.3,
        stream: false, // set to true for streaming (requires handler)
      });
      let resultText = '';
      if (completion.choices && completion.choices.length > 0) {
        resultText = completion.choices[0].text;
      }
      if (options.includeMetaData) {
        resultText += '\n\n--- RESPONSE METADATA ---\n' + JSON.stringify({ model: this.config.model_name }, null, 2);
      }
      onText(resultText);
    } catch (err) {
      console.error('OpenAI completions error:', err.message);
      throw err;
    }
  }

  /**
   * Count tokens in a text string using tiktoken-node for GPT-4.1-2025-04-14.
   * @param {string} text - Text to count tokens in
   * @returns {number} - Token count (returns -1 on error)
   */
  countTokens(text) {
    try {
      if (!this._localEncoder) throw new Error('Encoder not initialized');
      return this._localEncoder.encode(text).length;
    } catch (error) {
      console.error('Token counting error:', error);
      return -1;
    }
  }
}

module.exports = OpenAiApiService;
