import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import useCognitoLogout from '../hooks/useCognitoLogout';
import { useEffect } from 'react';
import {
  COGNITO_CLIENT_ID,
  COGNITO_DOMAIN,
  COGNITO_LOGOUT_URI,
  COGNITO_REDIRECT_URI,
} from '../config';

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const logout = useCognitoLogout();

  const signOutRedirect = () => {
    window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(
      COGNITO_LOGOUT_URI
    )}`;
  };

  const setUpPasskey = () => {
    window.location.href = `${COGNITO_DOMAIN}/passkeys/add?client_id=${COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      COGNITO_REDIRECT_URI
    )}`;
  };
  // 未認証の場合は自動で Cognito にリダイレクト！
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        <button onClick={() => setUpPasskey()}>Set up Passkey</button>
        <button onClick={() => logout()}>Sign out</button>
        <button
          onClick={() => {
            navigate('/page1');
          }}
        >
          Page1
        </button>
        <button
          onClick={() => {
            navigate('/page2');
          }}
        >
          Page2
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
};
