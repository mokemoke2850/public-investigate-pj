import { Route, Routes } from 'react-router-dom';
import TopPage from '../pages/TopPage';
import { SignOutActionType } from '../store/useAuthStore';
import React from 'react';

interface BaseRouterProps {
  signOutAction: SignOutActionType;
}

const BaseRouter: React.FC<BaseRouterProps> = (props) => {
  const { signOutAction } = props;
  return (
    <Routes>
      <Route path="/" element={<TopPage signOut={signOutAction} />} />
    </Routes>
  );
};
export default BaseRouter;
