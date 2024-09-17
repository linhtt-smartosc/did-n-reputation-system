import useAlert from "../../hooks/useAlert";
import { useEffect, useState } from "react";

const AlertPopup = () => {
    const { message, type } = useAlert();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, 5000);
    }, [message]);

    if (message && type) {   
        return (
            <div role="alert" className={`alert alert-${type} transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} md:w-1/3 w-5/6 absolute bottom-0 right-0 m-3 z-10`}>
                {type === 'info' ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="h-6 w-6 shrink-0 stroke-current">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                ) : type === 'success' ? (<svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="h-6 w-6 shrink-0 stroke-current">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                )}
                <span>{message}</span>
            </div>
        )
    } 
    return <></>
}

export default AlertPopup;  