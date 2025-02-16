import { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import DashBoardPage from '../DashBoardPage';
import Page1 from '../Page1';
import Page2 from '../Page2';
import { LoginPage } from '../LoginPage';

type Router = {
  children: ReactNode;
};

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashBoardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/page1"
        element={
          <PrivateRoute>
            <Page1 />
          </PrivateRoute>
        }
      />
      <Route
        path="/page2"
        element={
          <PrivateRoute>
            <Page2 />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default Router;
