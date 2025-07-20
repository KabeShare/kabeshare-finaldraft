import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const timeframe = parseInt(searchParams.get('timeframe') || '12');

    await connectDB();

    const currentDate = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - timeframe);

    const products = await Product.find({
      'pointHistory.date': { $gte: startDate }
    });

    const artistPoints = products.reduce((acc, product) => {
      const artistName = product.name;
      
      // Calculate points within timeframe
      const pointsInTimeframe = product.pointHistory
        ?.filter(h => new Date(h.date) >= startDate)
        ?.reduce((sum, h) => sum + h.points, 0) || 0;

      if (!acc[artistName]) {
        acc[artistName] = { name: artistName, points: 0 };
      }
      acc[artistName].points += pointsInTimeframe;
      return acc;
    }, {});

    const artistPointsArray = Object.values(artistPoints)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      artistPoints: artistPointsArray,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
