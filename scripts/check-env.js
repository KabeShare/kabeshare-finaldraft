// Environment check script
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking KabeShare development environment...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log(
  `📁 Environment file (.env.local): ${envExists ? '✅ Found' : '❌ Missing'}`
);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');

  // Check MongoDB URI
  const hasMongoUri =
    envContent.includes('MONGODB_URI=') &&
    !envContent.includes('MONGODB_URI=mongodb://localhost:27017');
  console.log(
    `🗄️  MongoDB configured: ${
      hasMongoUri ? '✅ Yes' : '⚠️  Using dummy data (OK for development)'
    }`
  );

  // Check Clerk keys
  const hasValidClerkKey =
    envContent.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_') ||
    envContent.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_');
  const isPlaceholderKey = envContent.includes(
    'pk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA'
  );

  if (hasValidClerkKey && !isPlaceholderKey) {
    console.log('🔐 Clerk authentication: ✅ Configured');
  } else if (isPlaceholderKey) {
    console.log(
      '🔐 Clerk authentication: ⚠️  Using placeholder keys (OK for development)'
    );
  } else {
    console.log('🔐 Clerk authentication: ❌ Not configured');
  }
} else {
  console.log('\n📝 Creating .env.local with development defaults...');
  const defaultEnv = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017

# Clerk Authentication (Use real keys for production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA
CLERK_SECRET_KEY=sk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA

# Application Settings
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=¥

# Google Verification
GOOGLE_VERIFICATION=placeholder`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env.local with development defaults');
}

console.log('\n🚀 Development Status:');
console.log('   • App will use dummy data if no database is connected');
console.log('   • Authentication is optional in development mode');
console.log('   • All API routes have error handling with fallbacks');
console.log('   • SEO and canonical links are configured');

console.log('\n💡 To start development server:');
console.log('   npm run dev');

console.log('\n📚 For full setup instructions, see README.dev.md\n');
