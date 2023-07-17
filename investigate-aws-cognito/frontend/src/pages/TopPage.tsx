import React, { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import { SignOutActionType, useAuthStore } from '../store/useAuthStore';
import '../App.css';
import { Link } from 'react-router-dom';

interface TopPageProps {
  signOut: SignOutActionType;
}

const TopPage: React.FC<TopPageProps> = (props) => {
  const { signOut } = props;
  const [count, setCount] = useState(0);
  const userName = useAuthStore((state) => state.userName);
  const userGroups = useAuthStore((state) => state.userGroups);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p>Hello! {userName}</p>
      {userGroups.includes('admin') && (
        <p>
          <Link to="/admin">Move to Admin Page</Link>
        </p>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={signOut}>Sign out</button>
    </>
  );
};
export default TopPage;
