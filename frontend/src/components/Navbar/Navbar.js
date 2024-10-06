import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import shortenAccount from '../../utils/shortenAccount.util';
import { setUser } from '../../redux/slices/users.slice';
import Logo from '../../assets/Logo';
import connectWallet from '../../utils/connectWallet.util';

const NavBar = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.account) {
            connectWallet(dispatch);
        } else {
            window.ethereum.on('accountsChanged', function (accounts) {
                dispatch(setUser({ account: accounts[0] }));
                localStorage.setItem('user', JSON.stringify({ account: accounts[0] }));
            });
        }
    });

    return (

        <div className="navbar sticky bg-primary text-base-100">
            {user.account ?
                <div className="flex-none">
                    <div className="drawer md:hidden z-10">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            {/* page content here */}
                            <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-5 w-5 stroke-current">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay -z-10"></label>
                            <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
                                <li><a href='/dashboard'>Dashboard</a></li>
                                <li><a href='/credential'>Verifiable Credential</a></li>
                                <li><a href='/issue-credential'>Issue</a></li>
                            </ul>
                        </div>
                    </div>
                </div> : <></>
            }
            <div className="flex-1">
                <Logo fill="#fff" width="50px" height="50px" />
                <a href='/' className="btn btn-ghost text-xl">DIDify</a>
            </div>

            {user.account ? <div className="hidden md:flex flex-0 ">
                <a href='/dashboard' className="btn btn-ghost">Dashboard</a>
                <a href='/credential' className="btn btn-ghost">Verifiable Credential</a>
                <a href='/issue-credential' className="btn btn-ghost">Issue</a>
            </div> : <></>}


            <div className="flex-none">
                {user.account ? <button className="btn btn-on-primary rounded-full font-bold">{shortenAccount(user.account)}</button> : <a href='#login-section' className="btn btn-on-primary">Login</a>}
            </div>

        </div>
    )
}

export default NavBar;