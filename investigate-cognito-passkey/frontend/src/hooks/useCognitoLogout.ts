import { useAuth } from 'react-oidc-context';

const useCognitoLogout = () => {
  const auth = useAuth();
  const handleLogout = async () => {
    if (!auth.user || !auth.user.access_token) {
      console.error('No access token found!');
      return;
    }
    try {
      auth.removeUser(); // `react-oidc-context` 側のセッションも削除
      localStorage.removeItem('oidc.user'); //  ローカルストレージもクリア
    } catch (error) {
      console.error('Failed to log out globally:', error);
    }
  };

  return handleLogout;
};

export default useCognitoLogout;
