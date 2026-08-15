import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import User from '@/models/User';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { userId: requesterId } = getAuth(request);

    const isSeller = await authSeller(requesterId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'not authorized' });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required',
      });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      });
    }

    // Clerk goes first. Dropping the Mongo document while the Clerk account
    // survives lets the person sign straight back in, and /api/user/data then
    // rebuilds the record from scratch with a fresh 500 points — so a failed
    // delete used to land as a points reset.
    let clerkAccountWasMissing = false;
    try {
      const client = await clerkClient();
      await client.users.deleteUser(userId);
    } catch (error) {
      // A 404 means the Clerk account is already gone and this row is a
      // leftover: re-registering mints a new Clerk id while the old document
      // keeps the email (see the carry-over in /api/user/data). Those rows are
      // exactly the ones an admin needs to clear, so let the delete continue.
      // Any other failure leaves the record in place so the delete can be
      // retried once the cause is fixed.
      if (error?.status !== 404) {
        console.error('Clerk deleteUser failed:', error);
        return NextResponse.json({
          success: false,
          message: `Could not delete the Clerk account (${error?.status ?? 'no status'}): ${error?.message}. The user was left in the database.`,
        });
      }
      clerkAccountWasMissing = true;
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: clerkAccountWasMissing
        ? 'User deleted (no matching Clerk account existed)'
        : 'User deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
