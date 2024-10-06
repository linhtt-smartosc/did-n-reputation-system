import Table from "../components/Table/Table";
import Stat from "../components/Stat/Stat";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVCByHolder, getVCByIssuer, revokeVC } from "../apis/credentials/credential.api";
import { getReputationPoint } from "../apis/did/did.api";
import connectWallet from "../utils/connectWallet.util";
import { setUser } from "../redux/slices/users.slice";

const getCredentials = async (account) => {
    try {
        return await getVCByHolder(account);
    } catch (error) {
        console.error(error);
    }
}

const Dashboard = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [totalCredential, setTotalCredential] = useState(0);
    const [reputation, setReputation] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!user.account) {
               await connectWallet();
            } else {
                window.ethereum.on('accountsChanged', function (accounts) {
                    dispatch(setUser({ account: accounts[0] }));
                    localStorage.setItem('user', JSON.stringify({ account: accounts[0] }));
                });
                const data = await getCredentials(user.account);
                console.log(data);
                
                const res = await getReputationPoint(user.account);
                setReputation(Number(res));
                if (data) {
                    setTotalCredential(data.length);
                }
            }
        };
        fetchData();
    }, [user]);

    return (
        <div>
            <Stat className="" account={user.account} totalCredential={totalCredential} reputation={reputation} />
            {/* <Table data={user.credentials} /> */}
        </div>
    )
}

export default Dashboard