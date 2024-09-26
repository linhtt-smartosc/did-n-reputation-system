import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import CredentialAndDID from '../pages/CredentialAndDID';
import IssueCredential from '../pages/IssueCredential';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/credential',
        component: CredentialAndDID,
    },
    {
        path: '/issue-credential',
        component: IssueCredential,
    },
    {
        path: '*',
        component: NotFound,
    }
]

export default routes;