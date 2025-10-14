import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './components/LandingPage';
import ExamplesPage from './components/ExamplesPage';
import GitHubCallback from './components/GitHubCallback';
import { DebugPage } from './components/DebugPage';

// Component that renders nothing - App.tsx handles the routing
const AppHandledRoute = () => null;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/examples",
        element: <ExamplesPage />,
      },
      {
        path: "/debug",
        element: <DebugPage />,
      },
      {
        path: "/connect",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
      {
        path: "/auth/callback",
        element: <GitHubCallback />,
      },
      {
        path: "/type",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
      {
        path: "/template",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
      {
        path: "/preview",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
      {
        path: "/generate",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
      {
        path: "/enhanced",
        element: <AppHandledRoute />,  // App.tsx handles this route
      },
    ],
  },
]);
