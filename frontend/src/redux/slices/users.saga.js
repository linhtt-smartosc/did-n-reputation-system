// src/redux/sagas/walletSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { setUser, unsetUser } from '../slices/users.slice';
import { initContracts } from '../../config/contract.config';

function* connectWalletSaga() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            /* MetaMask is installed */
            const accounts = yield call([window.ethereum, 'request'], { method: "eth_requestAccounts" });
            yield put(setUser({ account: accounts[0] }));
            yield call(initContracts);

            window.ethereum.on('accountsChanged', function (accounts) {
                put(setUser({ account: accounts[0] }));
                localStorage.setItem('user', JSON.stringify({ account: accounts[0] }));
                console.log(accounts[0]);
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