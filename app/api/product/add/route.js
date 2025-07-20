import { v2 as cloudinary } from 'cloudinary';
import { getAuth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    console.log('Request received at /api/product/add');
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' });
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const imgdescription = formData.get('imgdescription');
    const location = formData.get('location');
    const files = formData.getAll('images');
    const imgname = formData.get('imgname');
    const commentFinalDate = formData.get('commentFinalDate');
    const point = formData.get('point');
    const hintShape = formData.get('hintShape');
    const hint = formData.get('hint');
    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      !imgdescription ||
      !location ||
      !imgname ||
      !commentFinalDate ||
      !point ||
      !hintShape ||
      !hint ||
      files.length === 0
    ) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map((res) => res.secure_url);

    await connectDB();
    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      imgdescription,
      location,
      imgname,
      commentFinalDate,
      point,
      hintShape,
      hint,
      image,
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Upload successful',
      newProduct,
    });
  } catch (error) {
    console.error('Error in /api/product/add:', error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}
