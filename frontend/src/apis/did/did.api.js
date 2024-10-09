import { get, post } from "../api_helper";
import { reputationContract } from "../../config/contract.config";

export async function getReputationPoint (account) {
    const reputation = await reputationContract.getReputationByOwner(account);
    return reputation;
}

export async function getUser(address) {
    return await get(`/did/${address}`);
}

export async function createUser(address, email, role, encryptedKey, signInType) {
    const newUser = await post('/did', { address, email, role, encryptedKey, signInType });
    return newUser;
}

