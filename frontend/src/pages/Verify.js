import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Table from '../components/Table/Table';
import { getRequestedVCByHolder, getRequestedVCByVerifier } from '../apis/credentials/credential.api';

const getVerifyCredentials = async (account) => {
    try {
        return await getRequestedVCByHolder(account);
    } catch (error) {
        console.error(error);
    }
}

const getPresentCredentials = async (account) => {
    try {
        return await getRequestedVCByVerifier(account);
    } catch (error) {
        console.error(error);
    }
}


const Verify = () => {
    const user = useSelector(state => state.user);
    const [presentCredential, setPresentCredential] = useState([]);
    const [verifyCredential, setVerifyCredential] = useState([]);

    const fetchData = async (account) => {
        const dataToVerify = await getVerifyCredentials(account);
        setVerifyCredential(dataToVerify);
        const dataToPresent = await getPresentCredentials(account);
        setPresentCredential(dataToPresent);
    };

    useEffect(() => {
        if (user.account) {
            fetchData(user.account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.account]);

    return (
        <div>
            <h1 className="flex justify-start ml-10 mt-5 text-5xl font-bold text-primary">Credential Presentation</h1>

            <Table data={presentCredential} totalItems={presentCredential.length} type={'request'} />

            <h1 className="flex justify-start ml-10 mt-5 text-5xl font-bold text-primary">Credential Requests</h1>
            <Table data={verifyCredential} totalItems={verifyCredential.length} type={'verify'} />

        </div>
    );
};

export default Verify;