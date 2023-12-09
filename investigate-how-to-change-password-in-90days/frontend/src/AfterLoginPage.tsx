import React from 'react';
import { UserAuthType } from './@types/AuthUser';
import { AuthEventData } from '@aws-amplify/ui';

type AfterLoginPageProps = {
  user?: UserAuthType;
  signOutAction: ((data?: AuthEventData | undefined) => void) | undefined;
};

const AfterLoginPage: React.FC<AfterLoginPageProps> = (props) => {
  const { user, signOutAction } = props;

  if (!user) return <h1>Not Failed...</h1>;

  return (
    <>
      <h1>Login Success!!</h1>
      <h2>Login User Info</h2>
      <section>
        <div>UserName: {user.userName}</div>
        <div>Email: {user.email}</div>
        {user.userGroups.length > 0 && (
          <div>
            Groups:
            <ul>
              {user.userGroups.map((group) => (
                <li key={group}>{group}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <button onClick={signOutAction}>Sign Out</button>
    </>
  );
};
export default AfterLoginPage;
