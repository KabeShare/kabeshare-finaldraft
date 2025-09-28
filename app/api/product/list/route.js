import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { productsDummyData } from '@/assets/assets';

export async function GET(request) {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not found, using dummy data');
      return NextResponse.json({ success: true, products: productsDummyData });
    }

    await connectDB();

    const products = await Product.find({});
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);

    // Fallback to dummy data on database error
    try {
      return NextResponse.json({ success: true, products: productsDummyData });
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
