import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/users.slice';

export default configureStore({
    reducer: {
        user: userReducer,
    },
})