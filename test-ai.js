// Test script to verify AI integration
// Run with: node test-ai.js

const testAI = async () => {
  console.log('🧪 Testing AI Integration...\n');
  
  // Check environment variables
  const hasOpenAI = process.env.OPENAI_API_KEY ? '✅' : '❌';
  console.log(`OpenAI API Key: ${hasOpenAI} ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not set'}`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('\n📝 To enable AI generation:');
    console.log('1. Get API key from: https://platform.openai.com/api-keys');
    console.log('2. Add to .env file: OPENAI_API_KEY=sk-your-key-here');
    console.log('3. For Vercel: Add in dashboard Settings → Environment Variables');
    console.log('\n✅ Templates will work without AI key!');
    return;
  }
  
  // Test API call (simplified)
  try {
    const https = require('https');
    
    const testPrompt = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'AI is working!' in markdown" }],
      max_tokens: 50
    });
    
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': testPrompt.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ AI API connection successful!');
          console.log('🚀 Your README generation will use AI');
        } else {
          console.log('❌ AI API error:', res.statusCode);
          console.log('📄 Will fall back to templates');
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ AI API connection failed:', err.message);
      console.log('📄 Will fall back to templates');
    });
    
    req.write(testPrompt);
    req.end();
    
  } catch (error) {
    console.log('❌ AI test failed:', error.message);
    console.log('📄 Will fall back to templates');
  }
};

// Load environment variables if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, using system environment
}

testAI();
