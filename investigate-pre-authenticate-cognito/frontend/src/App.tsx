import React from 'react';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  View,
  Text,
  Button,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import { signIn } from 'aws-amplify/auth';
import type { SignInInput } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

// 1. Cognitoの設定 (Amplify v6 形式)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      // loginWith: { email: true } など、必要に応じて追加
    },
  },
});

const App: React.FC = () => {
  const { toForgotPassword } = useAuthenticator((context) => [
    context.error,
    context.toForgotPassword,
  ]);

  // カスタムのサインイン処理を定義
  const services = {
    async handleSignIn(input: SignInInput) {
      try {
        // 通常の認証処理
        return await signIn(input);
      } catch (error: unknown) {
        // 3. 期限切れエラーを検知
        if (
          error instanceof Error &&
          error.message.includes('PASSWORD_EXPIRED_ERROR')
        ) {
          // ユーザーに状況を伝え、パスワード変更（リセット）へ促す
          alert(
            'パスワードの有効期限が90日を経過しました。安全のため再設定をお願いします。'
          );

          // または Amplify UI の内部状態を操作して Forgot Password 画面へ遷移させる
          toForgotPassword();

          // 認証自体は失敗として扱う
          throw new Error('Redirecting to password update...');
        }
        throw error;
      }
    },
  };

  return (
    <View padding="2rem">
      <Authenticator services={services}>
        {({ signOut, user }) => (
          <main>
            <Text>ようこそ、 {user?.username} さん</Text>
            <Button onClick={signOut}>サインアウト</Button>
          </main>
        )}
      </Authenticator>
    </View>
  );
};

export default App;
