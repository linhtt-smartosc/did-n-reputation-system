import { setUser } from '../redux/slices/users.slice';
import { initContracts } from '../config/contract.config';

const connectWallet = async (dispatch) => {
    
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
            /* MetaMask is installed */
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            dispatch(setUser({ account: accounts[0] }));
            await initContracts();
            
            window.ethereum.on('accountsChanged', function (accounts) {
                dispatch(setUser({ account: accounts[0] }));
                localStorage.setItem('user', JSON.stringify({ account: accounts[0] }));
            });
        } catch (err) {
            console.error(err.message);
        }
    } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
    }
};

export default connectWallet;