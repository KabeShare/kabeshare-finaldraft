import connectDB from '@/config/db';
import Address from '@/models/Address';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json({
        success: false,
        message: 'Address ID is required',
      });
    }

    await connectDB();
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return NextResponse.json({
        success: false,
        message: 'Address not found or unauthorized',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
