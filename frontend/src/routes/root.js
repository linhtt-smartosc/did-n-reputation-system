import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import IssueCredential from '../pages/IssueCredential';
import { createBrowserRouter } from 'react-router-dom';

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/issue-credential',
        element: <IssueCredential />,
    },
    {
        path: '*',
        element: <NotFound />,
    }
]);

export default routes;