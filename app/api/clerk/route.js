import authSeller from '@/lib/authSeller';
import { clerkClient, getAuth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const { userId: requesterId } = getAuth(req);

    const isSeller = await authSeller(requesterId);
    if (!isSeller) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not authorized' }),
        { status: 403 }
      );
    }

    const { clerkId } = await req.json();
    if (!clerkId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing clerkId' }),
        { status: 400 }
      );
    }

    // clerkClient is an async factory in @clerk/nextjs v6; the v5 object form
    // (clerkClient.users) is undefined and threw on every call.
    const client = await clerkClient();
    await client.users.deleteUser(clerkId);

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error deleting user',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
