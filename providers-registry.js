// providers-registry.js - Centralized registry for all AI provider information
// This replaces scattered hardcoding throughout the app with a single source of truth

const PROVIDERS_REGISTRY = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    displayName: 'Gemini (Google)',
    description: 'Most cost-effective option for manuscript analysis',
    features: ['Most affordable', 'Ok quality', 'Fast processing'],
    emoji: '🟢',
    envVar: 'GEMINI_API_KEY',
    clientFile: './client-gemini.js',
    defaultModel: 'gemini-2.5-pro-preview-05-06',
    supportedFeatures: ['streaming', 'thinking', 'file-upload', 'large-context', '1M context window'],
    pricing: 'low',
    recommended: true,
    order: 1
  },
  
  openai: {
    id: 'openai',
    name: 'OpenAI',
    displayName: 'ChatGPT (OpenAI)', 
    description: 'Industry standard with good quality',
    features: ['Industry standard', 'Good quality', 'Higher cost per usage'],
    emoji: '🔵',
    envVar: 'OPENAI_API_KEY',
    clientFile: './client-openai.js',
    defaultModel: 'gpt-4.1-2025-04-14',
    supportedFeatures: ['streaming', 'thinking', 'large-context', '1M context window'],
    pricing: 'high',
    recommended: false,
    order: 2
  },
  
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    displayName: 'Claude (Anthropic)',
    description: 'Advanced reasoning and creative analysis',
    features: ['Ok at rough draft creative writing', 'Strong reasoning', 'Higher pricing'],
    emoji: '🟠', 
    envVar: 'ANTHROPIC_API_KEY',
    clientFile: './client-claude.js',
    defaultModel: 'claude-sonnet-4-20250514',
    supportedFeatures: ['streaming', 'thinking', '200K context window (tiny)'],
    pricing: 'high',
    recommended: false,
    order: 3
  }
};

class ProvidersRegistry {
  
  // Get all available providers
  static getAllProviders() {
    return Object.values(PROVIDERS_REGISTRY);
  }
  
  // Get all provider IDs
  static getProviderIds() {
    return Object.keys(PROVIDERS_REGISTRY);
  }
  
  // Get a specific provider
  static getProvider(id) {
    const provider = PROVIDERS_REGISTRY[id];
    if (!provider) {
      throw new Error(`Unknown provider: ${id}. Available: ${this.getProviderIds().join(', ')}`);
    }
    return provider;
  }
  
  // Get environment variable name for API key
  static getApiKeyVar(providerId) {
    return this.getProvider(providerId).envVar;
  }
  
  // Get client file path
  static getClientFile(providerId) {
    return this.getProvider(providerId).clientFile;
  }
  
  // Get display info for UI
  static getDisplayInfo(providerId) {
    const provider = this.getProvider(providerId);
    return {
      name: provider.displayName,
      description: provider.description,
      features: provider.features,
      emoji: provider.emoji,
      pricing: provider.pricing,
      recommended: provider.recommended
    };
  }
  
  // Get providers ordered for display
  static getProvidersForDisplay() {
    return this.getAllProviders().sort((a, b) => a.order - b.order);
  }
  
  // Get recommended providers
  static getRecommendedProviders() {
    return this.getAllProviders().filter(p => p.recommended);
  }
  
  // Check if provider supports feature
  static supportsFeature(providerId, feature) {
    const provider = this.getProvider(providerId);
    return provider.supportedFeatures.includes(feature);
  }
  
  // Get providers by pricing level
  static getProvidersByPricing() {
    const pricingOrder = { 'low': 1, 'medium': 2, 'high': 3 };
    return this.getAllProviders().sort((a, b) => 
      pricingOrder[a.pricing] - pricingOrder[b.pricing]
    );
  }
  
  // Validate provider exists
  static isValidProvider(providerId) {
    return PROVIDERS_REGISTRY.hasOwnProperty(providerId);
  }
  
  // Get provider name for display
  static getProviderDisplayName(providerId) {
    return this.getProvider(providerId).displayName;
  }
}

module.exports = {
  PROVIDERS_REGISTRY,
  ProvidersRegistry
};

/*
USAGE EXAMPLES:

// Replace hardcoded switch in client.js:
const { ProvidersRegistry } = require('./providers-registry');
const clientFile = ProvidersRegistry.getClientFile(selectedProvider);
const ApiServiceClass = require(clientFile);

// Replace hardcoded switch in main.js:
const apiKeyVar = ProvidersRegistry.getApiKeyVar(selectedProvider);
const hasApiKey = !!process.env[apiKeyVar];

// Generate welcome screen options dynamically:
const providers = ProvidersRegistry.getProvidersForDisplay();
providers.forEach(provider => {
  const displayInfo = ProvidersRegistry.getDisplayInfo(provider.id);
  // Create HTML option with displayInfo.name, displayInfo.emoji, etc.
});

// Check feature support:
if (ProvidersRegistry.supportsFeature('claude', 'large-context')) {
  // Use large context feature
}

// Validate user selection:
if (!ProvidersRegistry.isValidProvider(userChoice)) {
  throw new Error('Invalid provider selected');
}
*/
