import { useContext } from 'react';
import { AlertContext } from '../context/AlertProvider';

const useAlert = () => useContext(AlertContext);

export default useAlert;