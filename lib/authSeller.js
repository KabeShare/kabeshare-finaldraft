import { clerkClient } from '@clerk/nextjs/server';

const authSeller = async (userId) => {
    if (!userId) return false;

    try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        return user.publicMetadata?.role === 'seller';
    } catch (error) {
        // Fail closed. Returning a NextResponse here made every failed lookup
        // read as truthy at the call sites, so anonymous requests passed the check.
        console.error('authSeller lookup failed:', error?.message);
        return false;
    }
}

export default authSeller;
