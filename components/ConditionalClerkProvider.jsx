'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { jaJP } from '@clerk/localizations';

const customJaLocalization = {
  ...jaJP,
  formFieldLabel__username: 'ユーザー名(アルファベットと数字のみ)',
  signUp: {
    ...(jaJP.signUp || {}),
    username: 'ユーザー名(アルファベットと数字のみ)',
    usernamePlaceholder: '英字のみ入力してください',
    formButtonPrimary: 'サインアップ',
    formFieldLabel__username: 'ユーザー名（英字のみ）',
    continue: {
      ...(jaJP.signUp?.continue || {}),
      username: 'ユーザー名(アルファベットと数字のみ)',
    },
  },
  signIn: {
    ...(jaJP.signIn || {}),
    start: {
      ...(jaJP.signIn?.start || {}),
      title: 'サインイン',
      subtitle: 'ようこそ',
      actionLink: 'アカウントをお持ちでないですか？ サインアップ',
      actionText: 'サインアップ',
      actionTextLink: 'サインアップ',
    },
    password: {
      ...(jaJP.signIn?.password || {}),
      title: 'パスワードを入力',
      subtitle: '',
      actionLink: 'パスワードを忘れましたか？',
      actionText: 'パスワードを忘れた',
      resendButton: '再送信',
    },
  },
  userProfile: {
    ...(jaJP.userProfile || {}),
    navbar: {
      ...(jaJP.userProfile?.navbar || {}),
      title: 'プロフィール',
      description: '',
      account: 'アカウント',
      security: 'セキュリティ',
    },
  },
  userButton: {
    ...(jaJP.userButton || {}),
    action__manageAccount: 'アカウント管理',
    action__signOut: 'ログアウト',
    action__signOutAll: 'すべてのアカウントからログアウト',
  },
  dividerText: 'または',
  formFieldLabel__emailAddress: 'メールアドレス',
  formFieldLabel__password: 'パスワード',
  formFieldLabel__confirmPassword: 'パスワードの確認',
  formFieldInputPlaceholder__emailAddress: 'メールアドレスを入力',
  formFieldInputPlaceholder__password: 'パスワードを入力',
  formFieldInputPlaceholder__confirmPassword: 'パスワードを再入力',
  formButtonPrimary: '続行',
  socialButtonsBlockButton: '{{provider|titleize}}でサインイン',
  unstable__errors: {
    ...(jaJP.unstable__errors || {}),
    form_identifier_not_found:
      'そのメールアドレスまたはユーザー名のアカウントが見つかりません。',
    form_password_incorrect: 'パスワードが正しくありません。',
    not_allowed_access: 'アクセスが許可されていません。',
  },
};

export function ConditionalClerkProvider({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Check if we have a valid Clerk key (exclude our placeholder key)
  const isPlaceholderKey =
    publishableKey === 'pk_test_ZGV2LWNsZXJrLWZha2Uta2V5LWZvci1kZXZlbG9wbWVudA';
  const hasValidKey =
    publishableKey &&
    !isPlaceholderKey &&
    (publishableKey.startsWith('pk_test_') ||
      publishableKey.startsWith('pk_live_')) &&
    publishableKey.length > 20; // Real Clerk keys are much longer

  if (!hasValidKey || isPlaceholderKey) {
    console.warn(
      '🔓 Clerk keys not configured properly. Running without authentication (development mode).'
    );
    return <>{children}</>;
  }

  try {
    return (
      <ClerkProvider localization={customJaLocalization}>
        {children}
      </ClerkProvider>
    );
  } catch (error) {
    console.error('ClerkProvider initialization failed:', error);
    console.warn('Falling back to no authentication mode');
    return <>{children}</>;
  }
}
