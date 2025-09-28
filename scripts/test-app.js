// Test script to verify the application works without Clerk errors
const http = require('http');

console.log('🧪 Testing KabeShare application...\n');

const testUrl = 'http://localhost:3001';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'GET',
  timeout: 10000,
};

const req = http.request(options, (res) => {
  console.log(`✅ HTTP Status: ${res.statusCode}`);
  console.log(`📝 Headers: ${JSON.stringify(res.headers, null, 2)}`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📄 Response length: ${data.length} bytes`);

    // Check for specific error patterns
    if (data.includes('publishableKey passed to Clerk is invalid')) {
      console.log('❌ Clerk error still present in response');
    } else if (data.includes('Kabe Gallery') || data.includes('人気画像')) {
      console.log(
        '✅ Application loaded successfully - Japanese content found'
      );
    } else {
      console.log('⚠️  Response received but content unclear');
    }

    console.log('\n🎉 Test completed!');
  });
});

req.on('error', (err) => {
  console.log(`❌ Error: ${err.message}`);
  console.log(
    '💡 Make sure the development server is running with: npm run dev'
  );
});

req.on('timeout', () => {
  console.log('❌ Request timed out');
  req.destroy();
});

req.end();
