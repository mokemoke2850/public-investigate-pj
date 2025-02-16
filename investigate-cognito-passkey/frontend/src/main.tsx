import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { WebStorageStateStore } from 'oidc-client-ts';
import {
  COGNITO_AUTHORITY,
  COGNITO_CLIENT_ID,
  COGNITO_REDIRECT_URI,
} from './config';

const cognitoAuthConfig: AuthProviderProps = {
  authority: COGNITO_AUTHORITY,
  client_id: COGNITO_CLIENT_ID,
  redirect_uri: COGNITO_REDIRECT_URI,
  response_type: 'code',
  scope: 'email openid',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  onSignoutCallback: () => {
    localStorage.removeItem(`oidc.user`);
  },
  extraQueryParams: {
    lang: 'ja',
  },
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
