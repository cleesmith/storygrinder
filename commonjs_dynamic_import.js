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
      input: "Write a three paragraph bedtime story about a unicorn.",
      stream: true
    });

    console.log('Receiving your bedtime story:');
    console.log('=============================\n');
    
    // Process each event in the stream
    // We're looking specifically for the text delta events that contain content
    for await (const event of response) {
      console.dir(event);
      
      // The magic happens with 'response.output_text.delta' events
      // These contain small pieces of text in the 'delta' property
      if (event.type === 'response.output_text.delta') {
        // Write each piece of text immediately as it arrives
        // This creates the typewriter effect of text appearing in real-time
        // process.stdout.write(event.delta);
      }
      
      // Optional: Handle the completion event which contains the full text
      // This is useful for logging or saving the complete response
      else if (event.type === 'response.output_text.done') {
        // Add a newline after the story is complete
        console.log('\n');
        console.log('=============================');
        console.log(`Complete story: "${event.text}"`);
        console.log(`Total length: ${event.text.length} characters`);
      }
      
      // Optional: Handle other interesting events for more advanced use cases
      else if (event.type === 'response.created') {
        console.log(`Started response with ID: ${event.response.id}`);
      }
      else if (event.type === 'response.completed') {
        console.log(`\nResponse completed! Used ${event.response.usage.total_tokens} tokens.`);
        console.log(`Input tokens: ${event.response.usage.input_tokens}, Output tokens: ${event.response.usage.output_tokens}`);

        console.log('\nDEBUGGING COMPLETED RESPONSE:');
        console.log('Output details:', JSON.stringify(event.response.output, null, 2));
        console.log('Input token details:', JSON.stringify(event.response.usage.input_tokens_details, null, 2));
        console.log('Output token details:', JSON.stringify(event.response.usage.output_tokens_details, null, 2));
      }

    }
    
    console.log('\nStreaming completed successfully!');
    
  } catch (error) {
    console.error('Error during Responses API call:', error);
    
    // Provide specific guidance for Responses API issues
    if (error.message.includes('model')) {
      console.error('Hint: The model "gpt-4.1-2025-04-14" might not be available or the name might be different');
      console.error('Try checking OpenAI dashboard for available models in the Responses API');
    } else if (error.message.includes('api_key')) {
      console.error('Hint: Verify your OpenAI API key is set correctly');
    } else if (error.message.includes('responses')) {
      console.error('Hint: The Responses API might not be available in your OpenAI account tier');
    } else if (error.message.includes('user')) {
      console.error('Hint: The user parameter might be required for the Responses API');
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
