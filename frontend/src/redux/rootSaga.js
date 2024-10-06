import { all, fork } from "redux-saga/effects";
import { watchConnectWallet } from "./slices/users.saga";

const rootSaga = function* () {
    yield all([
        fork(watchConnectWallet),
        // Other forks
    ]);
};

export default rootSaga;