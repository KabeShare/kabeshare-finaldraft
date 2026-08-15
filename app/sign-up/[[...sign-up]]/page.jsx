import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'サインアップ | Kabe Share',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-16">
      <SignUp fallbackRedirectUrl="/" signInUrl="/sign-in" />
    </div>
  );
}
