/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_REDIRECT_URI: string;
  readonly VITE_COGNITO_LOGOUT_URI: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_DOMAIN: string;
}
