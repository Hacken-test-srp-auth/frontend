import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from '../pages';
import { Registration } from '../pages';
import { Profile } from '../pages';
import { DefaultLayout } from '../layout';
import { AuthGuard } from './AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DefaultLayout ,
    children: [
      {
        path: '/',
        element: <Navigate to="/profile" replace />,
      },
      {
        path: 'login',
        element: <AuthGuard Page={Login} />,
      },
      {
        path: 'registration',
        element: <AuthGuard Page={Registration} />,
      },
      {
        path: 'profile',
        element: <AuthGuard Page={Profile} />,
      },
    ],
  },
]);