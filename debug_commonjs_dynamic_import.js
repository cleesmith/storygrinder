// This approach keeps your existing CommonJS setup
// and dynamically imports the ES module when needed

async function createOpenAIClient() {
  // Dynamic import returns a Promise, so we await it
  const OpenAI = await import('openai');
  
  // The default export is accessed via .default
  const client = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  return client;
}

async function makeAPICall() {
  try {
    // Create the client using dynamic import
    const client = await createOpenAIClient();
    
    console.log('Creating streaming response with Responses API...\n');
    
    // Use the exact Responses API call structure you specified
    const response = await client.responses.create({
      user: "sg_drunken",
      model: "gpt-4.1-2025-04-14",
      instructions: "You are a solid creative fiction writer.",
      input: "Write a one-sentence bedtime story about a unicorn.",
      stream: true
    });

    console.log('Receiving streamed events:');
    console.log('========================');
    
    // Log each complete event to understand the structure
    // This debugging approach will reveal exactly what properties are available
    for await (const event of response) {
      console.log('\n--- New Event ---');
      console.log(event);
      console.log('--- End Event ---');
    }
    
    console.log('\n========================');
    console.log('All events processed!');
    
  } catch (error) {
    console.error('Error during Responses API call:', error);
    
    // The Responses API is quite new (March 2025), so error messages 
    // might give us clues about what's supported and what isn't
    if (error.message.includes('model')) {
      console.error('Hint: The model "gpt-4.1-2025-04-14" might not be available or the name might be different');
      console.error('Try checking OpenAI dashboard for available models in the Responses API');
    } else if (error.message.includes('api_key')) {
      console.error('Hint: Verify your OpenAI API key is set correctly');
    } else if (error.message.includes('responses')) {
      console.error('Hint: The Responses API might not be available in your OpenAI account tier');
    }
  }
}

// You can also create a reusable client instance
let openaiClient = null;

async function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = await import('openai');
    openaiClient = new OpenAI.default({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Usage in your existing CommonJS code
async function someExistingFunction() {
  const client = await getOpenAIClient();
  // Use client for API calls...
}

// Actually call the function when the script runs
console.log('Starting OpenAI API test...');

// This will execute the function immediately when you run the file
makeAPICall()
  .then(() => {
    console.log('API call completed successfully!');
  })
  .catch((error) => {
    console.error('Script failed:', error);
  });

// Export using CommonJS syntax as usual (for when this file is imported by other files)
module.exports = {
  makeAPICall,
  getOpenAIClient
};