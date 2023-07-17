import { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
import { AuthStoreState, useAuthStore } from './store/useAuthStore';
import BaseRouter from './router/BaseRouter';
import AdminRouter from './router/AdminRouter';
const dict = {
  ja: {
    'Back to Sign In': 'サインイン画面に戻る',
    Confirm: '確認',
    'Confirm Sign Up': 'サインアップの確認',
    'Confirmation Code': '確認コード',
    'Create Account': '新規登録',
    'Create a new account': 'アカウントの新規登録',
    'Create account': '新規登録',
    Email: 'メールアドレス',
    'Enter your code': '確認コードを入力してください',
    'Enter your Password': 'パスワードを入力してください',
    'Enter your Username': 'ユーザー名を入力してください',
    'Forget your Password': 'パスワードをお忘れの方 ',
    'Have an account? ': 'アカウント登録済みの方 ',
    Hello: 'こんにちは ',
    'Incorrect username or password': 'ユーザー名またはパスワードが異なります',
    'Lost your code? ': 'コードを紛失した方 ',
    'No account? ': 'アカウント未登録の方 ',
    Password: 'パスワード',
    'Phone Number': '電話番号',
    'Resend Code': '確認コードの再送',
    'Reset password': 'パスワードのリセット',
    'Reset your password': 'パスワードのリセット',
    'Send Code': 'コードの送信',
    'Sign In': 'サインイン',
    'Sign Out': 'サインアウト',
    'Sign in': 'サインイン',
    'Sign in to your account': 'サインイン',
    'User does not exist': 'ユーザーが存在しません',
    Username: 'ユーザー名',
    'Username cannot be empty': 'ユーザー名は必須入力です',
    'Username/client id combination not found.': 'ユーザー名が見つかりません',
    'Confirm Password': 'パスワード確認',
    'Please confirm your Password': 'もう一度パスワードを入力してください',
  },
};
I18n.putVocabularies(dict);
I18n.setLanguage('ja');

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
    userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOLS_CLIENT_ID,
  },
});

const verify = CognitoJwtVerifier.create({
  userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
  clientId: import.meta.env.VITE_AWS_USER_POOLS_CLIENT_ID,
  tokenUse: 'id',
});

function App() {
  const [jwtToken, setJwtToken] = useState('');
  const { setUserAuthInformation } = useAuthStore();
  const userGroups = useAuthStore((state) => state.userGroups);

  useEffect(() => {
    const setToken = async () => {
      const jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
      setJwtToken(jwtToken);
    };
    void setToken();
  }, []);

  useEffect(() => {
    const authJWTToken = async () => {
      try {
        console.log(jwtToken);
        const payload = await verify.verify(jwtToken);
        console.log('Token is valid. Payload:', payload);
        const newAuthState: AuthStoreState = {
          userName: payload['cognito:username'],
          userGroups: payload['cognito:groups'] ?? [],
          email: (payload.email as string) ?? ('' as string),
        };
        setUserAuthInformation(newAuthState);
      } catch (e) {
        console.log('Token not valid');
        console.log(e);
      }
    };
    void authJWTToken();
  }, [jwtToken]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <BaseRouter signOutAction={signOut} />
          {userGroups.includes('admin') && <AdminRouter />}
        </>
      )}
    </Authenticator>
  );
}

export default App;
