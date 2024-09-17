import { createContext, useState } from "react";

const ALERT_TIMEOUT = 5000;
const initialState = {
    message: '',
    type: '',
};

const AlertContext = createContext({
    ...initialState,
    setAlert: () => { },
});

const AlertProvider = ({ children }) => {
    const [message, setMessage] = useState(initialState.message);
    const [type, setType] = useState(initialState.type);

    const setAlert = (message, type) => {
        
        setMessage(message);
        setType(type);

        setTimeout(() => {
            setMessage(initialState.message);
            setType(initialState.type);
        }, ALERT_TIMEOUT);
    }

    return (
        <AlertContext.Provider value={{ message, type, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export { AlertProvider, AlertContext };