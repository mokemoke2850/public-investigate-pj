import axios from 'axios';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';

const useAxiosAuth = () => {
  const auth = useAuth();

  // トークンの自動更新と同時にヘッダーも再設定
  useEffect(() => {
    if (auth.user?.id_token) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${auth.user.id_token}`;
    }
  }, [auth.user?.id_token]);

  return axios;
};

export default useAxiosAuth;
