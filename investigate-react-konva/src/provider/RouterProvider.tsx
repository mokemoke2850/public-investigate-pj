import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
} from 'react-router-dom';
import KonvaPage from '../pages/KonvaPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <KonvaPage />,
  },
]);

const RouterProvider = () => {
  return <ReactRouterProvider router={router} />;
};
export default RouterProvider;
