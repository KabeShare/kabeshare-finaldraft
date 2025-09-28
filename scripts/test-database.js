// Database connection diagnostic script
const mongoose = require('mongoose');

async function testDatabaseConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  console.log(`📡 Attempting to connect to: ${mongoUri}`);

  try {
    // Test connection with timeout
    await mongoose.connect(`${mongoUri}/quickcart`, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 5000,
    });

    console.log('✅ Database connection: SUCCESSFUL');

    // Test if we can query the database
    const Product = mongoose.model(
      'product',
      new mongoose.Schema({}, { strict: false })
    );
    const productCount = await Product.countDocuments();

    console.log(`📊 Products in database: ${productCount}`);

    if (productCount === 0) {
      console.log('⚠️  Database is empty - this is why you see dummy data');
      console.log('💡 You need to populate your database with products');
    } else {
      console.log(
        '✅ Database contains products - API should return real data'
      );
    }
  } catch (error) {
    console.log('❌ Database connection: FAILED');
    console.log(`🔥 Error: ${error.message}`);
    console.log(
      '\n💡 This is why the app shows dummy data instead of MongoDB data\n'
    );

    if (error.message.includes('ECONNREFUSED')) {
      console.log('🚨 Connection refused - possible causes:');
      console.log('   • MongoDB is not running on localhost:27017');
      console.log('   • MongoDB is running on a different port');
      console.log('   • Need to install MongoDB locally');
      console.log('\n🔧 Solutions:');
      console.log(
        '   1. Install MongoDB: https://www.mongodb.com/try/download/community'
      );
      console.log(
        '   2. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas'
      );
      console.log(
        '   3. Update MONGODB_URI in .env.local with correct connection string'
      );
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('🚨 Host not found - MongoDB server not accessible');
    } else {
      console.log('🚨 Other database error - check your connection string');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔚 Test completed');
  }
}

// Load environment variables manually
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');

  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!key.startsWith('#') && key.trim()) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  console.log('Could not load .env.local file:', error.message);
}

testDatabaseConnection().catch(console.error);
