import { useAuth } from 'react-oidc-context';

function DashBoardPage() {
  const auth = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {auth?.user?.profile.email ?? 'unknown user'}!</p>
      <button onClick={() => auth.signoutRedirect()}>Logout</button>
    </div>
  );
}
export default DashBoardPage;
