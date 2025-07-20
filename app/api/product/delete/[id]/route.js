import connectDB from '@/config/db';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import authSeller from '@/lib/authSeller';

export async function DELETE(request, { params }) {
  try {
    const { userId } = getAuth(request);
    const { id: productId } = params;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: '商品IDは必須です' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is a seller
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: '認証されていませ' },
        { status: 403 }
      );
    }

    // Allow any seller to delete any product by ID
    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: '商品が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: '削除が完了しました' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
