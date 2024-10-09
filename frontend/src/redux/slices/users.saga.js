// src/redux/sagas/walletSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { setUser, unsetUser } from '../slices/users.slice';
import { initContracts } from '../../config/contract.config';
import { getUser, createUser } from '../../apis/did/did.api';


function* connectWalletSaga() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            /* MetaMask is installed */
            const accounts = yield call([window.ethereum, 'request'], { method: "eth_requestAccounts" }); 
            const address = accounts[0];
            let user = yield call(getUser, address);
            
            if (!user) {
                user = yield call(createUser, address, '', 'user', '', 4);
            }
            yield call(initContracts);
            yield put(setUser({ account: accounts[0], role: user.role }));
            

            window.ethereum.on('accountsChanged', async function (accounts) {
                if (!user) {
                    user = await createUser(accounts[0], '', 'user', '', 4);
                }
                put(setUser({ account: accounts[0], role: user.role }));
            });
        } catch (err) {
            console.error(err.message);
        }
    } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
    }
}

export function* watchConnectWallet() {
    yield takeLatest('CONNECT_WALLET', connectWalletSaga);
}