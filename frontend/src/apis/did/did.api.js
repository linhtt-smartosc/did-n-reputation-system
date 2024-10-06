import { get, post } from "../api_helper";
import { reputationContract } from "../../config/contract.config";

export async function getReputationPoint (account) {
    const reputation = await reputationContract.getReputationByOwner(account);
    return reputation;
}


