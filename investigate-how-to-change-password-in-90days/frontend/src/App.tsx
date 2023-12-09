import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { I18n } from '@aws-amplify/core';
import { translations } from '@aws-amplify/ui';
import { UserAuthType } from './@types/AuthUser';
import AfterLoginPage from './AfterLoginPage';

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOLS_CLIENT_ID,
      userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
    },
  },
});

const verify = CognitoJwtVerifier.create({
  userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
  clientId: import.meta.env.VITE_AWS_USER_POOLS_CLIENT_ID,
  tokenUse: 'id',
});

function App() {
  const [jwtToken, setJwtToken] = useState('');
  const [userAuth, setUserAuth] = useState<UserAuthType>();

  useEffect(() => {
    const setToken = async () => {
      const jwtToken =
        (await fetchAuthSession()).tokens?.idToken?.toString() ?? '';
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
        const newAuthState: UserAuthType = {
          userName: payload['cognito:username'],
          userGroups: payload['cognito:groups'] ?? [],
          email: (payload.email as string) ?? ('' as string),
        };
        setUserAuth(newAuthState);
      } catch (e) {
        console.log('Token not valid');
        console.log(e);
      }
    };
    void authJWTToken();
  }, [jwtToken]);

  return (
    <Authenticator
      hideSignUp
      formFields={{
        setupTotp: {
          QR: {
            totpIssuer: import.meta.env.VITE_APP_NAME,
          },
        },
      }}
    >
      {({ signOut }) => (
        <AfterLoginPage signOutAction={signOut} user={userAuth} />
      )}
    </Authenticator>
  );
}

export default App;
