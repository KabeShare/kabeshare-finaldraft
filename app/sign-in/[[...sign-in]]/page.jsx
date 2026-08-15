import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'サインイン | Kabe Share',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-16">
      <SignIn fallbackRedirectUrl="/" signUpUrl="/sign-up" />
    </div>
  );
}
