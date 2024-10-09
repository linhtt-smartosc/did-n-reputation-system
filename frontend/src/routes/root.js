import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import IssueCredential from '../pages/IssueCredential';
import { createBrowserRouter } from 'react-router-dom';
import Verify from '../pages/Verify';

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
        path: '/issue',
        element: <IssueCredential />,
    },
    {
        path: '/verify',
        element: <Verify />,
    },
    {
        path: '*',
        element: <NotFound />,
    }
]);

export default routes;