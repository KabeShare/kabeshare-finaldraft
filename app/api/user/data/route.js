import connectDB from '@/config/db';
import User from '@/models/User';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Not signed in' });
    }

    await connectDB();
    let user = await User.findById(userId);

    // A Clerk session exists the moment sign-up finishes, but the Mongo document
    // is written by the clerk/user.created webhook, which lands a beat later.
    // Build it on demand so the first fetch after sign-up returns real data
    // instead of reporting the user missing.
    if (!user) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      const name =
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        clerkUser.username ||
        'User';

      try {
        user = await User.findOneAndUpdate(
          { _id: userId },
          {
            $setOnInsert: {
              email: clerkUser.emailAddresses[0]?.emailAddress,
              name,
              imageUrl: clerkUser.imageUrl,
              points: 500, // matches syncUserCreation in config/inngest.js
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (error) {
        if (error?.code !== 11000) throw error;

        // The webhook may have inserted this user in the gap above.
        user = await User.findById(userId);

        // Otherwise the email already belongs to an earlier record for the same
        // person — a re-registration mints a new Clerk id while the old document
        // keeps the email, and the unique index rejects the insert on every
        // request from then on. Carry the record over instead of leaving them
        // permanently unable to load their account.
        if (!user) {
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          const previous = email ? await User.findOne({ email }) : null;

          if (previous) {
            // _id is immutable, so the record has to be re-created under the new
            // Clerk id. Points, cart, and awarded products come along.
            const carried = previous.toObject();
            delete carried._id;

            await User.deleteOne({ _id: previous._id });
            user = await User.create({
              ...carried,
              _id: userId,
              name,
              imageUrl: clerkUser.imageUrl,
            });
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'User Not Found' });
    }

    return NextResponse.json({
      success: true,
      user: { ...user.toObject(), points: user.points },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
