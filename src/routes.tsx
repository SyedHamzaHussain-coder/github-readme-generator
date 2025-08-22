import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './components/LandingPage';
import ExamplesPage from './components/ExamplesPage';
import { GitHubCallback } from './components/GitHubCallback';

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
        path: "/connect",
        element: null,  // Will be rendered by App.tsx with proper props
      },
      {
        path: "/auth/callback",
        element: <GitHubCallback />,
      },
      {
        path: "/type",
        element: null,  // Will be rendered by App.tsx with proper props
      },
      {
        path: "/template",
        element: null,  // Will be rendered by App.tsx with proper props
      },
      {
        path: "/preview",
        element: null,  // Will be rendered by App.tsx with proper props
      },
      {
        path: "/generate",
        element: null,  // Will be rendered by App.tsx with proper props
      },
    ],
  },
]);
