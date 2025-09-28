import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { productsDummyData } from '@/assets/assets';

export async function GET() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not found, using dummy data');
      // Return dummy data if no database connection
      const recentProducts = productsDummyData.slice(0, 10);
      return NextResponse.json({ success: true, products: recentProducts });
    }

    await connectDB();

    // Fetch the last 10 products sorted by date in descending order
    const products = await Product.find({}).sort({ date: -1 }).limit(10);

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching recent products:', error);

    // Fallback to dummy data on database error
    try {
      const recentProducts = productsDummyData.slice(0, 10);
      return NextResponse.json({ success: true, products: recentProducts });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}
