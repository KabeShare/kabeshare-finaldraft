import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import { jaJP } from '@clerk/localizations';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

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
      actionText: '',
    },
    status: {
      ...(jaJP.signIn?.status || {}),
      failed: 'サインインに失敗しました。もう一度お試しください。',
    },
  },
  userProfile: {
    ...(jaJP.userProfile || {}),
    formButtonPrimary: '保存',
  },
  formFields: {
    ...(jaJP.formFields || {}),
    username: {
      ...(jaJP.formFields?.username || {}),
      label: 'ユーザー名',
      placeholder: 'ユーザー名',
    },
  },
  socialButtonsBlockButton: '{{provider|titleize}} で続ける',
  dividerText: 'または',
  errors: {
    ...(jaJP.errors || {}),
    messages: {
      identification_not_found: 'ユーザーが見つかりません。',
      session_exists: 'セッションはすでに存在します。',
      form_param_nil: '必須フィールドを入力してください。',
      form_param_invalid_format: '無効な形式です。',
      form_param_invalid_length: '無効な長さです。',
      form_param_max_length_exceeded: '長すぎます。',
      form_param_min_length_not_met: '短すぎます。',
      form_username_invalid_character:
        'ユーザー名には英数字とアンダースコア（_）のみ使用できます。',
      form_password_pwned:
        'このパスワードは漏洩したことがあります。安全なパスワードを使用してください。',
      form_identifier_not_found: '識別子が見つかりません。',
      form_password_incorrect: 'パスワードが正しくありません。',
      user_not_found: 'ユーザーが見つかりません。',
      generic_network:
        'ネットワークエラーが発生しました。もう一度お試しください。',
      generic_server: 'サーバーエラーが発生しました。もう一度お試しください。',
      client_ucs: 'ユーザーはサインインできません。管理者に連絡してください。',
    },
  },
};

export const metadata = {
  title: 'Kabe Gallery',
  description: 'E-Commerce with Next.js ',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customJaLocalization}>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
