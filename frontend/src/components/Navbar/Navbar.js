import * as React from 'react';
import Web3 from 'web3';
import shortenAccount from '../../utils/shortenAccount';
import useAlert from '../../hooks/useAlert';


const NavBar = () => {

    const [account, setAccount] = React.useState('');
    const { setAlert } = useAlert();

    const connectToMetaMask = async () => {
        console.log("Connecting to MetaMask");
        
        if (window.ethereum) {
            await window.ethereum.enable();
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            setAlert("Non-Ethereum browser detected. Add MetaMask to your Browser!", "error");
            throw new Error('Non-Ethereum browser detected');
        }
        getAccount();
    }

    const getAccount = async () => {
        setAlert("Connected to MetaMask", "success");
        const accounts = await window.web3.eth.getAccounts();
        setAccount(shortenAccount(accounts[0]));
    }

    return (
        <div className="navbar bg-primary text-base-100">
            <div className="flex-none">
                <div className="drawer lg:hidden">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
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
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <a href='/' className="btn btn-ghost text-xl">DIDify</a>
            </div>

            <div className="flex-none">
                {account ? <button className="btn btn-on-primary rounded-full font-bold">{account}</button> : <button onClick={connectToMetaMask} className="btn btn-on-primary rounded-full font-bold">Connect</button>}
            </div>


        </div>
    )
}

export default NavBar;