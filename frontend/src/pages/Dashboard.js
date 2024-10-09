import Table from "../components/Table/Table";
import Stat from "../components/Stat/Stat";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getVCByHolder } from "../apis/credentials/credential.api";
import { getReputationPoint } from "../apis/did/did.api";

const getCredentials = async (account) => {
    try {
        return await getVCByHolder(account);
    } catch (error) {
        console.error(error);
    }
}

const Dashboard = () => {
    const user = useSelector(state => state.user);
    const [totalCredential, setTotalCredential] = useState(0);
    const [reputation, setReputation] = useState(0);
    const [credentials, setCredentials] = useState([]);

    const fetchData = async (account) => {
        const data = await getCredentials(account);
        setCredentials(data);
        const res = await getReputationPoint(account);
        setReputation(Number(res));
        if (data) {
            setTotalCredential(data.length);
        };
    };

    useEffect(() => {
        if (user.account) {
            fetchData(user.account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.account]);

    return (
        <div>
            <Stat account={user.account} totalCredential={totalCredential} reputation={reputation} />
            <h1 className="flex justify-start ml-10 mt-5 text-5xl font-bold text-primary">Credentials List</h1>
            <Table data={credentials} totalItems={credentials.length} type={'revoke'} />
        </div>
    )
}

export default Dashboard