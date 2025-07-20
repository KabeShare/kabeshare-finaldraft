import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const { clerkId } = await req.json();
    if (!clerkId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing clerkId' }),
        { status: 400 }
      );
    }
    await clerkClient.users.deleteUser(clerkId);
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
