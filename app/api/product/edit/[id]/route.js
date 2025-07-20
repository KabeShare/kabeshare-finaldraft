import connectDB from '@/config/db';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import authSeller from '@/lib/authSeller';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    const { id: productId } = params;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const updateFields = {};

    // Handle text fields
    [
      'name',
      'description',
      'location',
      'imgname',
      'imgdescription',
      'commentFinalDate',
      'point',
      'hintShape',
      'hint',
    ].forEach((field) => {
      const value = formData.get(field);
      if (value) updateFields[field] = value;
    });

    // Handle image uploads
    const images = formData.getAll('images');
    const existingImages = formData.getAll('existingImages');

    if (images?.length > 0 && images[0] instanceof File) {
      // Upload new images to Cloudinary
      const uploadPromises = images.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      updateFields.image = uploadedUrls;
    } else if (existingImages?.length > 0) {
      // Keep existing images
      updateFields.image = existingImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
