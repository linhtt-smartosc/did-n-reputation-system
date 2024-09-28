import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';

const sagaMiddleware = createSagaMiddleware(); 

export default configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
})